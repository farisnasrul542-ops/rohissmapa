/**
 * Cloudflare Worker untuk ROHIS SMAN 4 Purwokerto (Hardened Security v2)
 * - Memisahkan domain Publik (https://rohis-sman4pwt.web.id/) dan domain Admin (https://rohissmapa.farisnasrul542.workers.dev/)
 * - Menyediakan otentikasi server-side HMAC-SHA256, proteksi brute-force (rate limit IP), dan sesi HttpOnly Cookie / Bearer Token
 * - Mengamankan endpoint mutasi (/api/cms-sync POST, /api/upload-image POST, /api/auth/change-credentials) dengan validasi token & sanitasi XSS
 * - Menerapkan HTTP Security Headers lengkap (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
 */

const ALLOWED_ORIGINS = new Set([
  "https://rohis-sman4pwt.web.id",
  "https://www.rohis-sman4pwt.web.id",
  "https://rohissmapa.farisnasrul542.workers.dev",
  "https://www.rohis-banyumas.web.id",
  "https://rohis-banyumas.web.id",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

const REQUIRED_SCHEMA_VERSION = 3;
const PASSWORD_SALT = "rohis-smapa-2026-salt!";
const DEFAULT_PASSWORD_HASH = "6e907e6659dc98beaaa95595eaf36107529f8107fa2d34de7b1b8936c22cac4a";
const DEFAULT_VALID_USERNAMES = ["rohissmapa"];
const DEFAULT_HMAC_KEY = "rohis-smapa-edge-hmac-secret-2026-v3-locked#9f8a7c2e";
const SESSION_COOKIE_NAME = "rohis_admin_session";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 menit
const MAX_CMS_BODY_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_CMS_KEYS = new Set([
  "schemaVersion",
  "rohis_home_cms",
  "rohis_admin_events",
  "rohis_admin_gallery",
  "rohis_admin_aspirasi",
  "rohis_admin_announcement",
  "updatedAt",
]);

const BLOCKED_PROBE_PATHS = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/.htaccess",
  "/config.php",
  "/phpinfo.php",
  "/.well-known/security.txt",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
    };
  }
  return {
    Vary: "Origin",
  };
}

function applySecurityHeaders(headers, { isHtml = false, isPrivate = false } = {}) {
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("X-XSS-Protection", "1; mode=block");

  if (isHtml) {
    headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://rohissmapa.farisnasrul542.workers.dev https://rohis-sman4pwt.web.id https://www.rohis-banyumas.web.id https://rohis-banyumas.web.id https://freeimage.host https://iili.io",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  }

  if (isPrivate) {
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  }
}

function jsonResponse(data, status, request, extraHeaders = {}) {
  const headers = new Headers({
    ...getCorsHeaders(request),
    "Content-Type": "application/json",
    ...extraHeaders,
  });
  applySecurityHeaders(headers, { isPrivate: true });
  return new Response(JSON.stringify(data), { status, headers });
}

function isTrustedMutationOrigin(request) {
  const origin = request.headers.get("Origin");
  if (origin) {
    return ALLOWED_ORIGINS.has(origin);
  }
  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return ALLOWED_ORIGINS.has(refOrigin);
    } catch {
      return false;
    }
  }
  return true;
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const maxLen = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < maxLen; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    diff |= ca ^ cb;
  }
  return diff === 0;
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(plainPassword) {
  return sha256Hex(`${PASSWORD_SALT}:${plainPassword}`);
}

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64) {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(env) {
  const secret = (env && env.SESSION_SECRET) || DEFAULT_HMAC_KEY;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signSessionToken(payload, env) {
  const key = await getHmacKey(env);
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = toBase64Url(payloadStr);
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payloadB64}.${sigHex}`;
}

async function verifySessionToken(token, env, expectedCredVersion) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigHex] = parts;
  if (!payloadB64 || !sigHex || !/^[0-9a-f]{64}$/i.test(sigHex)) return null;

  try {
    const key = await getHmacKey(env);
    const expectedSigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const expectedSigHex = Array.from(new Uint8Array(expectedSigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (!timingSafeEqual(sigHex.toLowerCase(), expectedSigHex.toLowerCase())) {
      return null;
    }

    const payload = JSON.parse(fromBase64Url(payloadB64));
    if (!payload || payload.role !== "admin" || !payload.exp) return null;
    if (Date.now() > Number(payload.exp)) return null;
    if (expectedCredVersion && Number(payload.credVersion || 1) !== Number(expectedCredVersion)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function extractSessionToken(request) {
  const authHeader = request.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const t = authHeader.slice(7).trim();
    if (t) return t;
  }
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return decodeURIComponent(c.slice(SESSION_COOKIE_NAME.length + 1));
    }
  }
  return null;
}

const CREDS_CACHE_URL = "https://auth-store.rohis-sman4pwt.local/admin-creds-v1";

async function loadStoredCredentials(env) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  let stored = globalThis.__ROHIS_ADMIN_CREDS__ || null;

  if (!stored && cache) {
    try {
      const res = await cache.match(new Request(CREDS_CACHE_URL, { method: "GET" }));
      if (res) {
        const json = await res.json();
        if (json && json.passwordHash) {
          stored = json;
          globalThis.__ROHIS_ADMIN_CREDS__ = json;
        }
      }
    } catch {}
  }

  if (stored && stored.passwordHash) {
    return stored;
  }

  if (env && env.ADMIN_PASSWORD) {
    const envHash = await hashPassword(String(env.ADMIN_PASSWORD));
    return {
      username: String(env.ADMIN_USERNAME || "admin").toLowerCase(),
      passwordHash: envHash,
      credVersion: 1,
    };
  }

  return {
    username: null,
    passwordHash: DEFAULT_PASSWORD_HASH,
    credVersion: 1,
  };
}

async function saveStoredCredentials(creds, ctx) {
  globalThis.__ROHIS_ADMIN_CREDS__ = creds;
  const cache = typeof caches !== "undefined" ? caches.default : null;
  if (cache) {
    const res = new Response(JSON.stringify(creds), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=31536000",
      },
    });
    const p = cache.put(new Request(CREDS_CACHE_URL, { method: "GET" }), res);
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(p);
    else await p;
  }
}

async function verifyUsernameAndPassword(inputUsername, inputPassword, env) {
  if (!inputPassword || typeof inputPassword !== "string") return false;
  const creds = await loadStoredCredentials(env);
  const candidateHash = await hashPassword(inputPassword);
  if (!timingSafeEqual(candidateHash, creds.passwordHash)) {
    return false;
  }

  const cleanUser = String(inputUsername || "").trim().toLowerCase();
  if (!cleanUser) return false;

  if (creds.username) {
    return timingSafeEqual(cleanUser, creds.username.toLowerCase()) || cleanUser === "admin";
  }
  return DEFAULT_VALID_USERNAMES.includes(cleanUser);
}

async function getRateLimitRecord(clientIp) {
  const ipKey = await sha256Hex(`ratelimit:${clientIp}`);
  const store = (globalThis.__ROHIS_RATE_LIMIT__ = globalThis.__ROHIS_RATE_LIMIT__ || {});
  let rec = store[ipKey];

  if (!rec && typeof caches !== "undefined") {
    try {
      const res = await caches.default.match(
        new Request(`https://rate-limit.rohis-sman4pwt.local/${ipKey}`, { method: "GET" })
      );
      if (res) {
        rec = await res.json();
        store[ipKey] = rec;
      }
    } catch {}
  }

  if (rec && rec.lockedUntil && Date.now() > rec.lockedUntil) {
    rec = { count: 0, firstAttempt: Date.now(), lockedUntil: 0 };
  }
  return { ipKey, rec: rec || { count: 0, firstAttempt: Date.now(), lockedUntil: 0 } };
}

async function saveRateLimitRecord(ipKey, rec, ctx) {
  const store = (globalThis.__ROHIS_RATE_LIMIT__ = globalThis.__ROHIS_RATE_LIMIT__ || {});
  store[ipKey] = rec;
  if (typeof caches !== "undefined") {
    const res = new Response(JSON.stringify(rec), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
      },
    });
    const p = caches.default.put(
      new Request(`https://rate-limit.rohis-sman4pwt.local/${ipKey}`, { method: "GET" }),
      res
    );
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(p);
    else await p;
  }
}

function sanitizeString(str) {
  return str
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed)\b[^>]*>/gi, "")
    .replace(/\b(javascript|vbscript)\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .replace(/\bon(load|error|click|mouseover|focus|blur|submit)\s*=/gi, "");
}

function sanitizeCmsValue(val, depth = 0) {
  if (depth > 10) return null;
  if (typeof val === "string") return sanitizeString(val);
  if (typeof val === "number" || typeof val === "boolean" || val === null) return val;
  if (Array.isArray(val)) {
    return val.slice(0, 200).map((item) => sanitizeCmsValue(item, depth + 1));
  }
  if (typeof val === "object") {
    const clean = {};
    for (const [k, v] of Object.entries(val)) {
      if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
      clean[k] = sanitizeCmsValue(v, depth + 1);
    }
    return clean;
  }
  return undefined;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    const pathnameLower = url.pathname.toLowerCase();

    // 0. Blokir scanner / probing path berbahaya sejak awal
    if (BLOCKED_PROBE_PATHS.some((p) => pathnameLower === p || pathnameLower.startsWith(`${p}/`))) {
      const headers = new Headers({ "Content-Type": "text/plain" });
      applySecurityHeaders(headers, { isPrivate: true });
      return new Response("Not Found", { status: 404, headers });
    }

    // 1. Handle CORS Preflight dengan origin allowlist ketat
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      const headers = new Headers(getCorsHeaders(request));
      applySecurityHeaders(headers, { isPrivate: true });
      return new Response(null, { status: 204, headers });
    }

    // 1.5. Endpoint Otentikasi Server-Side (/api/auth/*)
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      if (!isTrustedMutationOrigin(request)) {
        return jsonResponse({ ok: false, error: "Origin tidak diizinkan." }, 403, request);
      }

      const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
      const { ipKey, rec } = await getRateLimitRecord(clientIp);

      if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
        const waitMinutes = Math.ceil((rec.lockedUntil - Date.now()) / 60000);
        return jsonResponse(
          {
            ok: false,
            rateLimited: true,
            error: `Terlalu banyak percobaan login gagal. Coba lagi dalam ${waitMinutes} menit.`,
          },
          429,
          request
        );
      }

      try {
        const body = await request.json();
        const username = String(body?.username || "admin").trim();
        const password = String(body?.password || "");
        const rememberMe = Boolean(body?.rememberMe);

        const valid = await verifyUsernameAndPassword(username, password, env);
        if (!valid) {
          const withinWindow = Date.now() - (rec.firstAttempt || 0) < LOCKOUT_DURATION_MS;
          const nextCount = withinWindow ? (rec.count || 0) + 1 : 1;
          const nextRec = {
            count: nextCount,
            firstAttempt: withinWindow ? rec.firstAttempt : Date.now(),
            lockedUntil: nextCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : 0,
          };
          await saveRateLimitRecord(ipKey, nextRec, ctx);

          const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - nextCount);
          return jsonResponse(
            {
              ok: false,
              error:
                remaining > 0
                  ? `Username atau Password salah! Sisa percobaan: ${remaining}x.`
                  : "Terlalu banyak percobaan gagal. Akses dikunci 15 menit.",
            },
            401,
            request
          );
        }

        // Login berhasil -> reset rate limit
        await saveRateLimitRecord(ipKey, { count: 0, firstAttempt: Date.now(), lockedUntil: 0 }, ctx);

        const creds = await loadStoredCredentials(env);
        const ttlMs = rememberMe ? 12 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
        const expiresAt = Date.now() + ttlMs;

        const token = await signSessionToken(
          {
            sub: username.toLowerCase(),
            role: "admin",
            iat: Date.now(),
            exp: expiresAt,
            credVersion: creds.credVersion || 1,
            jti: crypto.randomUUID(),
          },
          env
        );

        const maxAgeSec = Math.floor(ttlMs / 1000);
        const cookieFlags = `Path=/; Max-Age=${maxAgeSec}; HttpOnly; Secure; SameSite=Lax`;

        return jsonResponse(
          {
            ok: true,
            token,
            expiresAt,
            username: creds.username || username.toLowerCase(),
          },
          200,
          request,
          {
            "Set-Cookie": `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieFlags}`,
          }
        );
      } catch {
        return jsonResponse({ ok: false, error: "Format permintaan login tidak valid." }, 400, request);
      }
    }

    if (url.pathname === "/api/auth/verify" && request.method === "GET") {
      const creds = await loadStoredCredentials(env);
      const token = extractSessionToken(request);
      const payload = await verifySessionToken(token, env, creds.credVersion || 1);
      if (!payload) {
        return jsonResponse({ ok: false, authenticated: false }, 401, request);
      }
      return jsonResponse(
        {
          ok: true,
          authenticated: true,
          username: creds.username || payload.sub,
          expiresAt: payload.exp,
        },
        200,
        request
      );
    }

    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      return jsonResponse(
        { ok: true },
        200,
        request,
        {
          "Set-Cookie": `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
        }
      );
    }

    if (url.pathname === "/api/auth/change-credentials" && request.method === "POST") {
      if (!isTrustedMutationOrigin(request)) {
        return jsonResponse({ ok: false, error: "Origin tidak diizinkan." }, 403, request);
      }

      const creds = await loadStoredCredentials(env);
      const token = extractSessionToken(request);
      const session = await verifySessionToken(token, env, creds.credVersion || 1);
      if (!session) {
        return jsonResponse({ ok: false, error: "Sesi tidak valid. Silakan login ulang." }, 401, request);
      }

      try {
        const body = await request.json();
        const currentPassword = String(body?.currentPassword || "");
        const newPassword = String(body?.newPassword || "").trim();
        const newUsername = String(body?.newUsername || "").trim().toLowerCase();

        const currentHash = await hashPassword(currentPassword);
        if (!timingSafeEqual(currentHash, creds.passwordHash)) {
          return jsonResponse({ ok: false, error: "Password saat ini salah!" }, 401, request);
        }

        if (newPassword && newPassword.length < 4) {
          return jsonResponse({ ok: false, error: "Password baru minimal 4 karakter." }, 400, request);
        }

        const nextHash = newPassword ? await hashPassword(newPassword) : creds.passwordHash;
        const nextUser = newUsername || creds.username || "admin";
        const nextCreds = {
          username: nextUser,
          passwordHash: nextHash,
          credVersion: Number(creds.credVersion || 1) + 1,
          updatedAt: Date.now(),
        };

        await saveStoredCredentials(nextCreds, ctx);

        // Terbitkan token baru yang sesuai dengan credVersion terbaru
        const ttlMs = Math.max(60 * 60 * 1000, Number(session.exp) - Date.now());
        const freshToken = await signSessionToken(
          {
            sub: nextUser,
            role: "admin",
            iat: Date.now(),
            exp: Date.now() + ttlMs,
            credVersion: nextCreds.credVersion,
            jti: crypto.randomUUID(),
          },
          env
        );

        return jsonResponse(
          { ok: true, token: freshToken, username: nextUser },
          200,
          request,
          {
            "Set-Cookie": `${SESSION_COOKIE_NAME}=${encodeURIComponent(freshToken)}; Path=/; Max-Age=${Math.floor(ttlMs / 1000)}; HttpOnly; Secure; SameSite=Lax`,
          }
        );
      } catch {
        return jsonResponse({ ok: false, error: "Gagal memproses pembaruan akun." }, 400, request);
      }
    }

    // 2. Endpoint Sinkronisasi Data Lintas Domain (/api/cms-sync)
    if (url.pathname === "/api/cms-sync") {
      const cache = typeof caches !== "undefined" ? caches.default : null;
      const cacheKey = new Request("https://sync-cache.rohis-sman4pwt.local/cms-sync-v3", {
        method: "GET",
      });

      if (request.method === "GET") {
        if (cache) {
          try {
            const cachedRes = await cache.match(cacheKey);
            if (cachedRes) {
              const cachedJson = await cachedRes.json();
              if (
                cachedJson &&
                typeof cachedJson === "object" &&
                !cachedJson.empty &&
                Number(cachedJson.schemaVersion) >= REQUIRED_SCHEMA_VERSION
              ) {
                globalThis.__ROHIS_SHARED_STATE_V3__ = {
                  ...globalThis.__ROHIS_SHARED_STATE_V3__,
                  ...cachedJson,
                };
                return jsonResponse(globalThis.__ROHIS_SHARED_STATE_V3__, 200, request);
              }
            }
          } catch {}
        }

        if (
          globalThis.__ROHIS_SHARED_STATE_V3__ &&
          Number(globalThis.__ROHIS_SHARED_STATE_V3__.schemaVersion) >= REQUIRED_SCHEMA_VERSION
        ) {
          return jsonResponse(globalThis.__ROHIS_SHARED_STATE_V3__, 200, request);
        }

        return jsonResponse({ empty: true, schemaVersion: REQUIRED_SCHEMA_VERSION }, 200, request);
      }

      if (request.method === "POST") {
        // Wajib berasal dari origin terpercaya & membawa sesi token admin valid!
        if (!isTrustedMutationOrigin(request)) {
          return jsonResponse({ ok: false, error: "Origin tidak diizinkan." }, 403, request);
        }

        const creds = await loadStoredCredentials(env);
        const token = extractSessionToken(request);
        const session = await verifySessionToken(token, env, creds.credVersion || 1);
        if (!session) {
          return jsonResponse(
            { ok: false, error: "Unauthorized: Silakan login sebagai Admin terlebih dahulu." },
            401,
            request
          );
        }

        try {
          const contentLength = Number(request.headers.get("Content-Length") || "0");
          if (contentLength > MAX_CMS_BODY_BYTES) {
            return jsonResponse({ ok: false, error: "Payload terlalu besar." }, 413, request);
          }

          const rawText = await request.text();
          if (rawText.length > MAX_CMS_BODY_BYTES) {
            return jsonResponse({ ok: false, error: "Payload melebihi batas maksimum." }, 413, request);
          }

          const incomingRaw = JSON.parse(rawText);

          if (!incomingRaw || Number(incomingRaw.schemaVersion) < REQUIRED_SCHEMA_VERSION) {
            return jsonResponse(
              { ok: false, ignored: true, reason: "Outdated schema version" },
              200,
              request
            );
          }

          // Whitelist properti & sanitasi XSS
          const filteredIncoming = {};
          for (const key of Object.keys(incomingRaw)) {
            if (ALLOWED_CMS_KEYS.has(key)) {
              filteredIncoming[key] = sanitizeCmsValue(incomingRaw[key]);
            }
          }

          let existing = globalThis.__ROHIS_SHARED_STATE_V3__ || {};

          if (cache && Object.keys(existing).length === 0) {
            try {
              const cachedRes = await cache.match(cacheKey);
              if (cachedRes) {
                const cachedJson = await cachedRes.json();
                if (
                  cachedJson &&
                  typeof cachedJson === "object" &&
                  Number(cachedJson.schemaVersion) >= REQUIRED_SCHEMA_VERSION
                ) {
                  existing = { ...existing, ...cachedJson };
                }
              }
            } catch {}
          }

          const merged = {
            ...existing,
            ...filteredIncoming,
            schemaVersion: REQUIRED_SCHEMA_VERSION,
            updatedAt: Date.now(),
          };

          globalThis.__ROHIS_SHARED_STATE_V3__ = merged;

          if (cache) {
            try {
              const cacheRes = new Response(JSON.stringify(merged), {
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "public, max-age=31536000",
                },
              });
              const cachePut = cache.put(cacheKey, cacheRes);
              if (ctx && typeof ctx.waitUntil === "function") {
                ctx.waitUntil(cachePut);
              } else {
                await cachePut;
              }
            } catch {}
          }

          return jsonResponse({ ok: true, updatedAt: merged.updatedAt }, 200, request);
        } catch (err) {
          return jsonResponse({ ok: false, error: String(err) }, 400, request);
        }
      }

      return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405, request);
    }

    // 2.5. Endpoint Upload Gambar Permanen ke CDN Global (/api/upload-image) — Wajib Sesi Admin
    if (url.pathname === "/api/upload-image") {
      if (request.method === "POST") {
        if (!isTrustedMutationOrigin(request)) {
          return jsonResponse({ ok: false, error: "Origin tidak diizinkan." }, 403, request);
        }

        const creds = await loadStoredCredentials(env);
        const token = extractSessionToken(request);
        const session = await verifySessionToken(token, env, creds.credVersion || 1);
        if (!session) {
          return jsonResponse({ ok: false, error: "Unauthorized: Login admin diperlukan untuk mengunggah." }, 401, request);
        }

        try {
          const formData = await request.formData();
          const file = formData.get("file") || formData.get("image") || formData.get("source");
          if (!file || typeof file === "string") {
            return jsonResponse({ ok: false, error: "File gambar tidak valid." }, 400, request);
          }

          if (file.size > MAX_UPLOAD_BYTES) {
            return jsonResponse({ ok: false, error: "Ukuran file melebihi batas 5MB." }, 413, request);
          }

          const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
          if (file.type && !allowedMimes.includes(file.type.toLowerCase())) {
            return jsonResponse({ ok: false, error: "Format file tidak diizinkan. Gunakan JPG/PNG/WEBP." }, 415, request);
          }

          const uploadForm = new FormData();
          uploadForm.append("key", (env && env.FREEIMAGE_API_KEY) || "6d207e02198a847aa98d0a2a901485a5");
          uploadForm.append("action", "upload");
          uploadForm.append("format", "json");
          uploadForm.append("source", file, file.name || "upload.jpg");

          const upstream = await fetch("https://freeimage.host/api/1/upload", {
            method: "POST",
            body: uploadForm,
          });

          if (!upstream.ok) {
            const errBody = await upstream.text();
            return jsonResponse({ ok: false, error: errBody }, 502, request);
          }

          const j = await upstream.json();
          const imgUrl = j?.image?.url || j?.image?.display_url;
          if (!imgUrl) {
            return jsonResponse({ ok: false, error: "Gagal mendapatkan URL gambar CDN." }, 500, request);
          }

          return jsonResponse({ ok: true, url: imgUrl }, 200, request);
        } catch (err) {
          return jsonResponse({ ok: false, error: String(err) }, 500, request);
        }
      }

      return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405, request);
    }

    // 3. Pemisahan Domain Otomatis:
    // - Jika membuka root https://rohissmapa.farisnasrul542.workers.dev/ -> langsung arahkan ke /admin
    if (
      hostname.includes("workers.dev") &&
      (url.pathname === "/" || url.pathname === "" || url.pathname === "/index.html")
    ) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }

    // - Jika mencoba membuka /admin atau /login di domain publik (rohis-sman4pwt.web.id / rohis-banyumas.web.id) -> kembalikan ke beranda publik /
    const isPublicDomain =
      hostname.includes("rohis-sman4pwt.web.id") ||
      hostname.includes("rohis-banyumas.web.id");

    if (
      isPublicDomain &&
      (pathnameLower === "/admin" ||
        pathnameLower.startsWith("/admin/") ||
        pathnameLower === "/login")
    ) {
      return Response.redirect(`${url.origin}/`, 302);
    }

    // 4. Layani aset statis Next.js dari ./out dengan HTTP Security Headers penuh
    const assetRes = await env.ASSETS.fetch(request);
    const contentType = assetRes.headers.get("content-type") || "";
    const isHtml =
      contentType.includes("text/html") ||
      url.pathname === "/" ||
      url.pathname === "" ||
      url.pathname.endsWith(".html");

    const isAdminRoute =
      pathnameLower === "/admin" ||
      pathnameLower.startsWith("/admin/") ||
      pathnameLower === "/login";

    const newHeaders = new Headers(assetRes.headers);
    applySecurityHeaders(newHeaders, {
      isHtml,
      isPrivate: isHtml || isAdminRoute,
    });

    return new Response(assetRes.body, {
      status: assetRes.status,
      statusText: assetRes.statusText,
      headers: newHeaders,
    });
  },
};
