/**
 * Utility Penguncian Gambar Lokal ke Server Web & Cloud CDN
 * Mengonversi gambar lokal / data URL / File ke URL CDN permanen
 * sehingga otomatis terkunci ke sistem web dan bisa dilihat di semua perangkat (HP & PC).
 */

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function uploadImageToWebSystem(
  fileOrDataUrl: File | Blob | string,
  fileName = "upload.jpg"
): Promise<string> {
  const blob: Blob =
    typeof fileOrDataUrl === "string"
      ? dataUrlToBlob(fileOrDataUrl)
      : fileOrDataUrl;

  const formData = new FormData();
  formData.append("file", blob, fileName);

  const endpoints = [
    "/api/upload-image",
    "https://rohissmapa.farisnasrul542.workers.dev/api/upload-image",
    "https://rohis-sman4pwt.web.id/api/upload-image",
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.ok && json?.url) {
          return json.url;
        }
      }
    } catch {}
  }

  // Direct fallback to freeimage.host
  try {
    const directForm = new FormData();
    directForm.append("key", "6d207e02198a847aa98d0a2a901485a5");
    directForm.append("action", "upload");
    directForm.append("format", "json");
    directForm.append("source", blob, fileName);

    const directRes = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: directForm,
    });
    if (directRes.ok) {
      const data = await directRes.json();
      if (data?.image?.url) {
        return data.image.url;
      }
    }
  } catch {}

  throw new Error("Gagal mengunci gambar ke CDN web");
}

