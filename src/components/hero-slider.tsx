"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/data";
import { contentNe } from "@/lib/i18n/content-ne";
import { useLang } from "@/lib/use-lang";

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
  const { lang, tr } = useLang();

  const count = slides.length;
  // Reduced motion pins the slider to the opening slide.
  const active = reduceMotion ? 0 : Math.min(index, count - 1);
  const slide = slides[active];

  /*
    Hero copy is editorial, not catalogue data, so the Nepali version lives in
    `content-ne.ts` rather than on the slide itself. The accent word is
    highlighted in whichever language is showing, which is why the split runs
    over the resolved strings rather than the raw ones.
  */
  const copy =
    lang === "ne" ? contentNe.heroSlides[active] : undefined;
  const kicker = copy ? copy.kicker : slide.kicker;
  const headline = copy ? copy.headline : slide.headline;
  const highlight = copy ? copy.highlight : slide.highlight;
  const line = copy ? copy.line : slide.line;

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

  const { before, word, after } = headlineParts(headline, highlight);

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
      aria-label={tr("Featured highlights", "विशेष झलक")}
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
                alt={copy ? copy.alt : slide.alt}
                fill
                priority={active === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Scrims: ink first, so the photography reads as a plate, not a wallpaper. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/45 to-transparent" />

      {/* Hairline inset frame — the editorial "plate" edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 hidden border border-ivory/[0.09] lg:block"
      />

      {/* Slide copy */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={headline}
          className="relative mx-auto flex h-full w-full max-w-[88rem] flex-col justify-end px-6 pt-28 pb-24 sm:pb-24 lg:px-10 lg:pb-28"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit={reduceMotion ? undefined : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: STAGGER_S } },
          }}
          aria-live="polite"
        >
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-5 lg:col-span-8 lg:min-w-0">
              <motion.span
                className="flex items-center gap-3 text-[10px] tracking-[0.32em] text-gold uppercase"
                variants={rise}
              >
                <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                {kicker}
              </motion.span>

              <motion.h1
                className="max-w-5xl text-[clamp(1.95rem,7.1vw,5.5rem)] leading-[1.02] font-light tracking-[-0.025em] text-ivory text-balance"
                variants={rise}
              >
                {before}
                {word ? (
                  <>
                    {/*
                      One accent word per slide, solid gold. A gradient or glow
                      behind it reads as decoration; the metal itself is the
                      accent and needs nothing else.
                    */}
                    <span className="font-heading font-medium text-gold">{word}</span>
                    {after}
                  </>
                ) : null}
              </motion.h1>

              <motion.p
                className="max-w-md text-[0.9rem] leading-relaxed text-bone/70"
                variants={rise}
              >
                {line}
              </motion.p>

              <motion.div
                className="mt-2 flex flex-wrap items-center gap-3"
                variants={rise}
              >
                <Button
                  asChild
                  className="h-11 rounded-none px-7 text-[10.5px] tracking-[0.2em] uppercase"
                  variant={slide.cta.variant === "ghost" ? "outline" : "default"}
                >
                  <Link href={slide.cta.href}>
                    {copy ? copy.cta : slide.cta.label}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </Button>

                {/* Second route out, only when the slide defines one. */}
                {slide.cta2 ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-none border-ivory/20 px-7 text-[10.5px] tracking-[0.2em] uppercase hover:border-gold/60 hover:text-gold"
                  >
                    <Link href={slide.cta2.href}>{copy ? copy.cta2 : slide.cta2.label}</Link>
                  </Button>
                ) : null}
              </motion.div>
            </div>

            {/* Right rail: issue number, provenance. Quiet, not decorative. */}
            <motion.div
              variants={rise}
              className="hidden flex-col items-end gap-4 pb-6 lg:col-span-4 lg:flex"
            >
              <span className="tabular text-[11px] tracking-[0.3em] text-bone/55">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-px w-24 bg-gold/40" />
              <p className="max-w-[15rem] text-right text-[10.5px] leading-relaxed tracking-[0.12em] text-bone/45 uppercase">
                {tr(
                  "Harvested in the valley and the high hills, dispatched the same morning.",
                  "उपत्यका र उच्च पहाडमा टिपिएको, त्यही बिहान पठाइएको।",
                )}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls — hidden when reduced motion pins the slider */}
      {!reduceMotion && count > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-[88rem] items-center justify-between px-6 lg:px-10">
          {/* Numbered index instead of dots: reads as a catalogue, not a carousel. */}
          <div className="flex items-center gap-4">
            {slides.map((item, dot) => (
              <button
                key={item.headline}
                type="button"
                onClick={() => go(dot)}
                aria-label={
                  lang === "ne"
                    ? `${contentNe.heroSlides[dot]?.kicker ?? item.kicker} — स्लाइड ${dot + 1} / ${count}`
                    : `Show slide ${dot + 1} of ${count}: ${item.kicker}`
                }
                aria-current={dot === active}
                className={`tabular py-2 text-[10px] tracking-[0.24em] transition-colors duration-200 ${
                  dot === active
                    ? "text-gold"
                    : "text-bone/45 hover:text-bone/80"
                }`}
              >
                {String(dot + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* Arrows are a pointer affordance. On touch the numbered index is
              enough — and the floating contact widget sits in this corner, so
              the pair steps inward on lg to stay clear of it. */}
          <div className="hidden items-center gap-4 lg:mr-16 lg:flex">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label={tr("Previous slide", "अघिल्लो स्लाइड")}
              className="inline-flex size-9 items-center justify-center border border-ivory/15 text-bone/60 transition-colors duration-200 hover:border-gold/50 hover:text-gold"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label={tr("Next slide", "अर्को स्लाइड")}
              className="inline-flex size-9 items-center justify-center border border-ivory/15 text-bone/60 transition-colors duration-200 hover:border-gold/50 hover:text-gold"
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
