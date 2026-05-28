import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CANDIDATES, ELECTION_END, TOTAL_VOTERS, totalVotesCast } from "@/lib/election";
import { useEffect, useState } from "react";
import { ShieldCheck, Users, Clock, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-Voting OSIS — Pemilihan Ketua & Wakil Ketua" },
      { name: "description", content: "Platform e-voting resmi pemilihan Ketua dan Wakil Ketua OSIS. Aman, transparan, real-time." },
    ],
  }),
  component: Home,
});

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const mins = Math.floor((diff / 60_000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

function Home() {
  const [cast, setCast] = useState(0);
  useEffect(() => {
    setCast(totalVotesCast());
    const i = setInterval(() => setCast(totalVotesCast()), 2000);
    return () => clearInterval(i);
  }, []);
  const { days, hours, mins, secs } = useCountdown(ELECTION_END);
  const pct = Math.min(100, Math.round((cast / TOTAL_VOTERS) * 100));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <ShieldCheck className="h-3.5 w-3.5" /> Pemilos 2026 — Aman &amp; Terpercaya
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Suaramu Hari Ini, <br />
              <span className="text-sky-300">Masa Depan OSIS</span> Kita.
            </h1>
            <p className="mt-5 max-w-lg text-base text-blue-100 md:text-lg">
              Pilih Ketua &amp; Wakil Ketua OSIS lewat platform e-voting resmi sekolah.
              Cepat, rahasia, dan transparan — bisa diakses langsung dari smartphone-mu.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-800 shadow-lg shadow-blue-950/30 transition hover:bg-blue-50"
              >
                Mulai Memilih <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/kandidat"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Lihat Kandidat
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
            <div className="text-sm font-medium text-blue-100">Status Pemilihan</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Hari", v: days },
                { label: "Jam", v: hours },
                { label: "Menit", v: mins },
                { label: "Detik", v: secs },
              ].slice(0, 4).map((s, i) => (
                <div key={i} className={`rounded-xl bg-white/10 p-3 text-center ring-1 ring-white/10 ${i === 3 ? "hidden sm:block" : ""}`}>
                  <div className="text-3xl font-bold tabular-nums">{String(s.v).padStart(2, "0")}</div>
                  <div className="text-[11px] uppercase tracking-wide text-blue-100">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Partisipasi pemilih</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-blue-100">
                <span>{cast.toLocaleString("id-ID")} suara masuk</span>
                <span>dari {TOTAL_VOTERS.toLocaleString("id-ID")} pemilih</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="mx-auto -mt-10 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <Stat icon={<Users className="h-5 w-5" />} label="Total Pemilih" value={TOTAL_VOTERS.toLocaleString("id-ID")} />
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Suara Masuk" value={cast.toLocaleString("id-ID")} accent />
          <Stat icon={<Clock className="h-5 w-5" />} label="Sisa Waktu" value={`${days} hari ${hours} jam`} />
        </div>
      </section>

      {/* Candidates preview */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Pasangan Calon</h2>
            <p className="mt-2 text-slate-600">Kenali visi, misi, dan program kerja setiap paslon sebelum memilih.</p>
          </div>
          <Link to="/kandidat" className="hidden text-sm font-semibold text-blue-700 hover:text-blue-800 md:inline">
            Semua kandidat →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {CANDIDATES.map((c) => (
            <div key={c.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <span>Pasangan Calon</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-700 text-white">{c.nomor}</span>
              </div>
              <div className="flex items-center justify-center gap-3 p-5">
                <img src={c.fotoKetua} alt={c.ketua} className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-100" />
                <img src={c.fotoWakil} alt={c.wakil} className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-100" />
              </div>
              <div className="px-5 pb-5 text-center">
                <div className="text-base font-semibold text-slate-900">{c.ketua} &amp; {c.wakil}</div>
                <p className="mt-1 text-sm italic text-slate-500">"{c.tagline}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">Cara Memilih</h2>
          <p className="mt-2 text-center text-slate-600">Tiga langkah singkat untuk menyalurkan suaramu.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, t: "Login Aman", d: "Masukkan NISN dan token unik yang kamu terima dari panitia." },
              { icon: <CheckCircle2 className="h-5 w-5" />, t: "Pilih Paslon", d: "Tinjau visi-misi, lalu pilih pasangan calon favoritmu." },
              { icon: <BarChart3 className="h-5 w-5" />, t: "Pantau Hasil", d: "Lihat hasil quick count secara real-time di dashboard." },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-white">{s.icon}</div>
                <div className="mt-4 text-base font-semibold text-slate-900">{i + 1}. {s.t}</div>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Mulai Memilih Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-4">
      <div className={`grid h-11 w-11 place-items-center rounded-lg ${accent ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700"}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900 tabular-nums">{value}</div>
      </div>
    </div>
  );
}
