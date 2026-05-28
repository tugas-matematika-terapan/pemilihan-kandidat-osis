import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CANDIDATES, type Candidate } from "@/lib/election";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, Target, ListChecks, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/kandidat")({
  head: () => ({
    meta: [
      { title: "Kandidat — E-Voting OSIS" },
      { name: "description", content: "Profil pasangan calon Ketua dan Wakil Ketua OSIS beserta visi, misi, dan program kerja." },
    ],
  }),
  component: KandidatPage,
});

function KandidatPage() {
  const [selected, setSelected] = useState<Candidate | null>(null);

  return (
    <Layout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-sm font-semibold uppercase tracking-wider text-blue-700">Pasangan Calon</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Kenali Kandidatmu</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Tiga pasangan calon Ketua &amp; Wakil Ketua OSIS siap membawa perubahan. Pelajari visi, misi, dan program kerja mereka sebelum menentukan pilihanmu.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CANDIDATES.map((c) => (
            <article
              key={c.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 text-white">
                <span className="text-sm font-semibold">Nomor Urut</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-base font-bold text-blue-700">
                  {c.nomor}
                </span>
              </div>
              <div className="flex items-center justify-center gap-4 px-5 pt-6">
                <PersonAvatar img={c.fotoKetua} name={c.ketua} kelas={c.kelasKetua} role="Ketua" />
                <div className="text-2xl font-bold text-slate-300">&amp;</div>
                <PersonAvatar img={c.fotoWakil} name={c.wakil} kelas={c.kelasWakil} role="Wakil" />
              </div>
              <div className="px-5 pb-3 pt-5 text-center">
                <div className="text-base font-semibold text-slate-900">{c.ketua} — {c.wakil}</div>
                <p className="mt-1 text-sm italic text-slate-500">"{c.tagline}"</p>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 p-4">
                <button
                  onClick={() => setSelected(c)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
                >
                  <Eye className="h-4 w-4" /> Visi &amp; Misi
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Pilih <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-base font-bold text-white">
                    {selected.nomor}
                  </span>
                  <div>
                    <DialogTitle className="text-xl">{selected.ketua} &amp; {selected.wakil}</DialogTitle>
                    <DialogDescription className="italic">"{selected.tagline}"</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-2 flex items-center justify-center gap-6 rounded-xl bg-slate-50 py-5">
                <PersonAvatar img={selected.fotoKetua} name={selected.ketua} kelas={selected.kelasKetua} role="Ketua" />
                <PersonAvatar img={selected.fotoWakil} name={selected.wakil} kelas={selected.kelasWakil} role="Wakil" />
              </div>

              <div className="mt-5">
                <SectionTitle icon={<Target className="h-4 w-4" />} title="Visi" />
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.visi}</p>
              </div>

              <div className="mt-5">
                <SectionTitle icon={<ListChecks className="h-4 w-4" />} title="Misi" />
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {selected.misi.map((m, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <SectionTitle icon={<ListChecks className="h-4 w-4" />} title="Program Kerja" />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {selected.program.map((p, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                      <p className="mt-1 text-xs text-slate-600">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Pilih Paslon Ini <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function PersonAvatar({ img, name, kelas, role }: { img: string; name: string; kelas: string; role: string }) {
  return (
    <div className="flex flex-col items-center">
      <img src={img} alt={name} className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-100" />
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700">{role}</div>
      <div className="text-sm font-semibold text-slate-900">{name}</div>
      <div className="text-xs text-slate-500">{kelas}</div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-50">{icon}</span>
      {title}
    </div>
  );
}
