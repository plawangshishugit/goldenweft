"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Previously this logic lived in a raw <script dangerouslySetInnerHTML>
// in layout.tsx. That had two separate problems:
//
// 1. It ran as soon as the browser parsed it — which can be before, or
//    concurrently with, React hydrating the page. IntersectionObserver
//    fires its callback immediately for anything already in the
//    viewport, so classList.add('visible') could mutate a `.reveal`
//    element's className in the real DOM before React finished
//    hydrating it — causing a "server/client attributes didn't match"
//    hydration error (seen on CoreSeasons, but it could hit any
//    above-the-fold .reveal element).
//
// 2. It only ever queried `.reveal` elements once, on initial
//    DOMContentLoaded. Since layout.tsx persists across client-side
//    navigations (Next.js App Router doesn't remount it), any page
//    reached via a Link click rather than a hard refresh would render
//    new `.reveal` elements that were never observed — they'd sit at
//    opacity:0 forever.
//
// useEffect only ever runs after hydration is complete, which fixes
// (1). Re-running it on every pathname change fixes (2).
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.06 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
