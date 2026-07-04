import Link from "next/link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#offers", label: "Offers" },
  { href: "/#about", label: "Track record" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink">
          Rohan Thomas
        </Link>
        <ul className="flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-ink-soft transition-colors hover:text-ink focus-visible:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
