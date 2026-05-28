export type ProgramIcon =
  | "sparkles"
  | "megaphone"
  | "book"
  | "users"
  | "trophy"
  | "heart"
  | "leaf"
  | "laptop"
  | "shield"
  | "palette"
  | "globe"
  | "lightbulb";

export type Candidate = {
  id: number;
  nomor: number;
  ketua: string;
  wakil: string;
  kelasKetua: string;
  kelasWakil: string;
  fotoKetua: string;
  fotoWakil: string;
  tagline: string;
  visi: string;
  misi: string[];
  program: { title: string; desc: string; icon: ProgramIcon }[];
  color: string;
};

export const CANDIDATES: Candidate[] = [
  {
    id: 1,
    nomor: 1,
    ketua: "Arif Pratama",
    wakil: "Bella Anggraini",
    kelasKetua: "XI IPA 2",
    kelasWakil: "XI IPS 1",
    fotoKetua: "https://i.pravatar.cc/300?img=12",
    fotoWakil: "https://i.pravatar.cc/300?img=45",
    tagline: "OSIS Aktif, Siswa Kreatif",
    visi: "Mewujudkan OSIS yang aktif, kreatif, dan inklusif sebagai wadah pengembangan potensi seluruh siswa.",
    misi: [
      "Menjadikan OSIS sebagai jembatan aspirasi siswa.",
      "Mengadakan kegiatan ekstrakurikuler yang variatif.",
      "Membangun budaya literasi dan prestasi.",
      "Memperkuat solidaritas antar angkatan.",
    ],
    program: [
      { title: "Festival Kreativitas Siswa", desc: "Ajang tahunan menampilkan bakat seni, musik, dan teknologi." },
      { title: "OSIS Mendengar", desc: "Forum bulanan terbuka untuk menampung aspirasi siswa." },
      { title: "Pekan Literasi", desc: "Lomba esai, debat, dan bedah buku bersama alumni." },
    ],
    color: "#1d4ed8",
  },
  {
    id: 2,
    nomor: 2,
    ketua: "Citra Maharani",
    wakil: "Dimas Saputra",
    kelasKetua: "XI IPA 4",
    kelasWakil: "XI IPA 1",
    fotoKetua: "https://i.pravatar.cc/300?img=47",
    fotoWakil: "https://i.pravatar.cc/300?img=33",
    tagline: "Bersama untuk Sekolah yang Lebih Baik",
    visi: "Menciptakan lingkungan sekolah yang harmonis, berprestasi, dan berkarakter melalui peran aktif OSIS.",
    misi: [
      "Meningkatkan disiplin dan kepedulian sosial.",
      "Mengembangkan program kepemimpinan siswa.",
      "Mempererat kerja sama dengan guru & wali murid.",
      "Mendukung kegiatan akademik dan non-akademik.",
    ],
    program: [
      { title: "Leadership Bootcamp", desc: "Pelatihan kepemimpinan untuk pengurus dan calon pengurus OSIS." },
      { title: "Bakti Sosial Sekolah", desc: "Kegiatan donasi & kunjungan sosial setiap semester." },
      { title: "Class Competition", desc: "Kompetisi antar kelas: olahraga, sains, dan seni." },
    ],
    color: "#0ea5e9",
  },
  {
    id: 3,
    nomor: 3,
    ketua: "Eka Wijaya",
    wakil: "Fitri Lestari",
    kelasKetua: "XI IPS 2",
    kelasWakil: "XI IPA 3",
    fotoKetua: "https://i.pravatar.cc/300?img=15",
    fotoWakil: "https://i.pravatar.cc/300?img=49",
    tagline: "Inovasi, Kolaborasi, Aksi Nyata",
    visi: "Menjadikan OSIS sebagai motor inovasi dan kolaborasi yang menghadirkan dampak nyata bagi siswa.",
    misi: [
      "Mendorong digitalisasi kegiatan OSIS.",
      "Menyediakan ruang kolaborasi lintas ekskul.",
      "Membangun program lingkungan & kesehatan mental.",
      "Transparansi anggaran dan program kerja.",
    ],
    program: [
      { title: "OSIS Digital Hub", desc: "Platform pengumuman, aspirasi, dan kalender kegiatan online." },
      { title: "Green School Movement", desc: "Program daur ulang, bank sampah, dan penghijauan sekolah." },
      { title: "Mind & Mental Week", desc: "Kampanye kesehatan mental dan sesi konseling teman sebaya." },
    ],
    color: "#16a34a",
  },
];

// Demo voter database. In production this would be on the server.
export const VOTERS: Record<string, string> = {
  "0012345678": "OSIS2026",
  "0012345679": "VOTE-AB12",
  "0012345680": "VOTE-CD34",
  "0012345681": "VOTE-EF56",
  "0012345682": "VOTE-GH78",
};

export const TOTAL_VOTERS = 842;
export const ELECTION_END = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

const VOTES_KEY = "osis_votes_v1";
const USED_KEY = "osis_used_nisn_v1";
const SESSION_KEY = "osis_session_nisn";

type VoteMap = Record<string, number>;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getVotes(): VoteMap {
  const seed: VoteMap = { "1": 124, "2": 168, "3": 97 };
  const stored = read<VoteMap>(VOTES_KEY, seed);
  // ensure seed merged
  return { ...seed, ...stored };
}

export function totalVotesCast(): number {
  const v = getVotes();
  return Object.values(v).reduce((a, b) => a + b, 0);
}

export function castVote(candidateId: number, nisn: string) {
  const votes = getVotes();
  votes[String(candidateId)] = (votes[String(candidateId)] || 0) + 1;
  write(VOTES_KEY, votes);
  const used = read<string[]>(USED_KEY, []);
  if (!used.includes(nisn)) {
    used.push(nisn);
    write(USED_KEY, used);
  }
  clearSession();
}

export function hasVoted(nisn: string): boolean {
  return read<string[]>(USED_KEY, []).includes(nisn);
}

export function login(nisn: string, token: string): { ok: boolean; error?: string } {
  const expected = VOTERS[nisn];
  if (!expected) return { ok: false, error: "NISN tidak terdaftar." };
  if (expected !== token) return { ok: false, error: "Token tidak valid." };
  if (hasVoted(nisn)) return { ok: false, error: "NISN ini sudah digunakan untuk memilih." };
  write(SESSION_KEY, nisn);
  return { ok: true };
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
