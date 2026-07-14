"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/observability", label: "Observability" },
  { href: "/incidents", label: "Incident Copilot" },
  { href: "/reconciliation", label: "Reconciliation" },
  { href: "/insights", label: "Business Insights" },
  { href: "/about", label: "How this was built" },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surface-page) 85%, transparent)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-14 flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight shrink-0">
            Payments Platform
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "var(--surface-card)" : "transparent",
                    border: active ? "1px solid var(--border)" : "1px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
