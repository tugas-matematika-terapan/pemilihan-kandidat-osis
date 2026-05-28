import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CANDIDATES, castVote, getSession } from "@/lib/election";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [{ title: "Surat Suara — E-Voting OSIS" }],
  }),
  component: VotePage,
});

function VotePage() {
  const nav = useNavigate();
  const [nisn, setNisn] = useState<string | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      nav({ to: "/login" });
      return;
    }
    setNisn(s);
  }, [nav]);

  if (!nisn) return null;
  const chosen = CANDIDATES.find((c) => c.id === picked) || null;

  const submit = () => {
    if (!picked || !nisn) return;
    setSubmitting(true);
    setTimeout(() => {
      castVote(picked, nisn);
      nav({ to: "/success" });
    }, 600);
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">Surat Suara Elektronik</div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Pilih Pasangan Calon</h1>
              <p className="mt-1 text-sm text-slate-600">
                Pemilih: <span className="font-semibold text-slate-800">NISN {nisn}</span> · Pilihan bersifat rahasia.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Sesi terverifikasi
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {CANDIDATES.map((c) => {
              const active = picked === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setPicked(c.id)}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition ${
                    active ? "border-blue-600 shadow-lg ring-4 ring-blue-100" : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  {active && (
                    <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Dipilih
                    </span>
                  )}
                  <div className="flex items-center justify-between bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                    Nomor Urut
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-base font-bold text-white">
                      {c.nomor}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-5">
                    <img src={c.fotoKetua} alt={c.ketua} className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-100" />
                    <img src={c.fotoWakil} alt={c.wakil} className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-100" />
                  </div>
                  <div className="px-5 pb-5 text-center">
                    <div className="text-base font-bold text-slate-900">{c.ketua}</div>
                    <div className="text-xs text-slate-500">{c.kelasKetua} — Ketua</div>
                    <div className="my-2 text-xs font-semibold text-slate-400">&amp;</div>
                    <div className="text-base font-bold text-slate-900">{c.wakil}</div>
                    <div className="text-xs text-slate-500">{c.kelasWakil} — Wakil</div>
                    <p className="mt-3 text-sm italic text-slate-600">"{c.tagline}"</p>
                  </div>
                  <div className={`mt-auto px-5 py-3 text-center text-sm font-semibold transition ${
                    active ? "bg-blue-700 text-white" : "bg-slate-50 text-blue-700"
                  }`}>
                    {active ? "✓ Pilihan Anda" : "PILIH"}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={!picked}
              className="w-full max-w-md rounded-xl bg-blue-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Kirim Suara
            </button>
            <p className="text-xs text-slate-500">Pilih salah satu paslon terlebih dahulu untuk mengaktifkan tombol.</p>
          </div>
        </div>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="mt-3 text-center text-lg">Apakah Anda yakin dengan pilihan Anda?</DialogTitle>
            <DialogDescription className="text-center">
              Suara yang sudah dikirim tidak dapat diubah. Pastikan pilihan Anda benar.
            </DialogDescription>
          </DialogHeader>

          {chosen && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-base font-bold text-white">
                {chosen.nomor}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{chosen.ketua} &amp; {chosen.wakil}</div>
                <div className="text-xs text-slate-500">Paslon Nomor Urut {chosen.nomor}</div>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Periksa Lagi
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-70"
            >
              {submitting ? "Mengirim..." : "Ya, Kirim Suara"}
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Butuh batal? <Link to="/" className="underline">Kembali ke beranda</Link>
          </p>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
