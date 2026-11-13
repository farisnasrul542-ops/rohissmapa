"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

const scrollLocks = new Set<symbol>();
let originalOverflow = "";

/** Keep keyboard focus and native scrolling inside an open admin dialog. */
export function useAdminOverlay(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const dismiss = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollLock = Symbol("admin-overlay");
    if (scrollLocks.size === 0) originalOverflow = document.body.style.overflow;
    scrollLocks.add(scrollLock);
    document.body.style.overflow = "hidden";
    const selector = 'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';
    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(selector))
      .filter((element) => element.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => (getFocusable()[0] || container).focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
      if (event.key !== "Tab") return;
      const elements = getFocusable();
      if (!elements.length) { event.preventDefault(); container.focus(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      scrollLocks.delete(scrollLock);
      if (scrollLocks.size === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, containerRef]);
}
