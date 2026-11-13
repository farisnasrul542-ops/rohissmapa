/**
 * Sistem Proteksi Password & Sesi Otentikasi Panel Admin ROHIS SMAPA (Hardened v2)
 * - Tidak menyimpan kata sandi plaintext di kode frontend (menggunakan SHA-256 salted hash)
 * - Otentikasi utama berjalan di server Cloudflare Worker (/api/auth/*) dengan token bertanda tangan HMAC-SHA256
 * - Mendukung mode dev lokal (localhost) secara aman saat Worker tidak aktif
 */

const AUTH_SESSION_KEY = "rohis_admin_auth_session_v1";
const CUSTOM_PASSWORD_HASH_KEY = "rohis_admin_custom_pw_hash_v2";
const CUSTOM_USERNAME_KEY = "rohis_admin_custom_username_v1";

export const DEFAULT_ADMIN_USERNAME = "admin";
const PASSWORD_SALT = "rohis-smapa-2026-salt!";
// SHA-256(rohis-smapa-2026-salt!:<default_password>) — tidak ada password plaintext di bundle client
const DEFAULT_PASSWORD_HASH = "2842b6ff26e3d19fcbef2b59479cc0c704dda730f6b51236d8d2fc0423967db1";
const VALID_FALLBACK_USERNAMES = ["admin", "rohis", "bph", "admin@sman4purwokerto.sch.id"];

function isLocalhostEnv(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

async function computeSaltedSha256(plain: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return "";
  }
  const bytes = new TextEncoder().encode(`${PASSWORD_SALT}:${plain}`);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getStoredAdminUsername(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_USERNAME;
  try {
    const custom = localStorage.getItem(CUSTOM_USERNAME_KEY);
    return custom && custom.trim().length > 0 ? custom.trim() : DEFAULT_ADMIN_USERNAME;
  } catch {
    return DEFAULT_ADMIN_USERNAME;
  }
}

export function getAdminSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.authenticated || !parsed.expiresAt) return null;
    if (Date.now() > Number(parsed.expiresAt)) return null;
    return typeof parsed.token === "string" && parsed.token.length > 0 ? parsed.token : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw =
      sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.authenticated || !parsed.expiresAt) return false;
    if (Date.now() > Number(parsed.expiresAt)) {
      logoutAdmin();
      return false;
    }
    // Di domain produksi (non-localhost), wajib memiliki token bertanda tangan server
    if (!isLocalhostEnv() && !parsed.token) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function loginAdminSession(rememberMe = true, token?: string, expiresAt?: number, username?: string): void {
  if (typeof window === "undefined") return;
  const finalExpires = expiresAt || Date.now() + (rememberMe ? 12 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000);
  const payload = JSON.stringify({
    authenticated: true,
    token: token || (isLocalhostEnv() ? "local-dev-session" : ""),
    username: username || getStoredAdminUsername(),
    loginAt: Date.now(),
    expiresAt: finalExpires,
  });
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, payload);
    if (rememberMe) {
      localStorage.setItem(AUTH_SESSION_KEY, payload);
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
    if (username) {
      localStorage.setItem(CUSTOM_USERNAME_KEY, username);
    }
    window.dispatchEvent(new Event("rohis_admin_auth_changed"));
  } catch {}
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  rateLimited?: boolean;
}

export async function loginWithServerAuth(
  username: string,
  password: string,
  rememberMe = true
): Promise<AuthResult> {
  const cleanUser = username.trim() || "admin";

  // 1. Coba otentikasi kriptografis di Cloudflare Worker (/api/auth/login)
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: cleanUser, password, rememberMe }),
    });

    if (res.status !== 404 && res.status !== 405) {
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok && json?.token) {
        loginAdminSession(rememberMe, json.token, json.expiresAt, json.username || cleanUser);
        return { ok: true };
      }
      return {
        ok: false,
        rateLimited: Boolean(json?.rateLimited || res.status === 429),
        error: json?.error || "Username atau Password yang Anda masukkan salah!",
      };
    }
  } catch {
    // Jika gagal jaringan di non-localhost, jangan izinkan bypass sembarangan
    if (!isLocalhostEnv()) {
      return {
        ok: false,
        error: "Tidak dapat terhubung ke server otentikasi. Periksa koneksi internet Anda.",
      };
    }
  }

  // 2. Fallback KHUSUS environment localhost dev (next dev tanpa worker.mjs)
  if (isLocalhostEnv()) {
    const validLocal = await verifyLocalHashedPassword(password, cleanUser);
    if (validLocal) {
      loginAdminSession(rememberMe, "local-dev-session", undefined, cleanUser);
      return { ok: true };
    }
    return {
      ok: false,
      error: "Username atau Password yang Anda masukkan salah!",
    };
  }

  return {
    ok: false,
    error: "Server otentikasi tidak tersedia.",
  };
}

async function verifyLocalHashedPassword(inputPassword: string, inputUsername?: string): Promise<boolean> {
  if (!inputPassword) return false;
  const candidateHash = await computeSaltedSha256(inputPassword);
  let expectedHash = DEFAULT_PASSWORD_HASH;
  try {
    const customHash = localStorage.getItem(CUSTOM_PASSWORD_HASH_KEY);
    if (customHash && /^[0-9a-f]{64}$/i.test(customHash)) {
      expectedHash = customHash;
    }
  } catch {}

  if (candidateHash !== expectedHash) return false;

  if (inputUsername && inputUsername.trim() !== "") {
    const clean = inputUsername.trim().toLowerCase();
    const expectedUser = getStoredAdminUsername().toLowerCase();
    return clean === expectedUser || VALID_FALLBACK_USERNAMES.includes(clean);
  }
  return true;
}

export async function verifySessionWithServer(): Promise<boolean> {
  if (!isAdminAuthenticated()) return false;
  if (isLocalhostEnv()) return true;

  const token = getAdminSessionToken();
  if (!token) {
    logoutAdmin();
    return false;
  }

  try {
    const res = await fetch("/api/auth/verify", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (res.status === 404) return true; // jika endpoint belum ada saat dev proxy
    if (!res.ok) {
      logoutAdmin();
      return false;
    }
    const json = await res.json().catch(() => null);
    if (!json?.authenticated) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch {
    return isAdminAuthenticated();
  }
}

export async function changeAdminCredentialsWithServer(
  currentPassword: string,
  newPassword: string,
  newUsername: string
): Promise<AuthResult> {
  const token = getAdminSessionToken();
  const cleanNewUser = newUsername.trim() || getStoredAdminUsername();

  try {
    const res = await fetch("/api/auth/change-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        currentPassword,
        newPassword: newPassword.trim(),
        newUsername: cleanNewUser,
      }),
    });

    if (res.status !== 404 && res.status !== 405) {
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        if (json.token) {
          loginAdminSession(true, json.token, undefined, json.username || cleanNewUser);
        } else {
          localStorage.setItem(CUSTOM_USERNAME_KEY, cleanNewUser);
        }
        return { ok: true };
      }
      return {
        ok: false,
        error: json?.error || "Gagal memperbarui kredensial akun!",
      };
    }
  } catch {
    if (!isLocalhostEnv()) {
      return { ok: false, error: "Gagal menghubungi server otentikasi." };
    }
  }

  // Fallback localhost dev
  if (isLocalhostEnv()) {
    const valid = await verifyLocalHashedPassword(currentPassword);
    if (!valid) {
      return { ok: false, error: "Password saat ini salah!" };
    }
    if (newPassword.trim().length > 0 && newPassword.trim().length < 4) {
      return { ok: false, error: "Password baru minimal 4 karakter." };
    }
    if (newPassword.trim()) {
      const newHash = await computeSaltedSha256(newPassword.trim());
      localStorage.setItem(CUSTOM_PASSWORD_HASH_KEY, newHash);
    }
    localStorage.setItem(CUSTOM_USERNAME_KEY, cleanNewUser);
    return { ok: true };
  }

  return { ok: false, error: "Gagal memperbarui akun." };
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    window.dispatchEvent(new Event("rohis_admin_auth_changed"));
  } catch {}
}
