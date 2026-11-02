/**
 * Utility Sinkronisasi Lintas Domain & Cloud Sync:
 * Menghubungkan perubahan dari Panel Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * dengan Website Umum Publik (https://rohis-sman4pwt.web.id/) secara permanen dan real-time.
 */

export const PUBLIC_SITE_URL = "https://rohis-sman4pwt.web.id/";
export const ADMIN_PORTAL_URL = "https://rohissmapa.farisnasrul542.workers.dev/";

export const CLOUD_STORAGE_OBJECT_URL =
  "https://api.restful-api.dev/objects/ff808181a09d98f701a19cc57a9b1075";

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
  updatedAt?: number;
}

export async function pushCloudSync(partial: CloudSyncPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const payloadWithTime = {
    ...partial,
    updatedAt: Date.now(),
  };

  const body = JSON.stringify(payloadWithTime);

  // 1. Kirim ke worker sync endpoints
  const workerRequests = SYNC_ENDPOINTS.map((endpoint) =>
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => null)
  );

  // 2. Kirim langsung ke cloud persistent store via PUT
  const cloudStoreRequest = (async () => {
    try {
      let currentData: any = {};
      try {
        const getRes = await fetch(CLOUD_STORAGE_OBJECT_URL, { cache: "no-store" });
        if (getRes.ok) {
          const resJson = await getRes.json();
          if (resJson?.data && typeof resJson.data === "object") {
            currentData = resJson.data;
          }
        }
      } catch {}

      const merged = { ...currentData, ...payloadWithTime };

      await fetch(CLOUD_STORAGE_OBJECT_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "rohis_smapa_cms_v1",
          data: merged,
        }),
      });
    } catch {}
  })();

  await Promise.allSettled([...workerRequests, cloudStoreRequest]);
}

export async function pullCloudSync(): Promise<CloudSyncPayload | null> {
  if (typeof window === "undefined") return null;

  const applyData = (data: any): CloudSyncPayload => {
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
  };

  // 1. Coba dari worker endpoints
  for (const endpoint of SYNC_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && !data.empty && typeof data === "object") {
        const payload = data.data || data;
        if (
          payload.rohis_home_cms ||
          payload.rohis_admin_events ||
          payload.rohis_admin_gallery ||
          payload.rohis_admin_aspirasi
        ) {
          return applyData(payload);
        }
      }
    } catch {}
  }

  // 2. Fallback langsung ke cloud persistent store
  try {
    const res = await fetch(CLOUD_STORAGE_OBJECT_URL, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && typeof json.data === "object") {
        return applyData(json.data);
      }
    }
  } catch {}

  return null;
}
