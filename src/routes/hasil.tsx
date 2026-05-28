import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CANDIDATES, TOTAL_VOTERS, getVotes, totalVotesCast } from "@/lib/election";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Activity, Users, CheckCircle2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/hasil")({
  head: () => ({
    meta: [{ title: "Hasil Quick Count — E-Voting OSIS" }],
  }),
  component: HasilPage,
});

function HasilPage() {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setVotes(getVotes());
      setTotal(totalVotesCast());
    };
    refresh();
    const i = setInterval(refresh, 1500);
    return () => clearInterval(i);
  }, []);

  const data = CANDIDATES.map((c) => {
    const v = votes[String(c.id)] || 0;
    const pct = total ? (v / total) * 100 : 0;
    return { id: c.id, name: `Paslon ${c.nomor}`, fullName: `${c.ketua} & ${c.wakil}`, votes: v, pct, color: c.color };
  });

  const leader = [...data].sort((a, b) => b.votes - a.votes)[0];
  const turnout = Math.round((total / TOTAL_VOTERS) * 100);

  return (
    <Layout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                LIVE · Update otomatis
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Quick Count Pemilos</h1>
              <p className="mt-1 text-slate-600">Hasil real-time perolehan suara Ketua &amp; Wakil Ketua OSIS.</p>
            </div>
            {leader && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-right">
                <div className="text-xs font-semibold uppercase text-blue-700">Sementara Unggul</div>
                <div className="text-base font-bold text-blue-900">{leader.fullName}</div>
                <div className="text-xs text-blue-700">{leader.votes.toLocaleString("id-ID")} suara · {leader.pct.toFixed(1)}%</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          <KPI icon={<Users className="h-5 w-5" />} label="Total Pemilih" value={TOTAL_VOTERS.toLocaleString("id-ID")} />
          <KPI icon={<CheckCircle2 className="h-5 w-5" />} label="Suara Masuk" value={total.toLocaleString("id-ID")} accent />
          <KPI icon={<TrendingUp className="h-5 w-5" />} label="Partisipasi" value={`${turnout}%`} />
          <KPI icon={<Activity className="h-5 w-5" />} label="Paslon" value={String(CANDIDATES.length)} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Perolehan Suara per Paslon</h2>
              <span className="text-xs text-slate-500">Bar chart</span>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v: number) => [v.toLocaleString("id-ID") + " suara", "Total"]}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                    {data.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Distribusi Suara</h2>
              <span className="text-xs text-slate-500">Pie chart</span>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {data.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} iconType="circle" />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v: number) => [v.toLocaleString("id-ID") + " suara", "Total"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-3 text-base font-semibold text-slate-900">
            Rincian Perolehan Suara
          </div>
          <div className="divide-y divide-slate-100">
            {data.map((d) => (
              <div key={d.id} className="px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white" style={{ background: d.color }}>
                      {d.id}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{d.fullName}</div>
                      <div className="text-xs text-slate-500">Paslon Nomor Urut {d.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-900 tabular-nums">{d.votes.toLocaleString("id-ID")}</div>
                    <div className="text-xs text-slate-500 tabular-nums">{d.pct.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          *Hasil bersifat sementara dan akan terus diperbarui hingga masa pemilihan ditutup.
        </p>
      </section>
    </Layout>
  );
}

function KPI({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
