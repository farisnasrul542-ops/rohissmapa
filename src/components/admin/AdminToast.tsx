"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminToast() {
  const { toast } = useAdmin();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: <CheckCircle2 size={17} className="text-[#006d44] shrink-0" />,
          classes: "bg-[#d7f0e3] text-[#006d44] border border-[#006d44]/25 shadow-lg",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={17} className="text-amber-600 shrink-0" />,
          classes: "bg-amber-50 text-amber-900 border border-amber-200 shadow-lg",
        };
      case "info":
      default:
        return {
          icon: <Info size={17} className="text-slate-600 shrink-0" />,
          classes: "bg-white text-slate-800 border border-slate-200 shadow-xl",
        };
    }
  };

  const { icon, classes } = getStyle();

  return (
    <div role="status" aria-live="polite" className="admin-toast fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl ${classes} max-w-md pointer-events-auto`}
      >
        {icon}
        <span className="text-xs font-semibold leading-snug">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
