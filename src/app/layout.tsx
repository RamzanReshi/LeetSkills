import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import LanguageOnboarding from "@/i18n/LanguageOnboarding";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetSkills",
  description: "Build the cognitive skills behind AI-era engineering.",
};

const themeInitScript = `
(() => {
  try {
    const cookieTheme = document.cookie.match(/(?:^|; )leetskills\\.theme=(light|dark)(?:;|$)/)?.[1];
    const stored = localStorage.getItem("leetskills.theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = cookieTheme || (stored === "light" || stored === "dark" ? stored : systemDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

function isTheme(value: string | undefined): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("leetskills.theme")?.value;
  const initialTheme = isTheme(themeCookie) ? themeCookie : "light";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${initialTheme === "dark" ? "dark" : ""} h-full antialiased`}
      style={{ colorScheme: initialTheme }}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-neutral-900">
        <script
          id="leetskills-theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <LanguageProvider>
          <ThemeProvider initialTheme={initialTheme}>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <LanguageOnboarding />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
