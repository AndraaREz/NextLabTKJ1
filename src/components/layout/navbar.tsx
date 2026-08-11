"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Network, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  ["Tools", "/tools"],
  ["Lab", "/lab"],
  ["Learn", "/learn"],
  ["Quiz", "/quiz"],
  ["AI", "/ai"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Network className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-tight">NETLAB</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login"><Button variant="ghost">Login</Button></Link>
          <Link href="/signup"><Button>Get Started</Button></Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border transition hover:bg-muted md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 pb-4 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 pt-3" aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium hover:bg-muted"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Link href="/login" onClick={() => setOpen(false)}><Button variant="secondary" className="w-full">Login</Button></Link>
              <Link href="/signup" onClick={() => setOpen(false)}><Button className="w-full">Sign up</Button></Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
