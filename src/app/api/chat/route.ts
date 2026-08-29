import { SYSTEM_PROMPT } from "@/lib/knowledge";

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

/** Keeps the prompt (and the bill) bounded regardless of what the client sends. */
const MAX_MESSAGES = 12;
const MAX_CHARS = 1500;

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Simple in-memory throttle. Per-instance only, but enough to stop casual abuse. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function bad(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return bad("You're sending messages a little too quickly. Please wait a moment.", 429);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Chat: GROQ_API_KEY is not configured.");
    return bad("The assistant isn't configured yet. Please use the contact form.", 503);
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.", 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter(
      (m): m is ChatMessage =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0) return bad("No message provided.", 400);

  let upstream: Response;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.4,
        // gpt-oss is a reasoning model and its hidden reasoning is billed against
        // max_tokens, so keep the thinking short and leave room for the answer.
        reasoning_effort: "low",
        // Groq's free tier reserves the FULL max_tokens against its 8k
        // tokens-per-minute budget on every call, not just what the reply uses.
        // Replies here are a few sentences, so a tight cap roughly doubles how
        // many visitors can be served per minute.
        max_tokens: 500,
        stream: true,
      }),
    });
  } catch (err) {
    console.error("Chat: could not reach Groq.", err);
    return bad("The assistant is unavailable right now. Please try again.", 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Chat: Groq returned an error.", upstream.status, detail.slice(0, 500));

    // Groq's free tier has a tokens-per-minute ceiling. Say so plainly rather
    // than implying the assistant is broken, and pass on its retry hint.
    if (upstream.status === 429) {
      const wait = detail.match(/try again in ([\d.]+)s/)?.[1];
      const secs = wait ? Math.ceil(Number(wait)) : null;
      return bad(
        secs
          ? `I'm handling a few other visitors right now — try again in about ${secs} seconds.`
          : "I'm handling a few other visitors right now — please try again in a moment.",
        429
      );
    }
    return bad("The assistant is unavailable right now. Please try again.", 502);
  }

  // Unwrap Groq's OpenAI-style SSE into a plain text stream for the client.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by a blank line; keep any partial tail.
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            for (const line of event.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const token = JSON.parse(data)?.choices?.[0]?.delta?.content;
                if (token) controller.enqueue(encoder.encode(token));
              } catch {
                // A malformed chunk shouldn't kill the whole reply.
              }
            }
          }
        }
      } catch (err) {
        console.error("Chat: stream interrupted.", err);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
