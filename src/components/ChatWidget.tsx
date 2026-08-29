"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BotAvatar, { WavingHand } from "./BotAvatar";
import { contact } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };

const GREETING =
  "I'm the TalentSync assistant. Ask me about our services, the countries we cover, or how to request manpower.";

const SUGGESTIONS = [
  "Your services?",
  "Countries covered?",
  "How do I hire?",
  "Your process?",
];

const TEASER_DELAY_MS = 2600;
const TEASER_KEY = "ts-chat-teaser-seen";

/**
 * The model is told to write plain text, but reasoning models slip into markdown
 * anyway. Stripping it here means stray asterisks can never reach the bubble.
 */
function toPlainText(text: string) {
  return (
    text
      // ```code fences``` -> just the contents
      .replace(/```[a-z]*\n?([\s\S]*?)```/gi, "$1")
      .replace(/`([^`]+)`/g, "$1")
      // **bold** / __bold__ / *italic* / _italic_
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,!?)]|$)/g, "$1$2")
      .replace(/(^|[\s(])_([^_\n]+)_(?=[\s.,!?)]|$)/g, "$1$2")
      // [label](url) -> label
      .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")
      // ### headings, and bullet markers of every flavour
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s*[-*+•]\s+/gm, "- ")
      // any leftover emphasis asterisks
      .replace(/\*/g, "")
      // trailing double-space line breaks, and runs of blank lines
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * How far the on-screen keyboard intrudes, and how tall the visible area is.
   * The panel is position:fixed, so it anchors to the LAYOUT viewport, which
   * does not shrink when the keyboard opens — without this the keyboard simply
   * covers the panel on phones.
   */
  const [viewport, setViewport] = useState({ inset: 0, height: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Nudge first-time visitors once, then leave them alone for the session.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
      // Private browsing — just show it.
    }
    if (seen) return;
    const id = setTimeout(() => setTeaser(true), TEASER_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // Nothing to persist to; the timer above simply runs again next load.
    }
  }, []);

  // Keep the newest message in view as tokens stream in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel from anywhere inside it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!open || !vv) return;

    function update() {
      const v = window.visualViewport;
      if (!v) return;
      // Bottom of the layout viewport that is currently hidden (keyboard, and
      // on iOS the collapsing browser chrome).
      const inset = Math.max(0, window.innerHeight - v.height - v.offsetTop);
      setViewport({ inset: Math.round(inset), height: Math.round(v.height) });
    }

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  // Keep the latest message visible when the keyboard pushes the panel up.
  useEffect(() => {
    if (!viewport.inset) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [viewport.inset]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function openPanel() {
    dismissTeaser();
    // Start from a clean position; the visualViewport effect corrects it on mount.
    setViewport({ inset: 0, height: 0 });
    setOpen(true);
  }

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      setError(null);
      setInput("");
      const history = [...messages, { role: "user" as const, content: question }];
      setMessages(history);
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "The assistant is unavailable right now.");
        }

        // Append an empty assistant turn, then fill it as tokens arrive.
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const shown = toPlainText(acc);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", content: shown };
            return next;
          });
        }

        if (!acc.trim()) {
          throw new Error("The assistant didn't reply. Please try again.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Drop the empty placeholder so the error isn't shown under a blank bubble.
        setMessages((prev) =>
          prev.length && prev[prev.length - 1].role === "assistant" && !prev[prev.length - 1].content
            ? prev.slice(0, -1)
            : prev
        );
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages]
  );

  return (
    <>
      {/* ---------------- Launcher ---------------- */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-5 sm:right-5 print:hidden">
        {teaser && !open && (
          <div className="animate-chat-bubble-in relative max-w-[248px] rounded-2xl rounded-br-md bg-surface px-4 py-3 shadow-[0_10px_34px_rgba(11,60,116,.20)] ring-1 ring-border">
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Dismiss"
              className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue-ink text-white/80 transition-colors hover:text-white"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" onClick={openPanel} className="block text-left">
              <p className="text-[14px] font-semibold text-text-primary">
                Hey! <WavingHand />
              </p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-text-body">
                How can I help you today?
              </p>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          aria-expanded={open}
          aria-controls="talentsync-chat-panel"
          aria-label={open ? "Close the assistant" : "Open the TalentSync assistant"}
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-blue-deep sm:h-[58px] sm:w-[58px] shadow-[0_10px_30px_rgba(11,60,116,.42)] outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-4 focus-visible:ring-brand-orange/50 active:scale-95"
        >
          {!open && (
            <span
              className="animate-chat-ring absolute inset-0 rounded-full bg-brand-orange"
              aria-hidden="true"
            />
          )}
          <span className="relative">
            {open ? (
              <svg width="20" height="20" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <BotAvatar size={34} />
            )}
          </span>
        </button>
      </div>

      {/* ---------------- Panel ---------------- */}
      {open && (
        <div
          id="talentsync-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="TalentSync assistant"
          className="animate-chat-pop fixed inset-x-3 bottom-[80px] z-[60] flex h-[min(56dvh,420px)] flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_24px_70px_rgba(10,31,56,.32)] ring-1 ring-border transition-[bottom,height] duration-200 ease-out motion-reduce:transition-none sm:inset-x-auto sm:bottom-[92px] sm:right-5 sm:h-[min(540px,calc(100dvh-150px))] sm:w-[386px] print:hidden"
          style={
            viewport.inset > 0
              ? {
                  // Sit just above the keyboard, and shrink to the space left so
                  // the header stays on screen and the messages keep scrolling.
                  // This uses `bottom` rather than a transform because the
                  // chat-pop entry animation has fill-mode:both and would
                  // otherwise override any transform set here.
                  bottom: `${viewport.inset + 12}px`,
                  height: `${Math.max(220, viewport.height - 84)}px`,
                }
              : undefined
          }
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 bg-brand-blue-deep px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10">
              <BotAvatar size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold text-white">TalentSync Assistant</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
                Online · replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the assistant"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-surface-alt px-3.5 py-3.5 sm:px-4 sm:py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            <div className="flex flex-col gap-3">
              <Bubble role="assistant">
                <span className="font-semibold">
                  Hey! <WavingHand />
                </span>{" "}
                {GREETING}
              </Bubble>

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content}
                </Bubble>
              ))}

              {busy && messages[messages.length - 1]?.role === "user" && <Typing />}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-error/40 bg-error/10 px-3.5 py-2.5 text-[13px] leading-relaxed text-error"
                >
                  {error} You can also email{" "}
                  <a href={`mailto:${contact.email}`} className="font-semibold underline">
                    {contact.email}
                  </a>
                  .
                </div>
              )}

              {messages.length === 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border-strong bg-surface px-2.5 py-1 text-[12px] font-medium text-text-strong transition-colors hover:border-brand-orange hover:text-brand-orange sm:px-3 sm:py-1.5 sm:text-[12.5px]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-border bg-surface px-2.5 py-2.5 sm:px-3 sm:py-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={1500}
              placeholder="Ask about our services…"
              aria-label="Message"
              className="max-h-[110px] min-h-[42px] flex-1 resize-none rounded-xl border border-border-input bg-surface-input px-3.5 py-2.5 text-[14px] leading-snug text-text-primary outline-none transition-colors placeholder:text-text-subtle-2 focus:border-brand-blue"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white transition-colors hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M2.5 10L17 3l-4 14-3.2-5.4L2.5 10z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-border">
          <BotAvatar size={19} />
        </span>
      )}
      <div
        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13.2px] leading-[1.5] sm:px-3.5 sm:py-2.5 sm:text-[13.8px] ${
          isUser
            ? "rounded-br-md bg-brand-blue-deep text-white"
            : "rounded-bl-md bg-surface text-text-strong ring-1 ring-border"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2">
      <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-border">
        <BotAvatar size={19} />
      </span>
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3.5 ring-1 ring-border">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-text-subtle-2"
            style={{ animation: `chat-dot 1.2s ${i * 0.16}s infinite ease-in-out` }}
          />
        ))}
      </div>
    </div>
  );
}
