/**
 * SIMANTRI data layer.
 *
 * Struktur Firebase Realtime Database yang dipakai (JANGAN diubah, harus tetap
 * kompatibel dengan sistem admin dan widget loket yang sudah berjalan):
 *
 *   status_loket/{idLoket}          -> { nomor: string, status: StatusLoket }
 *   panggilan_aktif                 -> { id_loket, nama_loket, nomor, timestamp }
 *   pengaturan/playlist_video       -> string[] | { [k]: string }
 *   pengaturan/ticker/teks_berjalan -> string
 *   pengaturan/loket_aktif          -> { [idLoket]: boolean }
 *
 * Bila konfigurasi Firebase belum diisi (VITE_FIREBASE_*), modul ini otomatis
 * memakai data contoh agar tampilan tetap bisa ditinjau di TV.
 */

export type StatusLoket = "tersedia" | "melayani" | "selesai" | "offline";

export type LoketId = "A" | "B" | "C" | "D" | "FOTO" | "BIOVISA";

export interface LoketDef {
  id: LoketId;
  nama: string;
  singkat: string;
}

export const DAFTAR_LOKET: LoketDef[] = [
  { id: "A", nama: "Loket A", singkat: "A" },
  { id: "B", nama: "Loket B", singkat: "B" },
  { id: "C", nama: "Loket C", singkat: "C" },
  { id: "D", nama: "Loket D", singkat: "D" },
  { id: "FOTO", nama: "Foto Wajah", singkat: "FW" },
  { id: "BIOVISA", nama: "Bio Visa", singkat: "BV" },
];

export const LABEL_STATUS: Record<StatusLoket, string> = {
  tersedia: "TERSEDIA",
  melayani: "SEDANG DILAYANI",
  selesai: "SELESAI LAYANAN",
  offline: "TUTUP / OFFLINE",
};

export interface StatusLoketEntry {
  nomor: string;
  status: StatusLoket;
}

export interface PanggilanAktif {
  id_loket: string;
  nama_loket: string;
  nomor: string;
  timestamp: number;
}

export interface SimantriState {
  statusLoket: Record<string, StatusLoketEntry>;
  loketAktif: Record<string, boolean>;
  playlistVideo: string[];
  ticker: string;
  panggilanAktif: PanggilanAktif | null;
  terhubung: boolean;
}

export const DEMO_STATE: SimantriState = {
  statusLoket: {
    A: { nomor: "A-014", status: "melayani" },
    B: { nomor: "B-008", status: "tersedia" },
    C: { nomor: "C-021", status: "selesai" },
    D: { nomor: "D-003", status: "melayani" },
    FOTO: { nomor: "F-047", status: "tersedia" },
    BIOVISA: { nomor: "V-011", status: "offline" },
  },
  loketAktif: { A: true, B: true, C: true, D: true, FOTO: true, BIOVISA: false },
  playlistVideo: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ],
  ticker:
    "SELAMAT DATANG DI KANTOR PELAYANAN SIMANTRI  •  Mohon menunggu nomor antrean Anda dipanggil  •  Siapkan berkas persyaratan sebelum menuju loket  •  Layanan Foto Wajah dan Bio Visa ditutup pukul 15.00 WIB  •  Terima kasih atas kesabaran Anda",
  panggilanAktif: null,
  terhubung: false,
};

function normalisasiPlaylist(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  if (raw && typeof raw === "object") {
    return Object.values(raw as Record<string, unknown>).filter(
      (v): v is string => typeof v === "string",
    );
  }
  return [];
}

const firebaseConfig = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] as string | undefined,
  databaseURL: import.meta.env['VITE_FIREBASE_DATABASE_URL'] as string | undefined,
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] as string | undefined,
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] as string | undefined,
};

export const firebaseSiap = Boolean(firebaseConfig.databaseURL && firebaseConfig.apiKey);

/**
 * Berlangganan seluruh data SIMANTRI secara real-time.
 * Mengembalikan fungsi unsubscribe.
 */
export function subscribeSimantri(onChange: (patch: Partial<SimantriState>) => void): () => void {
  if (!firebaseSiap) return () => {};

  let dispose = () => {};
  let dibatalkan = false;

  (async () => {
    const [{ initializeApp, getApps, getApp }, { getDatabase, ref, onValue }] = await Promise.all([
      import("firebase/app"),
      import("firebase/database"),
    ]);
    if (dibatalkan) return;

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const unsubs = [
      onValue(ref(db, "status_loket"), (snap) => {
        onChange({ statusLoket: (snap.val() as SimantriState["statusLoket"]) ?? {}, terhubung: true });
      }),
      onValue(ref(db, "pengaturan/loket_aktif"), (snap) => {
        onChange({ loketAktif: (snap.val() as Record<string, boolean>) ?? {} });
      }),
      onValue(ref(db, "pengaturan/playlist_video"), (snap) => {
        onChange({ playlistVideo: normalisasiPlaylist(snap.val()) });
      }),
      onValue(ref(db, "pengaturan/ticker/teks_berjalan"), (snap) => {
        const v = snap.val();
        if (typeof v === "string") onChange({ ticker: v });
      }),
      onValue(ref(db, "panggilan_aktif"), (snap) => {
        onChange({ panggilanAktif: (snap.val() as PanggilanAktif | null) ?? null });
      }),
    ];

    dispose = () => unsubs.forEach((u) => u());
  })();

  return () => {
    dibatalkan = true;
    dispose();
  };
}
