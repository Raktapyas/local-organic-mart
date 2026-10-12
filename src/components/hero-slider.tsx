"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/data";

/** Milliseconds a slide holds before the next one takes over. */
const ADVANCE_MS = 6500;
/** Ken-burns travel. Slow enough to read as motion, not a zoom gimmick. */
const KEN_BURNS_S = 7.5;
const STAGGER_S = 0.07;

/** Splits a headline around the highlight word so it can be styled alone. */
function headlineParts(headline: string, highlight: string) {
  const at = headline.toLowerCase().indexOf(highlight.toLowerCase());
  if (at === -1) return { before: headline, word: null, after: "" };
  return {
    before: headline.slice(0, at),
    word: headline.slice(at, at + highlight.length),
    after: headline.slice(at + highlight.length),
  };
}

/**
 * Cinematic home hero.
 *
 * Slide one is a looping background video; the rest are stills with a slow
 * ken-burns. Crossfades and staggered text runs through framer-motion, with
 * every animation disabled when the visitor prefers reduced motion — that
 * case also pins the slider to slide one and drops autoplay entirely.
 *
 * The first slide is rendered into the prerendered shell, so the hero is
 * never blank without JavaScript; the video only mounts on the client, and
 * only while slide one is showing.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const count = slides.length;
  // Reduced motion pins the slider to the opening slide.
  const active = reduceMotion ? 0 : Math.min(index, count - 1);
  const slide = slides[active];

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Autoplay. Skipped on reduced motion, and suspended while hovered.
  useEffect(() => {
    if (reduceMotion || paused || count < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, count]);

  /*
    Pause whenever the element is not the one on screen. Autoplay keeps its
    own timer running when the slide is off-screen otherwise, and three
    loops decoding at once is exactly the thing that makes a phone hot.
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }
    if (active === index) void video.play().catch(() => {});
    else video.pause();
  }, [active, index, reduceMotion, slide.video]);

  const { before, word, after } = headlineParts(slide.headline, slide.highlight);

  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const delta = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(delta) < 48) return;
        go(delta < 0 ? active + 1 : active - 1);
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      {/* Backgrounds */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={
              reduceMotion || slide.kind === "video"
                ? { scale: 1 }
                : { scale: [1, 1.06] }
            }
            transition={
              reduceMotion || slide.kind === "video"
                ? undefined
                : { duration: KEN_BURNS_S, ease: "linear" }
            }
          >
            {/*
              The `<video>` element itself renders server-side — it is not
              gated behind a client-only mount check. A video with a `poster`
              and no decoded frame displays that poster natively, so the
              prerendered shell is never blank, and gating on mount would mean
              shipping an `<img>` slide background in the server HTML for
              every visitor until hydration finished. Posters are loading
              placeholders, not slides.

              Slide one is the landing view so it preloads eagerly; the rest
              sit at preload="none" and are fetched only when reached.
            */}
            {slide.video ? (
              <video
                ref={videoRef}
                className="absolute inset-0 size-full object-cover"
                src={slide.video}
                poster={slide.image}
                autoPlay={!reduceMotion}
                muted
                loop
                playsInline
                preload={active === 0 ? "auto" : "none"}
                aria-hidden
                tabIndex={-1}
              />
            ) : (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={active === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Scrims — dark DNA, unchanged from the static hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

      {/* Slide copy */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.headline}
          className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-start justify-center gap-4 px-6 py-24 sm:gap-6 sm:py-28"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit={reduceMotion ? undefined : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: STAGGER_S } },
          }}
          aria-live="polite"
        >
          <motion.span
            className="text-xs tracking-widest text-sage uppercase"
            variants={rise}
          >
            {slide.kicker}
          </motion.span>

          <motion.h1
            className="max-w-4xl text-[2.75rem] leading-[0.95] tracking-tight text-balance sm:text-6xl sm:leading-[1.02] md:text-7xl"
            variants={rise}
          >
            {before}
            {word ? (
              <>
                {/*
                  One accent word per slide. The shadow is not decoration: the
                  video behind is unpredictable, and a soft black cast keeps
                  mint legible over a bright flame as well as a dark field.
                */}
                <span className="font-heading text-mint italic [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
                  {word}
                </span>
                {after}
              </>
            ) : null}
          </motion.h1>

          <motion.p
            className="max-w-lg text-base leading-relaxed text-sage"
            variants={rise}
          >
            {slide.line}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            variants={rise}
          >
            <Button
              asChild
              className={
                slide.cta.variant === "ghost"
                  ? "group h-12 rounded-full border-foreground/25 px-8 backdrop-blur-sm hover:border-mint/50"
                  : "group h-12 rounded-full px-8"
              }
              variant={slide.cta.variant === "ghost" ? "outline" : "default"}
            >
              <Link href={slide.cta.href}>
                {slide.cta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </Button>

            {/* Second route out, only when the slide defines one. */}
            {slide.cta2 ? (
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-foreground/25 px-8 backdrop-blur-sm hover:border-mint/50"
              >
                <Link href={slide.cta2.href}>{slide.cta2.label}</Link>
              </Button>
            ) : null}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls — hidden when reduced motion pins the slider */}
      {!reduceMotion && count > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-7xl items-center justify-end gap-4 px-6">
          <div className="flex items-center gap-2">
            {slides.map((item, dot) => (
              <button
                key={item.headline}
                type="button"
                onClick={() => go(dot)}
                aria-label={`Show slide ${dot + 1} of ${count}: ${item.kicker}`}
                aria-current={dot === active}
                className={
                  dot === active
                    ? "size-2 rounded-full bg-mint transition-all duration-300"
                    : "size-2 rounded-full bg-foreground/30 transition-all duration-300 hover:bg-foreground/60"
                }
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Shared enter/exit: content always travels upward, in and out. */
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeIn" } },
};
