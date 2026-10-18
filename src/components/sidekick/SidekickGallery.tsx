"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { SidekickMediaItem } from "@/data/sidekick";
import { pushDataLayer } from "@/components/sidekick/analytics";

interface SidekickGalleryProps {
  images: SidekickMediaItem[];
}

export default function SidekickGallery({ images }: SidekickGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const hadOpenLightbox = useRef(false);
  const activeImage = images[activeIndex];

  const selectImage = useCallback((index: number, source: string) => {
    const wrappedIndex = (index + images.length) % images.length;
    setActiveIndex(wrappedIndex);
    pushDataLayer("sidekick_gallery_view", {
      gallery_item: images[wrappedIndex].label,
      gallery_source: source,
    });
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        selectImage(activeIndex - 1, "lightbox_keyboard");
      }
      if (event.key === "ArrowRight") {
        selectImage(activeIndex + 1, "lightbox_keyboard");
      }
      if (event.key === "Tab") {
        const focusable = [
          closeButtonRef.current,
          previousButtonRef.current,
          nextButtonRef.current,
        ].filter((element): element is HTMLButtonElement => Boolean(element));
        const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);

        if (event.shiftKey && currentIndex <= 0) {
          event.preventDefault();
          focusable[focusable.length - 1]?.focus();
        } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeIndex, lightboxOpen, selectImage]);

  useEffect(() => {
    if (lightboxOpen) {
      hadOpenLightbox.current = true;
    } else if (hadOpenLightbox.current) {
      openButtonRef.current?.focus({ preventScroll: true });
      hadOpenLightbox.current = false;
    }
  }, [lightboxOpen]);

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;
    selectImage(activeIndex + (distance < 0 ? 1 : -1), "swipe");
  };

  return (
    <div>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <button
          ref={openButtonRef}
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-admiral-navy/90 text-white shadow-lg transition hover:bg-admiral-navy focus:outline-none focus:ring-2 focus:ring-admiral-gold"
          aria-label={`Enlarge ${activeImage.label} image`}
        >
          <Expand className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 right-3 rounded-full bg-admiral-navy/90 px-3 py-1 text-xs font-bold text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      <div className="mt-3 flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-2" aria-label="SideKick product gallery thumbnails">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => selectImage(index, "thumbnail")}
            className={`relative h-16 w-20 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-admiral-gold sm:h-20 sm:w-24 ${
              activeIndex === index
                ? "border-admiral-gold"
                : "border-white/20 hover:border-white/55"
            }`}
            aria-label={`Show ${image.label}`}
            aria-pressed={activeIndex === index}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              loading="eager"
            />
            <span className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-1 text-[0.65rem] font-bold text-white">
              {image.label}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-1 min-h-5 text-xs leading-5 text-white/65">{activeImage.caption}</p>
      <p className="mt-1 text-[0.68rem] text-white/45 sm:hidden">Swipe the main image to browse.</p>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="SideKick image preview"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-admiral-navy shadow-lg focus:outline-none focus:ring-2 focus:ring-admiral-gold"
            aria-label="Close image preview"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            ref={previousButtonRef}
            type="button"
            onClick={() => selectImage(activeIndex - 1, "lightbox")}
            className="absolute left-3 z-10 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-white text-admiral-navy shadow-lg focus:outline-none focus:ring-2 focus:ring-admiral-gold sm:left-6"
            aria-label="Show previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div className="relative h-[82vh] w-full max-w-6xl">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            ref={nextButtonRef}
            type="button"
            onClick={() => selectImage(activeIndex + 1, "lightbox")}
            className="absolute right-3 z-10 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-white text-admiral-navy shadow-lg focus:outline-none focus:ring-2 focus:ring-admiral-gold sm:right-6"
            aria-label="Show next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <p className="absolute inset-x-16 bottom-4 text-center text-sm font-semibold text-white">
            {activeImage.caption}
          </p>
        </div>
      )}
    </div>
  );
}
