"use client";

import React, { useState } from "react";
import { AdminProvider } from "@/context/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminToast from "@/components/admin/AdminToast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f6f8f6] text-gray-900 font-sans antialiased flex flex-col">
        {/* Isolated Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area (offset by sidebar width on desktop) */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <AdminTopbar
            onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Admin Dedicated Mini Footer */}
          <footer className="py-4 px-6 border-t border-emerald-950/5 text-center text-[11px] text-gray-400">
            <span>
              ROHIS SMA Negeri 4 Purwokerto • Sistem Informasi Manajemen Pengurus BPH © 2026
            </span>
          </footer>
        </div>

        {/* Toast notifications */}
        <AdminToast />
      </div>
    </AdminProvider>
  );
}
