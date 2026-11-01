/**
 * Sistem Proteksi Password & Sesi Otentikasi Panel Admin ROHIS SMAPA
 */

const AUTH_SESSION_KEY = "rohis_admin_auth_session_v1";
const CUSTOM_PASSWORD_KEY = "rohis_admin_custom_password_v1";
const CUSTOM_USERNAME_KEY = "rohis_admin_custom_username_v1";

export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "smapa2026";

export function getStoredAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
  try {
    const custom = localStorage.getItem(CUSTOM_PASSWORD_KEY);
    return custom && custom.trim().length > 0 ? custom.trim() : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
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

export function updateAdminCredentials(newPassword: string, newUsername?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (newPassword && newPassword.trim().length > 0) {
      localStorage.setItem(CUSTOM_PASSWORD_KEY, newPassword.trim());
    }
    if (newUsername && newUsername.trim().length > 0) {
      localStorage.setItem(CUSTOM_USERNAME_KEY, newUsername.trim());
    }
  } catch {}
}

export function verifyAdminPassword(inputPassword: string, inputUsername?: string): boolean {
  const expectedPassword = getStoredAdminPassword();
  const expectedUsername = getStoredAdminUsername().toLowerCase();

  const passwordMatch = inputPassword === expectedPassword;
  if (!passwordMatch) return false;

  if (inputUsername !== undefined && inputUsername.trim() !== "") {
    const cleanUser = inputUsername.trim().toLowerCase();
    const validUsernames = [
      expectedUsername,
      "admin",
      "rohis",
      "bph",
      "admin@sman4purwokerto.sch.id",
    ];
    return validUsernames.includes(cleanUser);
  }

  return true;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.authenticated || !parsed.expiresAt) return false;
    if (Date.now() > parsed.expiresAt) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function loginAdminSession(rememberMe = true): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    authenticated: true,
    loginAt: Date.now(),
    // Berlaku 12 jam jika rememberMe, atau 4 jam sesi standar
    expiresAt: Date.now() + (rememberMe ? 12 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000),
  });
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, payload);
    if (rememberMe) {
      localStorage.setItem(AUTH_SESSION_KEY, payload);
    }
    window.dispatchEvent(new Event("rohis_admin_auth_changed"));
  } catch {}
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.dispatchEvent(new Event("rohis_admin_auth_changed"));
  } catch {}
}

