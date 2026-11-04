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
      localStorage.setItem("rohis_schema_version", String(ROHIS_SCHEMA_VERSION));
    }
  } catch {}
}

export async function pushCloudSync(partial: CloudSyncPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const payloadWithTime: CloudSyncPayload = {
    ...partial,
    schemaVersion: ROHIS_SCHEMA_VERSION,
    updatedAt: Date.now(),
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

  const applyData = (data: any): CloudSyncPayload => {
    if (data.rohis_home_cms) {
      localStorage.setItem("rohis_home_cms", JSON.stringify(data.rohis_home_cms));
    }
    if (data.rohis_admin_events && Array.isArray(data.rohis_admin_events)) {
      localStorage.setItem("rohis_admin_events", JSON.stringify(data.rohis_admin_events));
    }
    if (data.rohis_admin_gallery && Array.isArray(data.rohis_admin_gallery)) {
      localStorage.setItem("rohis_admin_gallery", JSON.stringify(data.rohis_admin_gallery));
    }
    if (data.rohis_admin_aspirasi && Array.isArray(data.rohis_admin_aspirasi)) {
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

  for (const endpoint of SYNC_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && !data.empty && typeof data === "object") {
        const payload = data.data || data;
        // Hanya terima data sinkronisasi dengan schemaVersion >= 3 agar cache lama tidak pernah menimpa
        if (Number(payload.schemaVersion) >= ROHIS_SCHEMA_VERSION) {
          if (
            payload.rohis_home_cms ||
            payload.rohis_admin_events ||
            payload.rohis_admin_gallery ||
            payload.rohis_admin_aspirasi
          ) {
            return applyData(payload);
          }
        }
      }
    } catch {}
  }

  return null;
}
