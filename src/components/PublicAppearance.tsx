"use client";

import { usePathname } from "next/navigation";

/** Scope the sculpted public surfaces away from login and the admin workspace. */
export default function PublicAppearance({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname === "/login" || pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }
  return <div className="public-clay3d">{children}</div>;
}
