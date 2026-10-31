import type React from "react";
import { formatGoogleDriveUrl, getGoogleDriveFileId } from "./driveUtils";

export interface ImageCropConfig {
  x: number; // 0 - 100 (horizontal focal point %)
  y: number; // 0 - 100 (vertical focal point %)
  zoom: number; // 0.25 - 3.0 (scale multiplier: < 1 = perkecil/zoom-out, > 1 = perbesar/zoom-in)
  fit: "cover" | "contain";
}

export const DEFAULT_IMAGE_CROP: ImageCropConfig = {
  x: 50,
  y: 50,
  zoom: 1,
  fit: "cover",
};

function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val)) return min;
  return Math.min(max, Math.max(min, val));
}

/**
 * Parses an image URL that may contain `#crop=x,y,zoom,fit` metadata.
 */
export function parseImageCrop(rawUrl?: string | null): {
  src: string;
  crop: ImageCropConfig;
  hasCustomCrop: boolean;
} {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      src: "",
      crop: { ...DEFAULT_IMAGE_CROP },
      hasCustomCrop: false,
    };
  }

  const trimmed = rawUrl.trim();
  const hashIdx = trimmed.indexOf("#crop=");

  if (hashIdx === -1) {
    return {
      src: formatGoogleDriveUrl(trimmed),
      crop: { ...DEFAULT_IMAGE_CROP },
      hasCustomCrop: false,
    };
  }

  const basePart = trimmed.slice(0, hashIdx);
  const hashPart = trimmed.slice(hashIdx + 6); // after "#crop="
  const parts = hashPart.split(",");

  const x = clamp(parseFloat(parts[0] ?? "50"), 0, 100);
  const y = clamp(parseFloat(parts[1] ?? "50"), 0, 100);
  const zoom = clamp(parseFloat(parts[2] ?? "1"), 0.25, 3);
  const fit: "cover" | "contain" = parts[3] === "contain" ? "contain" : "cover";

  const isDefault =
    Math.round(x) === 50 &&
    Math.round(y) === 50 &&
    Math.abs(zoom - 1) < 0.02 &&
    fit === "cover";

  return {
    src: formatGoogleDriveUrl(basePart),
    crop: { x, y, zoom, fit },
    hasCustomCrop: !isDefault,
  };
}

/**
 * Combines a clean image URL and crop settings into a single string with `#crop=x,y,zoom,fit`.
 */
export function buildImageCropUrl(
  rawUrl: string,
  crop: ImageCropConfig
): string {
  const { src } = parseImageCrop(rawUrl);
  if (!src) return "";

  const rx = Math.round(clamp(crop.x, 0, 100));
  const ry = Math.round(clamp(crop.y, 0, 100));
  const rzoom = Number(clamp(crop.zoom, 0.25, 3).toFixed(2));
  const rfit = crop.fit === "contain" ? "contain" : "cover";

  if (rx === 50 && ry === 50 && rzoom === 1 && rfit === "cover") {
    return src;
  }

  return `${src}#crop=${rx},${ry},${rzoom},${rfit}`;
}

/**
 * Returns inline CSS styles (`objectFit`, `objectPosition`, `transform`, `transformOrigin`)
 * so any `<img />` or Next.js `<Image />` renders with the exact crop/zoom/position,
 * including both Zoom In (> 100%) and Zoom Out / Perkecil (< 100%).
 */
export function getImageCropStyle(rawUrl?: string | null): React.CSSProperties {
  const { crop } = parseImageCrop(rawUrl);
  const z = crop.zoom;

  // When zooming out (perkecil, z < 1) in cover mode, expand the virtual vertical box
  // before scaling down so vertical photos reveal more top/bottom content instead of clipping.
  if (crop.fit === "cover" && z < 0.99) {
    const unclipFactor = Math.max(0.55, z);
    const invHeightPct = Number((100 / unclipFactor).toFixed(2));
    const topOffsetPct = Number((((1 - 1 / unclipFactor) * 100) / 2).toFixed(2));

    return {
      objectFit: "cover",
      objectPosition: `${crop.x}% ${crop.y}%`,
      width: "100%",
      height: `${invHeightPct}%`,
      position: "relative",
      top: `${topOffsetPct}%`,
      transform: `scale(${z})`,
      transformOrigin: `${crop.x}% 50%`,
    };
  }

  return {
    objectFit: crop.fit,
    objectPosition: `${crop.x}% ${crop.y}%`,
    transform: Math.abs(z - 1) > 0.01 ? `scale(${z})` : undefined,
    transformOrigin: `${crop.x}% ${crop.y}%`,
  };
}

/**
 * Compresses an uploaded image file from the user's device into an optimized JPEG DataURL
 * so it can be safely stored in localStorage without hitting storage quota limits.
 * Automatically detects and converts Apple iPhone HEIC/HEIF images to JPEG!
 */
export async function compressUploadedImageFile(
  fileOrBlob: File | Blob,
  maxDimension = 1280,
  quality = 0.86
): Promise<string> {
  let fileToProcess: Blob = fileOrBlob;

  // Deteksi format HEIC / HEIF (format default kamera Apple iPhone/iPad)
  const fileName = (fileOrBlob as File).name?.toLowerCase() || "";
  const fileType = fileOrBlob.type?.toLowerCase() || "";
  const isHeic =
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    fileType === "image/heic" ||
    fileType === "image/heif";

  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: fileOrBlob,
        toType: "image/jpeg",
        quality: 0.9,
      });
      fileToProcess = Array.isArray(converted) ? converted[0] : converted;
    } catch (err: any) {
      console.error("Gagal konversi HEIC:", err);
      throw new Error(
        "Gagal mengonversi format HEIC/Apple. Silakan coba pilih format JPEG/PNG atau upload ulang."
      );
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onerror = () => reject(new Error("Format file gambar tidak valid atau tidak didukung browser"));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.fillStyle = "#062017";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(fileToProcess);
  });
}

/**
 * Permanently crops the visible region into a new JPEG DataURL using HTML5 Canvas.
 * Works for uploaded files, local `/images/...` assets, and CORS-enabled URLs.
 */
export function bakeCroppedImageCanvas(
  rawUrl: string,
  crop: ImageCropConfig,
  aspectRatio = 16 / 10,
  targetWidth = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { src } = parseImageCrop(rawUrl);
    if (!src) {
      reject(new Error("URL gambar kosong"));
      return;
    }

    const img = new window.Image();
    img.referrerPolicy = "no-referrer";
    if (!src.startsWith("data:") && !src.startsWith("/")) {
      img.crossOrigin = "anonymous";
    }

    const driveId = getGoogleDriveFileId(src);
    let retriedProxy = false;

    img.onerror = () => {
      if (driveId && !retriedProxy) {
        retriedProxy = true;
        img.src = `https://wsrv.nl/?url=https://lh3.googleusercontent.com/d/${driveId}=w1600`;
        return;
      }
      reject(
        new Error(
          "Server gambar eksternal membatasi potong piksel langsung (CORS). Gunakan tombol 'Terapkan Posisi & Crop' yang 100% mendukung semua link!"
        )
      );
    };

    img.onload = () => {
      const Wi = img.naturalWidth || img.width;
      const Hi = img.naturalHeight || img.height;
      const Ri = Wi / Hi;
      const R = aspectRatio > 0 ? aspectRatio : 16 / 10;

      const canvasW = targetWidth;
      const canvasH = Math.round(targetWidth / R);

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Gagal menginisialisasi Canvas 2D"));
        return;
      }

      ctx.fillStyle = "#062017";
      ctx.fillRect(0, 0, canvasW, canvasH);

      if (crop.fit === "contain") {
        // Draw with contain fit + zoom scale
        let drawW = canvasW;
        let drawH = canvasH;
        if (Ri > R) {
          drawH = canvasW / Ri;
        } else {
          drawW = canvasH * Ri;
        }
        drawW *= crop.zoom;
        drawH *= crop.zoom;
        const dx = (canvasW - drawW) * (crop.x / 100);
        const dy = (canvasH - drawH) * (crop.y / 100);
        ctx.drawImage(img, 0, 0, Wi, Hi, dx, dy, drawW, drawH);
      } else if (crop.zoom < 1) {
        // Cover mode zoomed out (perkecil < 100%)
        const unclipFactor = Math.max(0.55, crop.zoom);
        const Rbox = R * unclipFactor;
        let w0 = Wi;
        let h0 = Hi;
        if (Ri > Rbox) {
          h0 = Hi;
          w0 = Hi * Rbox;
        } else {
          w0 = Wi;
          h0 = Wi / Rbox;
        }
        const sx = (crop.x / 100) * (Wi - w0);
        const sy = (crop.y / 100) * (Hi - h0);

        const destW = canvasW * crop.zoom;
        const destH = (canvasH / unclipFactor) * crop.zoom;
        const dx = (canvasW - destW) * (crop.x / 100);
        const dy = (canvasH - destH) / 2;

        ctx.drawImage(img, sx, sy, w0, h0, dx, dy, destW, destH);
      } else {
        // Cover math matching CSS objectPosition (x% y%) + transformOrigin (x% y%) + scale(zoom)
        let w0 = Wi;
        let h0 = Hi;
        if (Ri > R) {
          h0 = Hi;
          w0 = Hi * R;
        } else {
          w0 = Wi;
          h0 = Wi / R;
        }

        const x0 = (crop.x / 100) * (Wi - w0);
        const y0 = (crop.y / 100) * (Hi - h0);

        const wz = w0 / crop.zoom;
        const hz = h0 / crop.zoom;

        const sx = x0 + (crop.x / 100) * (w0 - wz);
        const sy = y0 + (crop.y / 100) * (h0 - hz);

        ctx.drawImage(img, sx, sy, wz, hz, 0, 0, canvasW, canvasH);
      }

      try {
        const baked = canvas.toDataURL("image/jpeg", 0.88);
        resolve(baked);
      } catch {
        reject(
          new Error(
            "Link eksternal membatasi ekspor kanvas. Gunakan 'Terapkan Posisi & Crop'!"
          )
        );
      }
    };

    img.src = src;
  });
}

