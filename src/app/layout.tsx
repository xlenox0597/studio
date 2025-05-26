
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NoteProvider } from "@/contexts/NoteContext";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pocket Quill",
  description: "Your personal note-taking companion with smart features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Helper function for ThemeProvider attribute prop
declare module '@/components/ThemeProvider' {
  interface ThemeProviderProps {
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }
}
