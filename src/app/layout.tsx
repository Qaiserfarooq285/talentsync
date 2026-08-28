import type { Metadata } from "next";
import "./globals.css";
import { themeInitScript } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "TalentSync Manpower Services | Skilled Manpower Solutions Across Africa & GCC",
  description:
    "TalentSync Manpower Services supplies skilled, semi-skilled and professional workforce for construction, oil & gas, engineering and industrial projects across Africa, the GCC and beyond.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
