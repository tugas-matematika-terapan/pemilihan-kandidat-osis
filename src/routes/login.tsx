import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { login, VOTERS } from "@/lib/election";
import { ShieldCheck, KeyRound, IdCard, AlertCircle, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login Pemilih — E-Voting OSIS" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [nisn, setNisn] = useState("");
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      const res = login(nisn.trim(), token.trim());
      setLoading(false);
      if (!res.ok) {
        setErr(res.error || "Login gagal.");
        return;
      }
      nav({ to: "/vote" });
    }, 400);
  };

  const sampleNisn = Object.keys(VOTERS)[0];
  const sampleToken = VOTERS[sampleNisn];

  return (
    <Layout>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
        <div className="hidden md:block">
          <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-600 p-8 text-white shadow-lg">
            <ShieldCheck className="h-9 w-9" />
            <h2 className="mt-4 text-2xl font-bold">Login Aman Pemilih</h2>
            <p className="mt-3 text-blue-100">
              Gunakan NISN dan token unik yang kamu terima dari panitia. Token hanya bisa digunakan satu kali.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-blue-50">
              <li className="flex gap-3"><span>🔐</span> Identitas pemilih dirahasiakan.</li>
              <li className="flex gap-3"><span>🗳️</span> Satu NISN hanya bisa memilih satu kali.</li>
              <li className="flex gap-3"><span>📊</span> Suara langsung terhitung di quick count.</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="text-2xl font-bold text-slate-900">Masuk untuk Memilih</h1>
            <p className="mt-1 text-sm text-slate-600">Verifikasi identitas pemilih.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">NISN</label>
                <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="pl-3 text-slate-400"><IdCard className="h-4 w-4" /></span>
                  <input
                    inputMode="numeric"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 0012345678"
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Token Pemilih</label>
                <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="pl-3 text-slate-400"><KeyRound className="h-4 w-4" /></span>
                  <input
                    type={show ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Masukkan token unik"
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="px-3 text-slate-400 hover:text-slate-600"
                    aria-label="Tampilkan token"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {err && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Memverifikasi..." : "Masuk & Mulai Memilih"}
              </button>
            </form>

            <div className="mt-5 rounded-lg border border-dashed border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-900">
              <div className="font-semibold">Demo akun pemilih:</div>
              <div className="mt-1">NISN: <code className="rounded bg-white px-1.5 py-0.5">{sampleNisn}</code> · Token: <code className="rounded bg-white px-1.5 py-0.5">{sampleToken}</code></div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Lupa token? Hubungi panitia di ruang OSIS · <Link to="/" className="text-blue-700 hover:underline">Kembali ke beranda</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
