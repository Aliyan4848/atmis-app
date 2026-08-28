"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accessibility, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Apply" },
  { href: "/track", label: "Track Application" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Accessibility className="size-5 text-white" strokeWidth={2.3} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-text-primary">ATMIS</div>
            <div className="hidden text-[10.5px] text-text-secondary sm:block">
              Assistive Technology MIS
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-primary-light hover:text-primary-dark",
                pathname === l.href && "bg-primary-light text-primary-dark"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/track">Track</Link>
          </Button>
          {!loading && user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile"><User className="size-3.5" /> {user.fullName.split(" ")[0]}</Link>
              </Button>
              <Button size="sm" onClick={logout} variant="outline">
                <LogOut className="size-3.5" /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-text-primary md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-3 md:hidden animate-slide-up">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-[15px] font-semibold text-text-primary hover:bg-primary-light"
              >
                {l.label}
              </Link>
            ))}
            <Button className="mt-2 w-full" asChild>
              <Link href="/apply" onClick={() => setOpen(false)}>
                Apply Now
              </Link>
            </Button>
            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[15px] font-semibold text-text-primary hover:bg-primary-light"
                >
                  My Profile ({user.fullName.split(" ")[0]})
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="rounded-md px-3 py-2.5 text-left text-[15px] font-semibold text-danger hover:bg-danger/5"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-[15px] font-semibold text-text-primary hover:bg-primary-light"
              >
                Log In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
