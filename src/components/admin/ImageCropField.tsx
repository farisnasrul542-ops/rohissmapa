"use client";

import React, { useState, useRef } from "react";
import {
  Crop,
  Upload,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Maximize2,
  Minimize2,
  Check,
  Sparkles,
  Link2,
  Scissors,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import {
  ImageCropConfig,
  parseImageCrop,
  buildImageCropUrl,
  getImageCropStyle,
  compressUploadedImageFile,
  bakeCroppedImageCanvas,
} from "@/lib/imageCropUtils";
import { formatGoogleDriveUrl, handleGoogleDriveImageError } from "@/lib/driveUtils";
import { uploadImageToWebSystem } from "@/lib/imageUpload";

export interface ImageCropFieldProps {
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  aspectRatio?: "16:10" | "16:9" | "4:3" | "1:1" | "circle";
  placeholder?: string;
  showGoogleDriveHint?: boolean;
  previewBadge?: string;
  previewTitle?: string;
  previewSubtitle?: string;
  compact?: boolean;
}

export default function ImageCropField({
  label = "URL Gambar / Foto",
  value,
  onChange,
  aspectRatio = "16:10",
  placeholder = "https://drive.google.com/... atau link gambar publik",
  showGoogleDriveHint = true,
  previewBadge,
  previewTitle,
  previewSubtitle,
  compact = false,
}: ImageCropFieldProps) {
  const { src, crop, hasCustomCrop } = parseImageCrop(value);

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isPreviewMinimized, setIsPreviewMinimized] = useState(compact);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBaking, setIsBaking] = useState(false);
  const [bakeFeedback, setBakeFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const numericAspect =
    aspectRatio === "16:9"
      ? 16 / 9
      : aspectRatio === "4:3"
      ? 4 / 3
      : aspectRatio === "1:1" || aspectRatio === "circle"
      ? 1
      : 16 / 10;

  const updateCrop = (partial: Partial<ImageCropConfig>) => {
    const nextCrop: ImageCropConfig = {
      ...crop,
      ...partial,
    };
    onChange(buildImageCropUrl(src, nextCrop));
  };

  const handleUrlInputChange = (rawInput: string) => {
    const formattedBase = formatGoogleDriveUrl(rawInput);
    const { src: cleanBase } = parseImageCrop(formattedBase);
    if (!cleanBase) {
      onChange("");
      return;
    }
    onChange(buildImageCropUrl(cleanBase, crop));
  };

  // Pointer drag on preview box to pan X% and Y%
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!src) return;
    // Ignore clicks on buttons or links inside the preview
    if ((e.target as HTMLElement).closest("button, a")) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: crop.x,
      startY: crop.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    // Sensitivity scales inversely with zoom so dragging feels natural
    const sensitivity = 100 / Math.max(1, crop.zoom * 0.85);
    const nextX = Math.min(
      100,
      Math.max(0, dragStartRef.current.startX - (deltaX / rect.width) * sensitivity)
    );
    const nextY = Math.min(
      100,
      Math.max(0, dragStartRef.current.startY - (deltaY / rect.height) * sensitivity)
    );

    updateCrop({
      x: Math.round(nextX),
      y: Math.round(nextY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Handle file upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = file.name?.toLowerCase() || "";
    const fileType = file.type?.toLowerCase() || "";
    const isHeic =
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif") ||
      fileType === "image/heic" ||
      fileType === "image/heif";

    setBakeFeedback(
      isHeic
        ? "Sedang mengonversi format iPhone (HEIC) ke JPEG..."
        : "Sedang memproses dan mengompres foto..."
    );

    try {
      const dataUrl = await compressUploadedImageFile(file, 1280, 0.86);
      onChange(dataUrl);
      setIsStudioOpen(true);

      setBakeFeedback("Sedang mengunci & mengunggah foto ke sistem web...");
      let finalUrl = dataUrl;
      try {
        finalUrl = await uploadImageToWebSystem(dataUrl, file.name || "upload.jpg");
        onChange(finalUrl);
        setBakeFeedback(
          "✓ Foto berhasil dikunci ke sistem web! Otomatis dapat dilihat di HP & semua perangkat."
        );
      } catch {
        setBakeFeedback(
          isHeic
            ? "✓ Foto iPhone (HEIC) berhasil dimuat! Geser atau zoom untuk mengatur crop."
            : "✓ Foto berhasil dimuat! Geser atau zoom untuk mengatur crop."
        );
      }
      setTimeout(() => setBakeFeedback(null), 5000);
    } catch (err: any) {
      setBakeFeedback(err?.message || "Gagal memproses file gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Permanent canvas bake crop
  const handleBakePermanentCrop = async () => {
    if (!src) return;
    setIsBaking(true);
    setBakeFeedback("Sedang memotong gambar...");
    try {
      const bakedDataUrl = await bakeCroppedImageCanvas(
        src,
        crop,
        numericAspect,
        1080
      );
      onChange(bakedDataUrl);

      setBakeFeedback("Sedang mengunci potongan foto ke sistem web...");
      let finalUrl = bakedDataUrl;
      try {
        finalUrl = await uploadImageToWebSystem(bakedDataUrl, "crop-baked.jpg");
        onChange(finalUrl);
        setBakeFeedback("✓ Foto berhasil dipotong & dikunci ke sistem web!");
      } catch {
        setBakeFeedback("✓ Gambar berhasil dipotong permanen sesuai bingkai!");
      }
      setTimeout(() => setBakeFeedback(null), 4000);
    } catch (err: any) {
      // Fallback: keep non-destructive crop parameters which always work on any link
      setBakeFeedback(
        "✓ Posisi & Crop disimpan! (Link eksternal menggunakan mode crop dinamis anti-pecah)"
      );
      setTimeout(() => setBakeFeedback(null), 4500);
    } finally {
      setIsBaking(false);
    }
  };

  const isDataUrl = src.startsWith("data:image/");

  const frameSizeClass =
    aspectRatio === "circle"
      ? isPreviewMinimized
        ? "w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto"
        : "w-36 h-36 sm:w-40 sm:h-40 rounded-full mx-auto"
      : aspectRatio === "1:1"
      ? isPreviewMinimized
        ? "w-32 h-32 sm:w-36 sm:h-36 rounded-2xl mx-auto"
        : "w-44 h-44 sm:w-52 sm:h-52 rounded-2xl mx-auto"
      : isPreviewMinimized
      ? "h-28 sm:h-32 w-full rounded-2xl"
      : "h-44 sm:h-52 w-full rounded-2xl";

  return (
    <div className="space-y-3 text-xs">
      {/* Hidden File Input (supports standard images + Apple HEIC/HEIF) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif,.HEIC,.HEIF"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── 1. INTERACTIVE LIVE PREVIEW & DRAG-TO-CROP FRAME ── */}
      {src && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
              <Move size={13} className="text-emerald-800" />
              <span>
                Pratinjau &amp; Crop Interaktif{" "}
                <span className="font-normal text-slate-500">
                  (Klik &amp; geser gambar untuk mengatur posisi)
                </span>
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              {hasCustomCrop && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/10 text-emerald-950 border border-emerald-800/20 text-[10px] font-extrabold">
                  Posisi: {Math.round(crop.x)}%, {Math.round(crop.y)}% •{" "}
                  {Math.round(crop.zoom * 100)}%
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsPreviewMinimized((prev) => !prev)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                title={
                  isPreviewMinimized
                    ? "Perbesar ukuran kotak pratinjau"
                    : "Perkecil ukuran kotak pratinjau"
                }
              >
                {isPreviewMinimized ? (
                  <>
                    <Maximize2 size={10} />
                    <span>Perbesar Kotak</span>
                  </>
                ) : (
                  <>
                    <Minimize2 size={10} />
                    <span>Perkecil Kotak</span>
                  </>
                )}
              </button>
              {!src.startsWith("data:") && (
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Buka Asli</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Frame Container */}
          <div
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: "none" }}
            className={`relative overflow-hidden border-2 ${
              isDragging
                ? "border-amber-400 ring-4 ring-amber-400/20 cursor-grabbing"
                : isStudioOpen
                ? "border-emerald-700 ring-3 ring-emerald-800/15 cursor-grab"
                : "border-slate-200/90 hover:border-emerald-700/60 cursor-grab"
            } bg-[#062017] shadow-inner select-none transition-all ${frameSizeClass}`}
          >
            {/* Actual Cropped/Positioned Image */}
            <img
              key={src}
              src={src}
              alt={previewTitle || "Preview Gambar"}
              draggable={false}
              referrerPolicy="no-referrer"
              onError={(e) => handleGoogleDriveImageError(e, src)}
              style={getImageCropStyle(value)}
              className="w-full h-full pointer-events-none select-none transition-transform duration-75"
            />

            {/* Rule-of-Thirds 3x3 Crop Grid Overlay (Visible when dragging or studio open) */}
            {(isDragging || isStudioOpen) && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border-2 border-amber-300 bg-amber-300/30 shadow-sm" />
                  </div>
                  <div className="border-b border-white/40" />
                  <div className="border-r border-white/40" />
                  <div className="border-r border-white/40" />
                  <div />
                </div>
              </div>
            )}

            {/* Overlay Info (Only for rectangular banners when not dragging) */}
            {aspectRatio !== "circle" && aspectRatio !== "1:1" && !isDragging && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex flex-col justify-between p-3 pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  {previewBadge ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-emerald-200 border border-white/15 text-[10px] font-extrabold uppercase tracking-wider">
                      {previewBadge}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-amber-300 border border-white/15 text-[10px] font-bold flex items-center gap-1">
                    <Move size={10} />
                    <span>Geser Gambar</span>
                  </span>
                </div>

                {(previewTitle || previewSubtitle) && (
                  <div>
                    {previewSubtitle && (
                      <p className="text-[10px] text-amber-300 font-bold truncate">
                        {previewSubtitle}
                      </p>
                    )}
                    {previewTitle && (
                      <p className="text-xs font-extrabold text-white truncate drop-shadow">
                        {previewTitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. QUICK ACTION TOOLBAR (STUDIO CROP + UPLOAD + RESET) ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsStudioOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer border ${
            isStudioOpen
              ? "bg-[#062017] text-white border-emerald-900 border-b-2 border-b-black shadow-xs"
              : "bg-emerald-950/[0.06] hover:bg-emerald-950/[0.12] text-emerald-950 border-emerald-900/20"
          }`}
        >
          <Crop size={13} className={isStudioOpen ? "text-amber-300" : "text-emerald-800"} />
          <span>
            {isStudioOpen ? "Tutup Pengatur Crop" : "✂️ Crop & Atur Tampilan Gambar"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] border border-slate-200/90 border-b-2 border-b-slate-300 transition-all cursor-pointer"
        >
          <Upload size={13} className="text-emerald-800" />
          <span>{isUploading ? "Mengunggah..." : "Upload File (PC/HP)"}</span>
        </button>

        {src && (
          <div className="inline-flex items-center gap-1 bg-white px-1.5 py-1 rounded-xl border border-slate-200/90 border-b-2 border-b-slate-300">
            <button
              type="button"
              onClick={() =>
                updateCrop({
                  zoom: Math.max(0.25, Number((crop.zoom - 0.1).toFixed(2))),
                })
              }
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-extrabold text-[11px] transition-colors cursor-pointer"
              title="Perkecil ukuran tampilan gambar (Zoom Out)"
            >
              <ZoomOut size={12} className="text-emerald-800" />
              <span>Perkecil</span>
            </button>
            <span className="text-[10.5px] font-mono font-extrabold text-emerald-950 px-1.5 py-0.5 rounded bg-slate-100">
              {Math.round(crop.zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() =>
                updateCrop({
                  zoom: Math.min(3, Number((crop.zoom + 0.1).toFixed(2))),
                })
              }
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-extrabold text-[11px] transition-colors cursor-pointer"
              title="Perbesar ukuran tampilan gambar (Zoom In)"
            >
              <ZoomIn size={12} className="text-emerald-800" />
              <span>Perbesar</span>
            </button>
          </div>
        )}

        {hasCustomCrop && (
          <button
            type="button"
            onClick={() =>
              updateCrop({ x: 50, y: 50, zoom: 1, fit: "cover" })
            }
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
            title="Kembalikan posisi & zoom ke tengah normal"
          >
            <RotateCcw size={12} />
            <span>Reset Crop</span>
          </button>
        )}
      </div>

      {/* Feedback Banner */}
      {bakeFeedback && (
        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <Check size={14} className="text-emerald-700 shrink-0" />
          <span>{bakeFeedback}</span>
        </div>
      )}

      {/* ── 3. EXPANDABLE STUDIO CROP & REPOSITION CONTROLS ── */}
      {isStudioOpen && src && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 border-l-[4px] border-l-[#062017] space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
              <SlidersHorizontal size={14} className="text-emerald-800" />
              <span>Studio Crop, Zoom &amp; Titik Fokus Gambar</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              Tips: Geser gambar langsung di kotak atas
            </span>
          </div>

          {/* Zoom Slider (Perkecil 25% s/d Perbesar 300%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <ZoomIn size={13} className="text-emerald-800" />
                <span>Perkecil / Perbesar (Zoom Crop)</span>
              </span>
              <div className="flex items-center gap-1.5">
                {crop.zoom < 0.99 && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60">
                    Mode Perkecil
                  </span>
                )}
                <span className="font-mono font-extrabold text-emerald-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {Math.round(crop.zoom * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    zoom: Math.max(0.25, Number((crop.zoom - 0.1).toFixed(2))),
                  })
                }
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10.5px] cursor-pointer shrink-0"
                title="Perkecil Gambar (Zoom Out)"
              >
                <ZoomOut size={13} className="text-emerald-800" />
                <span>Perkecil</span>
              </button>
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.05}
                value={crop.zoom}
                onChange={(e) => updateCrop({ zoom: parseFloat(e.target.value) })}
                className="flex-1 accent-[#062017] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    zoom: Math.min(3, Number((crop.zoom + 0.1).toFixed(2))),
                  })
                }
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10.5px] cursor-pointer shrink-0"
                title="Perbesar Gambar (Zoom In)"
              >
                <ZoomIn size={13} className="text-emerald-800" />
                <span>Perbesar</span>
              </button>
            </div>

            {/* Quick Zoom Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-bold text-slate-500 mr-1">
                Ukuran Cepat:
              </span>
              {[
                { label: "50% (Kecil)", zoom: 0.5 },
                { label: "75% (Perkecil)", zoom: 0.75 },
                { label: "100% (Normal)", zoom: 1 },
                { label: "125%", zoom: 1.25 },
                { label: "150%", zoom: 1.5 },
                { label: "200%", zoom: 2 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateCrop({ zoom: preset.zoom })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    Math.abs(crop.zoom - preset.zoom) <= 0.04
                      ? "bg-[#062017] text-white border-[#062017]"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal & Vertical Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">
                  Geser Kiri / Kanan (X)
                </span>
                <span className="font-mono font-bold text-slate-600">
                  {Math.round(crop.x)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={crop.x}
                onChange={(e) => updateCrop({ x: Number(e.target.value) })}
                className="w-full accent-[#062017] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">
                  Geser Atas / Bawah (Y)
                </span>
                <span className="font-mono font-bold text-slate-600">
                  {Math.round(crop.y)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={crop.y}
                onChange={(e) => updateCrop({ y: Number(e.target.value) })}
                className="w-full accent-[#062017] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Preset Alignment & Fit Mode Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 mr-1">
                Fokus Cepat:
              </span>
              {[
                { label: "Atas", x: 50, y: 15 },
                { label: "Tengah", x: 50, y: 50 },
                { label: "Bawah", x: 50, y: 85 },
                { label: "Kiri", x: 20, y: 50 },
                { label: "Kanan", x: 80, y: 50 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateCrop({ x: preset.x, y: preset.y })}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                    Math.abs(crop.x - preset.x) <= 5 &&
                    Math.abs(crop.y - preset.y) <= 5
                      ? "bg-[#062017] text-white border-[#062017]"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Cover vs Contain Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => updateCrop({ fit: "cover" })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                  crop.fit === "cover"
                    ? "bg-[#062017] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Gambar memenuhi seluruh bingkai kartu"
              >
                <Maximize2 size={11} />
                <span>Isi Penuh (Crop)</span>
              </button>
              <button
                type="button"
                onClick={() => updateCrop({ fit: "contain", zoom: 1 })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                  crop.fit === "contain"
                    ? "bg-[#062017] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Tampilkan seluruh gambar utuh tanpa terpotong"
              >
                <Minimize2 size={11} />
                <span>Utuh (Fit)</span>
              </button>
            </div>
          </div>

          {/* Bottom Studio Action Row: Permanent Canvas Crop vs Done */}
          <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleBakePermanentCrop}
              disabled={isBaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 border-b-2 border-b-slate-300 font-extrabold text-[11px] transition-all cursor-pointer"
              title="Potong piksel gambar secara permanen sesuai area bingkai saat ini"
            >
              <Scissors size={12} className="text-emerald-800" />
              <span>
                {isBaking ? "Memotong..." : "Potong Piksel Permanen"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsStudioOpen(false)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#062017] hover:bg-emerald-950 text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-xs"
            >
              <Check size={13} className="text-amber-300" />
              <span>Selesai Atur Gambar</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 4. URL INPUT FIELD ── */}
      <div>
        <label className="block font-extrabold text-slate-700 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <Link2
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={isDataUrl ? "📁 [File Gambar Unggahan Perangkat Tersimpan]" : src}
            readOnly={isDataUrl}
            onChange={(e) => handleUrlInputChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-9 ${
              isDataUrl ? "pr-24 bg-emerald-50/50 text-emerald-950 font-bold" : "pr-3.5 bg-slate-50/50 text-slate-800 font-mono"
            } py-2.5 rounded-xl border border-slate-200/90 focus:bg-white text-[11px] focus:outline-none focus:border-emerald-800 focus:ring-3 focus:ring-emerald-900/10 transition-all`}
          />
          {isDataUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-[10px] font-bold transition-colors cursor-pointer"
            >
              Ganti Link
            </button>
          )}
        </div>

        {showGoogleDriveHint && (
          <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <Sparkles size={13} className="text-emerald-800 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">Multi-Sumber &amp; Crop:</strong>{" "}
              Bisa tempel link Google Drive publik, link web, atau klik{" "}
              <strong className="text-slate-800">Upload File (PC/HP)</strong> lalu geser gambar untuk mengatur crop!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

