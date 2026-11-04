"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAspirasiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-sm font-semibold text-slate-500">Mengarahkan ke dashboard admin...</p>
    </div>
  );
}
