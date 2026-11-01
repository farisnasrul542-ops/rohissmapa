/**
 * Cloudflare Worker untuk ROHIS SMAN 4 Purwokerto
 * - Memisahkan domain Publik (https://rohis-sman4pwt.web.id/) dan domain Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * - Menyediakan endpoint sinkronisasi data lintas domain (/api/cms-sync) menggunakan Cloudflare Edge Cache API
 */

const CACHE_KEY_URL = "https://rohissmapa.farisnasrul542.workers.dev/api/cms-sync-cache-store";

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
      const cache = caches.default;
      const cacheReq = new Request(CACHE_KEY_URL, { method: "GET" });

      if (request.method === "GET") {
        let cachedRes = await cache.match(cacheReq);
        if (cachedRes) {
          const body = await cachedRes.text();
          return new Response(body, {
            status: 200,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          });
        }

        if (globalThis.__ROHIS_SHARED_STATE__) {
          return new Response(JSON.stringify(globalThis.__ROHIS_SHARED_STATE__), {
            status: 200,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          });
        }

        return new Response(JSON.stringify({ empty: true }), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      }

      if (request.method === "POST") {
        try {
          const incoming = await request.json();
          let existing = globalThis.__ROHIS_SHARED_STATE__ || {};
          try {
            const prevCached = await cache.match(cacheReq);
            if (prevCached) {
              existing = await prevCached.json();
            }
          } catch {}

          const merged = {
            ...existing,
            ...incoming,
            updatedAt: Date.now(),
          };

          globalThis.__ROHIS_SHARED_STATE__ = merged;

          const bodyStr = JSON.stringify(merged);
          const responseToCache = new Response(bodyStr, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=31536000",
            },
          });

          ctx.waitUntil(cache.put(cacheReq, responseToCache));

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

    // 4. Layani aset statis Next.js dari ./out
    return env.ASSETS.fetch(request);
  },
};

