/**
 * Utility Sinkronisasi Lintas Domain:
 * Menghubungkan perubahan dari Panel Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * dengan Website Umum Publik (https://rohis-sman4pwt.web.id/)
 */

export const PUBLIC_SITE_URL = "https://rohis-sman4pwt.web.id/";
export const ADMIN_PORTAL_URL = "https://rohissmapa.farisnasrul542.workers.dev/";

const SYNC_ENDPOINTS = [
  "/api/cms-sync",
  "https://rohissmapa.farisnasrul542.workers.dev/api/cms-sync",
  "https://rohis-sman4pwt.web.id/api/cms-sync",
];

export interface CloudSyncPayload {
  rohis_home_cms?: any;
  rohis_admin_events?: any;
  rohis_admin_gallery?: any;
  rohis_admin_aspirasi?: any;
  rohis_admin_announcement?: any;
}

export async function pushCloudSync(partial: CloudSyncPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const body = JSON.stringify(partial);
  await Promise.allSettled(
    SYNC_ENDPOINTS.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
    )
  );
}

export async function pullCloudSync(): Promise<CloudSyncPayload | null> {
  if (typeof window === "undefined") return null;

  for (const endpoint of SYNC_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && !data.empty && typeof data === "object") {
        if (data.rohis_home_cms) {
          localStorage.setItem("rohis_home_cms", JSON.stringify(data.rohis_home_cms));
        }
        if (data.rohis_admin_events) {
          localStorage.setItem("rohis_admin_events", JSON.stringify(data.rohis_admin_events));
        }
        if (data.rohis_admin_gallery) {
          localStorage.setItem("rohis_admin_gallery", JSON.stringify(data.rohis_admin_gallery));
        }
        if (data.rohis_admin_aspirasi) {
          localStorage.setItem("rohis_admin_aspirasi", JSON.stringify(data.rohis_admin_aspirasi));
        }
        if (data.rohis_admin_announcement) {
          localStorage.setItem(
            "rohis_admin_announcement",
            JSON.stringify(data.rohis_admin_announcement)
          );
        }
        return data as CloudSyncPayload;
      }
    } catch {}
  }

  return null;
}

