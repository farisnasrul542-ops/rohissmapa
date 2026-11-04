"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AspirasiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf7]">
      <p className="text-sm font-semibold text-gray-500">Mengarahkan ke beranda...</p>
    </div>
  );
}
