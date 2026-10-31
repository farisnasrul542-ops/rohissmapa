"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminToast() {
  const { toast } = useAdmin();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-400 shrink-0" />;
      case "info":
      default:
        return <Info size={18} className="text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-emerald-500/40 bg-[#062017]";
      case "warning":
        return "border-amber-500/40 bg-[#1c1404]";
      case "info":
      default:
        return "border-blue-500/40 bg-[#061824]";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-2xl border ${getBorderColor()} backdrop-blur-md max-w-md`}
      >
        {getIcon()}
        <span className="text-xs font-semibold tracking-wide leading-snug">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
