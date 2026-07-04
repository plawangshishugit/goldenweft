"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export default function ProductGallery({
  images,
  productName,
  fabric,
  tier,
  isNew,
}: {
  images: string[];
  productName: string;
  fabric: string;
  tier?: string;
  isNew?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Hover-magnify state (desktop "quick zoom" on the main image)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const mainImgWrapRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;
  const active = hasImages ? images[index] : null;

  function goTo(i: number) {
    if (!hasImages) return;
    setIndex(((i % images.length) + images.length) % images.length);
  }

  function handleMainMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = mainImgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({ x, y });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        ref={mainImgWrapRef}
        className="aspect-[3/4] relative overflow-hidden cursor-zoom-in group" style={{ background: "var(--paper-soft)" }}
        onMouseMove={handleMainMouseMove}
        onMouseLeave={() => setHoverPos(null)}
        onClick={() => hasImages && setLightboxOpen(true)}
      >
        {active ? (
          <>
            <Image
              src={active}
              alt={`${productName} — view ${index + 1}`}
              fill
              className="object-cover transition-opacity duration-200"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Hover-magnify lens (desktop only) */}
            {hoverPos && (
              <div
                className="hidden md:block absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  backgroundImage: `url(${active})`,
                  backgroundSize: "230%",
                  backgroundPosition: `${hoverPos.x}% ${hoverPos.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/70 text-white text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
              Click to zoom
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="w-24 h-24 mx-auto opacity-10"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 4px, var(--color-taupe) 4px, var(--color-taupe) 5px),
                    repeating-linear-gradient(90deg, transparent, transparent 4px, var(--color-taupe) 4px, var(--color-taupe) 5px)
                  `,
                }}
              />
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--ink-muted)] mt-4">
                {fabric} Silk
              </p>
            </div>
          </div>
        )}

        {/* Badges */}
        {tier && (
          <div className="absolute top-4 left-4">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1.5 bg-[var(--color-charcoal)] text-[var(--color-gold)]">
              {tier}
            </span>
          </div>
        )}
        {isNew && (
          <div className="absolute top-4 right-4">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1.5 btn-gold">
              New
            </span>
          </div>
        )}

        {/* Prev/next arrows when multiple images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(index - 1); }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[var(--color-charcoal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(index + 1); }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[var(--color-charcoal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — scrollable when there are many images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`flex-shrink-0 w-20 h-20 relative border overflow-hidden transition-colors duration-200 ${
                i === index ? "border-[var(--color-gold)]" : "border-[var(--color-border)] hover:border-[var(--color-border-mid)]"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && hasImages && (
        <Lightbox
          images={images}
          index={index}
          productName={productName}
          onIndexChange={goTo}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

/* ───────────────────────── Lightbox ───────────────────────── */

function Lightbox({
  images,
  index,
  productName,
  onIndexChange,
  onClose,
}: {
  images: string[];
  index: number;
  productName: string;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Reset zoom/pan whenever the active image changes
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [index]);

  // Keyboard: escape to close, arrows to navigate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange(index - 1);
      if (e.key === "ArrowRight") onIndexChange(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndexChange]);

  function clampScale(s: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const next = clampScale(scale - e.deltaY * 0.0025);
    setScale(next);
    if (next === 1) setTranslate({ x: 0, y: 0 });
  }

  function handleDoubleClick() {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }

  function distanceBetween(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: distanceBetween(e.touches), scale };
    } else if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0];
      dragRef.current = { x: t.clientX, y: t.clientY, tx: translate.x, ty: translate.y };
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const newDist = distanceBetween(e.touches);
      const ratio = newDist / pinchRef.current.dist;
      setScale(clampScale(pinchRef.current.scale * ratio));
    } else if (e.touches.length === 1 && dragRef.current) {
      e.preventDefault();
      const t = e.touches[0];
      setTranslate({
        x: dragRef.current.tx + (t.clientX - dragRef.current.x),
        y: dragRef.current.ty + (t.clientY - dragRef.current.y),
      });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) dragRef.current = null;
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (scale <= 1) return;
    dragRef.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    setTranslate({
      x: dragRef.current.tx + (e.clientX - dragRef.current.x),
      y: dragRef.current.ty + (e.clientY - dragRef.current.y),
    });
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/92 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} image viewer`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-[0.7rem] tracking-[0.15em] uppercase opacity-70">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative flex-1 overflow-hidden flex items-center justify-center select-none"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
      >
        <div
          className="relative w-[90vw] h-[80vh] max-w-4xl"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: dragRef.current ? "none" : "transform 150ms ease-out",
            touchAction: "none",
          }}
        >
          <Image
            src={images[index]}
            alt={`${productName} — view ${index + 1}`}
            fill
            className="object-contain pointer-events-none"
            sizes="90vw"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onIndexChange(index - 1); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onIndexChange(index + 1); }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* Scrollable thumbnail strip inside the lightbox */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto px-5 py-4 justify-center">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`View image ${i + 1}`}
              className={`flex-shrink-0 w-16 h-16 relative border-2 overflow-hidden transition-colors duration-200 ${
                i === index ? "border-[var(--color-gold)]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-white/40 text-[0.65rem] tracking-[0.1em] uppercase pb-4">
        Scroll or pinch to zoom · Drag to pan · Esc to close
      </p>
    </div>
  );
}
