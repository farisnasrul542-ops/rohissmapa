import type React from "react";

/**
 * Utility untuk konversi URL gambar Google Drive menjadi link gambar langsung (direct stream)
 * lengkap dengan sistem multi-endpoint auto-fallback anti-limit (429/403).
 */

export function getGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Pattern 2: https://drive.google.com/open?id=FILE_ID, uc?id=FILE_ID, thumbnail?id=FILE_ID, atau drive.usercontent.google.com/download?id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern 3: https://lh3.googleusercontent.com/d/FILE_ID atau =w1600
  const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  return getGoogleDriveFileId(url) !== null;
}

/**
 * Daftar berurutan endpoint gambar Google Drive untuk auto-fallback apabila salah satu terkena rate-limit (429) atau blokir cookie.
 */
export function getGoogleDriveFallbackUrls(urlOrFileId: string): string[] {
  const fileId = getGoogleDriveFileId(urlOrFileId) || urlOrFileId.trim();
  if (!fileId || fileId.includes("/") || fileId.includes(":")) return [];

  return [
    `https://lh3.googleusercontent.com/d/${fileId}=w1600`,
    `https://wsrv.nl/?url=https://lh3.googleusercontent.com/d/${fileId}=w1600`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
  ];
}

export function formatGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();
  const hashIndex = trimmed.indexOf("#crop=");
  const cropHash = hashIndex !== -1 ? trimmed.slice(hashIndex) : "";
  const basePart = hashIndex !== -1 ? trimmed.slice(0, hashIndex) : trimmed;

  const fileId = getGoogleDriveFileId(basePart);
  if (fileId) {
    // Gunakan endpoint direct stream dengan parameter resolusi =w1600 agar cepat & bebas cache error lama
    return `https://lh3.googleusercontent.com/d/${fileId}=w1600${cropHash}`;
  }

  return trimmed;
}

/**
 * Handler otomatis untuk `<img onError={...} />`:
 * Jika link utama Google Drive gagal dimuat (misal 429 Too Many Requests atau blokir cookie),
 * otomatis beralih ke endpoint cadangan Google Drive berikutnya.
 */
export function handleGoogleDriveImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  rawUrl?: string
): boolean {
  const imgEl = e.currentTarget;
  const sourceUrl = rawUrl || imgEl.src || "";
  const fileId = getGoogleDriveFileId(sourceUrl);
  if (!fileId) return false;

  const fallbacks = getGoogleDriveFallbackUrls(fileId);
  const currentAttempt = parseInt(imgEl.dataset.driveRetry || "0", 10);

  if (currentAttempt < fallbacks.length) {
    const nextUrl = fallbacks[currentAttempt];
    imgEl.dataset.driveRetry = String(currentAttempt + 1);
    imgEl.referrerPolicy = "no-referrer";
    if (imgEl.src !== nextUrl) {
      imgEl.src = nextUrl;
      return true;
    } else if (currentAttempt + 1 < fallbacks.length) {
      imgEl.dataset.driveRetry = String(currentAttempt + 2);
      imgEl.src = fallbacks[currentAttempt + 1];
      return true;
    }
  }

  return false;
}
