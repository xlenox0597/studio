
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Feather } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Pocket Quill</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
