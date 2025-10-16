"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { HiMoon, HiSun } from "react-icons/hi2";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-[rgb(var(--color-border))]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
        <Link href="/" className="text-2xl font-bold">
          My Blog
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/blog" 
            className="transition-colors hover:text-[rgb(var(--color-primary))]"
          >
            Blog
          </Link>
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md transition-colors hover:bg-[rgb(var(--color-muted))]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}