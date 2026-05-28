import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CANDIDATES, type Candidate, type ProgramIcon } from "@/lib/election";
import { useState } from "react";
import {
  Quote,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Megaphone,
  BookOpen,
  Users,
  Trophy,
  Heart,
  Leaf,
  Laptop,
  Shield,
  Palette,
  Globe,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react";

export const Route = createFileRoute("/kandidat")({
  head: () => ({
    meta: [
      { title: "Kandidat — E-Voting OSIS" },
      {
        name: "description",
        content:
          "Profil pasangan calon Ketua dan Wakil Ketua OSIS beserta visi, misi, dan program kerja unggulan.",
      },
    ],
  }),
  component: KandidatPage,
});

const ICONS: Record<ProgramIcon, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  megaphone: Megaphone,
  book: BookOpen,
  users: Users,
  trophy: Trophy,
  heart: Heart,
  leaf: Leaf,
  laptop: Laptop,
  shield: Shield,
  palette: Palette,
  globe: Globe,
  lightbulb: Lightbulb,
};

function KandidatPage() {
  const [activeId, setActiveId] = useState<number>(CANDIDATES[0].id);
  const active = CANDIDATES.find((c) => c.id === activeId) ?? CANDIDATES[0];

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Pasangan Calon
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Visi, Misi &amp; Program Kerja
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Telusuri gagasan setiap pasangan calon Ketua &amp; Wakil Ketua OSIS sebelum kamu menentukan
            pilihan. Pilih kandidat di bawah untuk membandingkan visi dan program unggulan mereka.
          </p>
        </div>
      </section>

      {/* Candidate Tabs */}
      <section className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {CANDIDATES.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`group flex shrink-0 items-center gap-3 rounded-xl border px-4 py-2.5 transition ${
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                    isActive ? "bg-white text-blue-700" : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {c.nomor}
                </span>
                <span className="text-left">
                  <span className="block text-[11px] uppercase tracking-wide opacity-80">
                    Paslon {c.nomor}
                  </span>
                  <span className="block text-sm font-semibold">
                    {c.ketua.split(" ")[0]} &amp; {c.wakil.split(" ")[0]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active candidate details */}
      <CandidateDetail key={active.id} candidate={active} />
    </Layout>
  );
}

function CandidateDetail({ candidate: c }: { candidate: Candidate }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Identity card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 px-6 py-8 text-white sm:px-10">
          <div className="absolute right-6 top-6 hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-white/20 sm:block">
            Nomor Urut {c.nomor}
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <Portrait img={c.fotoKetua} role="Ketua" name={c.ketua} kelas={c.kelasKetua} />
            <div className="hidden text-3xl font-light text-white/70 sm:block">&amp;</div>
            <Portrait img={c.fotoWakil} role="Wakil Ketua" name={c.wakil} kelas={c.kelasWakil} />
            <div className="mt-2 flex-1 text-center sm:ml-6 sm:mt-0 sm:text-left">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Tagline Kampanye
              </div>
              <p className="mt-2 font-serif text-2xl italic leading-snug text-white md:text-3xl">
                &ldquo;{c.tagline}&rdquo;
              </p>
              <Link
                to="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50"
              >
                Pilih Paslon {c.nomor} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VISI — stylized quote box */}
      <div className="mt-10">
        <SectionHeader
          eyebrow="01 — Visi"
          icon={<Target className="h-4 w-4" />}
          title="Cita-Cita Kepemimpinan"
          subtitle="Pernyataan inti yang menjadi arah perjuangan paslon selama satu periode."
        />
        <figure className="relative mt-6 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-sm md:p-12">
          <Quote
            className="absolute -left-2 -top-2 h-28 w-28 text-blue-100"
            strokeWidth={1.25}
            aria-hidden
          />
          <Quote
            className="absolute -bottom-4 -right-2 h-28 w-28 rotate-180 text-blue-100"
            strokeWidth={1.25}
            aria-hidden
          />
          <blockquote className="relative">
            <p className="font-serif text-2xl font-medium leading-snug text-slate-900 md:text-4xl md:leading-tight">
              {c.visi}
            </p>
            <figcaption className="mt-6 flex items-center gap-3 text-sm text-slate-600">
              <span className="h-px w-8 bg-blue-700" />
              <span className="font-semibold uppercase tracking-wide text-blue-700">
                Paslon {c.nomor}
              </span>
              <span>— {c.ketua} &amp; {c.wakil}</span>
            </figcaption>
          </blockquote>
        </figure>
      </div>

      {/* MISI — numbered list */}
      <div className="mt-12">
        <SectionHeader
          eyebrow="02 — Misi"
          icon={<CheckCircle2 className="h-4 w-4" />}
          title="Langkah-Langkah Strategis"
          subtitle="Komitmen konkret yang akan ditempuh untuk mewujudkan visi di atas."
        />
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {c.misi.map((m, i) => (
            <li
              key={i}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-700 text-base font-bold text-white shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < c.misi.length - 1 && (
                  <span className="mt-2 h-full w-px bg-gradient-to-b from-blue-200 to-transparent" />
                )}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Misi #{i + 1}
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-800">{m}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* PROGRAM KERJA UNGGULAN */}
      <div className="mt-12">
        <SectionHeader
          eyebrow="03 — Program Kerja Unggulan"
          icon={<Rocket className="h-4 w-4" />}
          title="Aksi Nyata di Sekolah"
          subtitle="Program flagship yang akan dieksekusi dalam 100 hari pertama kepengurusan."
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.program.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <article
                key={i}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="absolute right-4 top-4 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  0{i + 1}
                </div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-sm ring-4 ring-blue-50">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" /> Program Unggulan
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 p-8 text-white md:p-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Saatnya Bersuara
            </div>
            <h3 className="mt-2 font-serif text-2xl font-semibold md:text-3xl">
              Yakin dengan Paslon {c.nomor}? Suaramu menentukan masa depan OSIS.
            </h3>
          </div>
          <Link
            to="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-900 shadow-lg transition hover:bg-blue-50"
          >
            Mulai Memilih Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Portrait({
  img,
  role,
  name,
  kelas,
}: {
  img: string;
  role: string;
  name: string;
  kelas: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={img}
        alt={name}
        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg md:h-28 md:w-28"
      />
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">
        {role}
      </div>
      <div className="text-sm font-bold text-white">{name}</div>
      <div className="text-xs text-blue-100">{kelas}</div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  icon,
  title,
  subtitle,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-50">{icon}</span>
        {eyebrow}
      </div>
      <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm text-slate-600 md:text-base">{subtitle}</p>
    </div>
  );
}
