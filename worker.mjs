/**
 * Cloudflare Worker untuk ROHIS SMAN 4 Purwokerto
 * - Memisahkan domain Publik (https://rohis-sman4pwt.web.id/) dan domain Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * - Menyediakan endpoint sinkronisasi data lintas domain (/api/cms-sync) menggunakan Cloudflare Edge Cache API
 */

const CLOUD_STORAGE_OBJECT_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a19cc57a9b1075";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 2. Endpoint Sinkronisasi Data Lintas Domain (Admin workers.dev <-> Publik rohis-sman4pwt.web.id)
    if (url.pathname === "/api/cms-sync") {
      if (request.method === "GET") {
        // Coba ambil dari cloud persistent storage terlebih dahulu
        try {
          const res = await fetch(CLOUD_STORAGE_OBJECT_URL, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.data && typeof json.data === "object") {
              globalThis.__ROHIS_SHARED_STATE__ = {
                ...globalThis.__ROHIS_SHARED_STATE__,
                ...json.data,
              };
              return new Response(JSON.stringify(globalThis.__ROHIS_SHARED_STATE__), {
                status: 200,
                headers: {
                  ...CORS_HEADERS,
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store, no-cache, must-revalidate",
                },
              });
            }
          }
        } catch {}

        if (globalThis.__ROHIS_SHARED_STATE__) {
          return new Response(JSON.stringify(globalThis.__ROHIS_SHARED_STATE__), {
            status: 200,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          });
        }

        return new Response(JSON.stringify({ empty: true }), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        });
      }

      if (request.method === "POST") {
        try {
          const incoming = await request.json();
          let existing = globalThis.__ROHIS_SHARED_STATE__ || {};

          // Ambil data terbaru dari cloud storage sebelum merge
          try {
            const currentRes = await fetch(CLOUD_STORAGE_OBJECT_URL, { cache: "no-store" });
            if (currentRes.ok) {
              const currentJson = await currentRes.json();
              if (currentJson?.data && typeof currentJson.data === "object") {
                existing = { ...existing, ...currentJson.data };
              }
            }
          } catch {}

          const merged = {
            ...existing,
            ...incoming,
            updatedAt: Date.now(),
          };

          globalThis.__ROHIS_SHARED_STATE__ = merged;

          // Simpan secara permanen ke cloud persistent store via PUT
          const savePromise = fetch(CLOUD_STORAGE_OBJECT_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "rohis_smapa_cms_v1",
              data: merged,
            }),
          }).catch(() => {});

          if (ctx && typeof ctx.waitUntil === "function") {
            ctx.waitUntil(savePromise);
          } else {
            await savePromise;
          }

          return new Response(JSON.stringify({ ok: true, updatedAt: merged.updatedAt }), {
            status: 200,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, error: String(err) }), {
            status: 400,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
            },
          });
        }
      }
    }

    // 2.5. Endpoint Upload Gambar Permanen ke CDN Global (/api/upload-image)
    if (url.pathname === "/api/upload-image") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      if (request.method === "POST") {
        try {
          const formData = await request.formData();
          const file = formData.get("file") || formData.get("image") || formData.get("source");
          if (!file) {
            return new Response(JSON.stringify({ ok: false, error: "File tidak ditemukan" }), {
              status: 400,
              headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            });
          }

          const uploadForm = new FormData();
          uploadForm.append("key", "6d207e02198a847aa98d0a2a901485a5");
          uploadForm.append("action", "upload");
          uploadForm.append("format", "json");
          uploadForm.append("source", file, (file.name || "image.jpg"));

          const upstream = await fetch("https://freeimage.host/api/1/upload", {
            method: "POST",
            body: uploadForm,
          });

          if (!upstream.ok) {
            const errBody = await upstream.text();
            return new Response(JSON.stringify({ ok: false, error: errBody }), {
              status: 502,
              headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            });
          }

          const j = await upstream.json();
          const imgUrl = j?.image?.url || j?.image?.display_url;
          if (!imgUrl) {
            return new Response(JSON.stringify({ ok: false, error: "Gagal mendapatkan URL gambar CDN" }), {
              status: 500,
              headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ ok: true, url: imgUrl }), {
            status: 200,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, error: String(err) }), {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          });
        }
      }
    }

    // 3. Pemisahan Domain Otomatis:
    // - Jika membuka root https://rohissmapa.farisnasrul542.workers.dev/ -> langsung arahkan ke /admin
    if (hostname.includes("workers.dev") && (url.pathname === "/" || url.pathname === "" || url.pathname === "/index.html")) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }

    // - Jika mencoba membuka /admin atau /login di domain publik (rohis-sman4pwt.web.id) -> kembalikan ke beranda publik /
    if (
      hostname.includes("rohis-sman4pwt.web.id") &&
      (url.pathname === "/admin" ||
        url.pathname.startsWith("/admin/") ||
        url.pathname === "/login")
    ) {
      return Response.redirect(`https://rohis-sman4pwt.web.id/`, 302);
    }

    // 4. Layani aset statis Next.js dari ./out dengan proteksi cache dokumen HTML untuk HP/mobile
    const assetRes = await env.ASSETS.fetch(request);
    const contentType = assetRes.headers.get("content-type") || "";
    if (
      contentType.includes("text/html") ||
      url.pathname === "/" ||
      url.pathname === "" ||
      url.pathname.endsWith(".html")
    ) {
      const newHeaders = new Headers(assetRes.headers);
      newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
      return new Response(assetRes.body, {
        status: assetRes.status,
        statusText: assetRes.statusText,
        headers: newHeaders,
      });
    }

    return assetRes;
  },
};

