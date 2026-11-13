"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "@/lib/constants";

const subscribe = () => () => {};
const getServerSnapshot = () => SITE.publicUrl.replace(/\/$/, "");
const getSnapshot = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  ? window.location.origin
  : getServerSnapshot();

/** Local previews stay on the local public site; hosted admin keeps its public URL. */
export function usePublicSiteUrl() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
