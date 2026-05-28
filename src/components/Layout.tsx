import { Link, useRouterState } from "@tanstack/react-router";
import { Vote, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/kandidat", label: "Kandidat" },
  { to: "/hasil", label: "Hasil Dashboard" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-white shadow-sm">
              <Vote className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-blue-900">E-Voting OSIS</div>
              <div className="text-[11px] text-slate-500">Pemilihan Ketua &amp; Wakil</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              to="/login"
              className="ml-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Mulai Memilih
            </Link>
          </nav>
          <button
            className="md:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Mulai Memilih
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-blue-700 text-white">
                <Vote className="h-4 w-4" />
              </div>
              <span className="font-bold text-blue-900">E-Voting OSIS</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Platform pemilihan Ketua &amp; Wakil Ketua OSIS yang aman, transparan, dan modern.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Navigasi</div>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-blue-700">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Bantuan</div>
            <p className="mt-3 text-sm text-slate-600">
              Lupa token? Hubungi panitia Pemilos di ruang OSIS.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} OSIS — Dibuat untuk demokrasi sekolah.
        </div>
      </footer>
    </div>
  );
}
