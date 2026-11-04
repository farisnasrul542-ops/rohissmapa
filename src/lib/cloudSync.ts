/**
 * Utility Sinkronisasi Lintas Domain & Cloud Sync (Schema v3):
 * Menghubungkan perubahan dari Panel Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * dengan Website Umum Publik (https://rohis-sman4pwt.web.id/) secara permanen dan real-time.
 */

export const PUBLIC_SITE_URL = "https://rohis-sman4pwt.web.id/";
export const ADMIN_PORTAL_URL = "https://rohissmapa.farisnasrul542.workers.dev/";
export const ROHIS_SCHEMA_VERSION = 3;

const SYNC_ENDPOINTS = [
  "/api/cms-sync",
  "https://rohissmapa.farisnasrul542.workers.dev/api/cms-sync",
  "https://rohis-sman4pwt.web.id/api/cms-sync",
];

export interface CloudSyncPayload {
  schemaVersion?: number;
  rohis_home_cms?: any;
  rohis_admin_events?: any;
  rohis_admin_gallery?: any;
  rohis_admin_aspirasi?: any;
  rohis_admin_announcement?: any;
  updatedAt?: number;
}

/**
 * Membersihkan localStorage versi lama (yang masih menyimpan 7 agenda lama / galeri lama)
 * secara otomatis di semua browser (Laptop Publik, Admin, dan HP) saat pertama kali membuka versi v3.
 */
export function ensureCleanStorageVersion(): void {
  if (typeof window === "undefined") return;
  try {
    const currentVersion = localStorage.getItem("rohis_schema_version");
    if (currentVersion !== String(ROHIS_SCHEMA_VERSION)) {
      localStorage.removeItem("rohis_admin_events");
      localStorage.removeItem("rohis_admin_gallery");
      localStorage.removeItem("rohis_home_cms");
      localStorage.removeItem("rohis_sync_updated_at");
      localStorage.setItem("rohis_schema_version", String(ROHIS_SCHEMA_VERSION));
    }
  } catch {}
}

export function markLocalSyncTimestamp(ts: number = Date.now()): number {
  if (typeof window === "undefined") return ts;
  try {
    localStorage.setItem("rohis_sync_updated_at", String(ts));
  } catch {}
  return ts;
}

export function getLocalSyncTimestamp(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem("rohis_sync_updated_at") || "0") || 0;
  } catch {
    return 0;
  }
}

export async function pushCloudSync(partial: CloudSyncPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const now = markLocalSyncTimestamp(Date.now());

  // Sertakan snapshot lengkap dari localStorage agar semua endpoint memiliki state terbaru yang utuh
  let fullSnapshot: CloudSyncPayload = {};
  try {
    const savedCms = localStorage.getItem("rohis_home_cms");
    if (savedCms) fullSnapshot.rohis_home_cms = JSON.parse(savedCms);
    const savedEvents = localStorage.getItem("rohis_admin_events");
    if (savedEvents) fullSnapshot.rohis_admin_events = JSON.parse(savedEvents);
    const savedGallery = localStorage.getItem("rohis_admin_gallery");
    if (savedGallery) fullSnapshot.rohis_admin_gallery = JSON.parse(savedGallery);
    const savedAspirasi = localStorage.getItem("rohis_admin_aspirasi");
    if (savedAspirasi) fullSnapshot.rohis_admin_aspirasi = JSON.parse(savedAspirasi);
    const savedAnnouncement = localStorage.getItem("rohis_admin_announcement");
    if (savedAnnouncement) fullSnapshot.rohis_admin_announcement = JSON.parse(savedAnnouncement);
  } catch {}

  const payloadWithTime: CloudSyncPayload = {
    ...fullSnapshot,
    ...partial,
    schemaVersion: ROHIS_SCHEMA_VERSION,
    updatedAt: now,
  };

  const body = JSON.stringify(payloadWithTime);

  const workerRequests = SYNC_ENDPOINTS.map((endpoint) =>
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => null)
  );

  await Promise.allSettled(workerRequests);
}

export async function pullCloudSync(): Promise<CloudSyncPayload | null> {
  if (typeof window === "undefined") return null;

  ensureCleanStorageVersion();

  const localUpdatedAt = getLocalSyncTimestamp();

  const applyData = (data: any): CloudSyncPayload => {
    const incomingTs = Number(data.updatedAt || 0);
    if (incomingTs > 0) {
      markLocalSyncTimestamp(incomingTs);
    }
    if (data.rohis_home_cms) {
      localStorage.setItem("rohis_home_cms", JSON.stringify(data.rohis_home_cms));
    }
    if (Array.isArray(data.rohis_admin_events)) {
      localStorage.setItem("rohis_admin_events", JSON.stringify(data.rohis_admin_events));
    }
    if (Array.isArray(data.rohis_admin_gallery)) {
      localStorage.setItem("rohis_admin_gallery", JSON.stringify(data.rohis_admin_gallery));
    }
    if (Array.isArray(data.rohis_admin_aspirasi)) {
      localStorage.setItem("rohis_admin_aspirasi", JSON.stringify(data.rohis_admin_aspirasi));
    }
    if (data.rohis_admin_announcement) {
      localStorage.setItem(
        "rohis_admin_announcement",
        JSON.stringify(data.rohis_admin_announcement)
      );
    }
    return data as CloudSyncPayload;
  };

  // Tarik dari semua endpoint secara paralel lalu pilih yang memiliki updatedAt paling baru
  const results = await Promise.allSettled(
    SYNC_ENDPOINTS.map(async (endpoint) => {
      const res = await fetch(`${endpoint}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && !data.empty && typeof data === "object") {
        const payload = data.data || data;
        if (Number(payload.schemaVersion) >= ROHIS_SCHEMA_VERSION) {
          if (
            payload.rohis_home_cms ||
            payload.rohis_admin_events ||
            payload.rohis_admin_gallery ||
            payload.rohis_admin_aspirasi
          ) {
            return payload as CloudSyncPayload;
          }
        }
      }
      return null;
    })
  );

  let newestPayload: CloudSyncPayload | null = null;
  let newestTs = -1;

  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      const ts = Number(r.value.updatedAt || 0);
      if (ts > newestTs) {
        newestTs = ts;
        newestPayload = r.value;
      }
    }
  }

  if (!newestPayload) return null;

  // Jangan timpa data lokal jika localStorage di browser ini memiliki perubahan yang lebih baru
  if (localUpdatedAt > 0 && newestTs > 0 && newestTs < localUpdatedAt) {
    return null;
  }

  return applyData(newestPayload);
}
