import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CheckCircle2, BarChart3, Home } from "lucide-react";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [{ title: "Terima Kasih — E-Voting OSIS" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-2xl px-4 py-16">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 md:text-4xl">Terima Kasih!</h1>
          <p className="mt-3 text-slate-600">
            Suara Anda telah berhasil dikirim dan dicatat secara aman.
            Partisipasi Anda sangat berarti untuk masa depan OSIS sekolah.
          </p>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            🗳️ NISN Anda telah ditandai sebagai sudah memilih dan tidak dapat digunakan kembali.
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/hasil"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:w-auto"
            >
              <BarChart3 className="h-4 w-4" /> Lihat Hasil Quick Count
            </Link>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              <Home className="h-4 w-4" /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
