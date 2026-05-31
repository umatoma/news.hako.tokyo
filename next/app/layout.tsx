import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "news.hako.tokyo",
  description: "個人用ニュース集約サイト",
};

// FOUC 回避のための初期テーマ適用スクリプト。
// コンテンツ描画前に同期実行され、保存値を読み取り `.dark` クラスを初期付与する。
// import 不可のため自己完結 JS とし、保存キー "theme" と正規化規則は
// lib/theme.ts（THEME_STORAGE_KEY / parseTheme / resolveEffectiveTheme）と一致させること。
const themeInitScript = `(function () {
  try {
    var stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {
      stored = null;
    }
    var theme =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    var prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var effective = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
    if (effective === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
