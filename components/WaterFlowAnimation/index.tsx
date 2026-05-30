"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WaterFlowAnimation.module.css";

// Brand font stacks matching layout.tsx CSS variables
const FONT_SERIF = "var(--font-serif), 'Fraunces', Georgia, serif";
const FONT_SANS = "var(--font-geist-sans), 'Geist', system-ui, sans-serif";
const FONT_MONO = "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace";

// Brand colors
const RICE_BLUE = "#001A4E";
const HYDRO_CYAN = "#38BDF8";
const HYDRO_LIGHT = "#7DD3FC";
const SIGNAL_GOLD = "#C9A84C";
const ALERT_ORANGE = "#F97316";
const STATUS_GREEN = "#4ADE80";
const FOG_50 = "#F8FAFC";
const FOG_200 = "#CBD5E1";
const FOG_300 = "#9AA8BF";
const FOG_400 = "#475569";
const SURFACE_DEEP = "#0A2156";
const SURFACE_MID = "#1E3A5F";

interface WaterFlowAnimationProps {
  showTitle?: boolean;
  showCaptions?: boolean;
  className?: string;
}

export default function WaterFlowAnimation({
  showTitle = false,
  showCaptions = true,
  className,
}: WaterFlowAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "how_it_works_view", {
        section: "water_flow_animation",
      });
    }
  }, [visible]);

  const captionY = showCaptions ? 900 : 720;
  const viewBoxHeight = showCaptions ? 900 : 720;
  const titleOffset = showTitle ? 0 : -200;

  return (
    <div ref={ref} className={className}>
      {!visible ? (
        <div
          style={{
            aspectRatio: `1600 / ${viewBoxHeight}`,
            background: RICE_BLUE,
            borderRadius: 16,
          }}
        />
      ) : (
        <svg
          viewBox={`0 0 1600 ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
          role="img"
          aria-label="Animation showing how a HydroSense smart water shutoff detects a leak and closes the valve in under nine seconds"
        >
          {/* ===== DEFS: gradients, filters, patterns for premium look ===== */}
          <defs>
            {/* Background gradient — subtle radial depth */}
            <radialGradient id="bg-glow" cx="35%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#002B6B" />
              <stop offset="100%" stopColor={RICE_BLUE} />
            </radialGradient>

            {/* Water glow filter */}
            <filter id="water-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stronger glow for LED */}
            <filter id="led-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Leak glow — dramatic */}
            <filter id="leak-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Puddle reflection gradient */}
            <radialGradient id="puddle-grad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor={HYDRO_LIGHT} stopOpacity="0.7" />
              <stop offset="100%" stopColor={HYDRO_CYAN} stopOpacity="0.3" />
            </radialGradient>

            {/* Device body gradient — frosted glass */}
            <linearGradient id="device-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D2B66" />
              <stop offset="50%" stopColor={SURFACE_DEEP} />
              <stop offset="100%" stopColor="#071A42" />
            </linearGradient>

            {/* Fixture body gradient */}
            <linearGradient id="fixture-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D2B66" />
              <stop offset="100%" stopColor={SURFACE_DEEP} />
            </linearGradient>

            {/* Pipe outer gradient for 3D depth */}
            <linearGradient id="pipe-outer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#253F6B" />
              <stop offset="50%" stopColor={SURFACE_MID} />
              <stop offset="100%" stopColor="#152A4A" />
            </linearGradient>

            {/* House fill — very subtle */}
            <linearGradient id="house-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={RICE_BLUE} stopOpacity="0" />
              <stop offset="100%" stopColor="#000E2A" stopOpacity="0.4" />
            </linearGradient>

            {/* Ground line gradient */}
            <linearGradient id="ground-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={SURFACE_MID} stopOpacity="0" />
              <stop offset="10%" stopColor={SURFACE_MID} />
              <stop offset="90%" stopColor={SURFACE_MID} />
              <stop offset="100%" stopColor={SURFACE_MID} stopOpacity="0" />
            </linearGradient>

            {/* Caption bar background */}
            <linearGradient id="caption-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000E2A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000E2A" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background with radial glow */}
          <rect width="1600" height={viewBoxHeight} fill="url(#bg-glow)" />

          {/* Subtle grid pattern for depth */}
          <g opacity="0.03">
            {Array.from({ length: 20 }, (_, i) => (
              <line key={`vg${i}`} x1={i * 80 + 40} y1="0" x2={i * 80 + 40} y2={viewBoxHeight} stroke="#FFF" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`hg${i}`} x1="0" y1={i * 80 + 40} x2="1600" y2={i * 80 + 40} stroke="#FFF" strokeWidth="0.5" />
            ))}
          </g>

          {/* Ambient drift */}
          <g opacity="0.4">
            <circle cx="220" cy="800" r="1.5" className={styles.ambientParticle} />
            <circle cx="480" cy="820" r="1.2" className={`${styles.ambientParticle} ${styles.ambientP2}`} />
            <circle cx="760" cy="810" r="1.5" className={`${styles.ambientParticle} ${styles.ambientP3}`} />
            <circle cx="1020" cy="800" r="1.3" className={`${styles.ambientParticle} ${styles.ambientP4}`} />
            <circle cx="1320" cy="810" r="1.6" className={`${styles.ambientParticle} ${styles.ambientP5}`} />
            <circle cx="380" cy="820" r="1.1" className={`${styles.ambientParticle} ${styles.ambientP3}`} />
            <circle cx="900" cy="800" r="1.4" className={`${styles.ambientParticle} ${styles.ambientP5}`} />
            <circle cx="1180" cy="810" r="1.2" className={`${styles.ambientParticle} ${styles.ambientP2}`} />
          </g>

          {/* Title (conditional) */}
          {showTitle && (
            <g>
              <text x="800" y="78" fontFamily={FONT_MONO} fontSize="13" letterSpacing="3" fill={SIGNAL_GOLD} textAnchor="middle">HYDROSENSE TEXAS</text>
              <text x="800" y="128" fontFamily={FONT_SERIF} fontSize="36" fill={FOG_50} textAnchor="middle">How a smart shutoff saves your home</text>
              <text x="800" y="162" fontFamily={FONT_SANS} fontSize="15" fill={FOG_300} textAnchor="middle">From normal flow to disaster averted, in under nine seconds</text>
              <line x1="720" y1="184" x2="880" y2="184" stroke={SIGNAL_GOLD} strokeWidth="0.5" opacity="0.6" />
            </g>
          )}

          {/* ========== SCENE ========== */}
          <g className={styles.scene} transform={showTitle ? undefined : `translate(0, ${titleOffset})`}>

            {/* Ground line with gradient fade */}
            <line x1="60" y1="640" x2="1540" y2="640" stroke="url(#ground-line)" strokeWidth="1" />
            <text x="80" y="660" fontFamily={FONT_MONO} fontSize="10" letterSpacing="2" fill={FOG_400} className={styles.smallLabel}>GROUND</text>

            {/* ===== CITY MAIN ===== */}
            <text x="160" y="290" fontFamily={FONT_MONO} fontSize="11" letterSpacing="2.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>CITY MAIN</text>
            <line x1="60" y1="350" x2="340" y2="350" stroke="url(#pipe-outer)" strokeWidth="22" strokeLinecap="round" />
            <line x1="60" y1="350" x2="340" y2="350" stroke={HYDRO_CYAN} strokeWidth="14" strokeLinecap="round" className={styles.fillInlet} filter="url(#water-glow)" />

            {/* ===== SMART SHUTOFF DEVICE ===== */}
            <g transform="translate(340, 290)">
              {/* Outer glow ring */}
              <rect x="-4" y="-4" width="128" height="128" rx="18" fill="none" stroke={HYDRO_CYAN} strokeWidth="0.5" opacity="0.2" />
              {/* Device body with gradient */}
              <rect x="0" y="0" width="120" height="120" rx="14" fill="url(#device-body)" stroke={HYDRO_CYAN} strokeWidth="1.2" />
              {/* Inner highlight line */}
              <line x1="10" y1="6" x2="110" y2="6" stroke="#FFF" strokeWidth="0.5" opacity="0.06" />
              {/* Pipe connectors */}
              <rect x="-10" y="48" width="20" height="24" rx="2" fill={SURFACE_MID} stroke="#253F6B" strokeWidth="0.5" />
              <rect x="110" y="48" width="20" height="24" rx="2" fill={SURFACE_MID} stroke="#253F6B" strokeWidth="0.5" />

              {/* Detection rings */}
              <circle cx="60" cy="60" r="22" className={styles.detectionRing} />
              <circle cx="60" cy="60" r="22" className={`${styles.detectionRing} ${styles.ring2}`} />
              <circle cx="60" cy="60" r="22" className={`${styles.detectionRing} ${styles.ring3}`} />
              <circle cx="60" cy="60" r="22" className={styles.alertRing} />

              {/* LED with glow */}
              <circle cx="60" cy="60" r="18" className={styles.statusLedAnim} fill={STATUS_GREEN} filter="url(#led-glow)" />

              {/* Valve X */}
              <g transform="translate(60, 60)">
                <line x1="-22" y1="-22" x2="22" y2="22" className={styles.valveX} stroke={ALERT_ORANGE} strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>

              <text x="60" y="106" fontFamily={FONT_MONO} fontSize="8" letterSpacing="1.5" fill={HYDRO_CYAN} textAnchor="middle" className={styles.smallLabel}>SHUTOFF</text>
            </g>
            <text x="400" y="270" fontFamily={FONT_MONO} fontSize="11" letterSpacing="2.5" fill={SIGNAL_GOLD} textAnchor="middle" className={styles.smallLabel}>SMART SHUTOFF</text>

            {/* House entry pipe */}
            <line x1="470" y1="350" x2="540" y2="350" stroke="url(#pipe-outer)" strokeWidth="20" strokeLinecap="round" />
            <line x1="470" y1="350" x2="540" y2="350" stroke={HYDRO_CYAN} strokeWidth="12" strokeLinecap="round" className={styles.fillHouseEntry} filter="url(#water-glow)" />

            {/* ===== HOUSE ===== */}
            <text x="1010" y="270" fontFamily={FONT_MONO} fontSize="11" letterSpacing="2.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>YOUR HOME</text>
            {/* House fill for depth */}
            <path d="M 540 350 L 540 640 L 1480 640 L 1480 350 L 1010 220 Z" fill="url(#house-fill)" />
            <path d="M 540 350 L 540 640 L 1480 640 L 1480 350 L 1010 220 Z" fill="none" stroke={FOG_400} strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
            {/* Floor divider */}
            <line x1="540" y1="500" x2="1480" y2="500" stroke={SURFACE_MID} strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />

            {/* Main pipe */}
            <line x1="540" y1="350" x2="1380" y2="350" stroke="url(#pipe-outer)" strokeWidth="14" strokeLinecap="round" />
            <line x1="540" y1="350" x2="1380" y2="350" stroke={HYDRO_CYAN} strokeWidth="9" strokeLinecap="round" className={styles.fillMain} filter="url(#water-glow)" />

            {/* ===== Branch 1: KITCHEN ===== */}
            <line x1="720" y1="350" x2="720" y2="560" stroke="url(#pipe-outer)" strokeWidth="10" strokeLinecap="round" />
            <line x1="720" y1="350" x2="720" y2="560" stroke={HYDRO_CYAN} strokeWidth="7" strokeLinecap="round" className={styles.fillBranch1} />
            <g transform="translate(680, 560)">
              <rect x="0" y="0" width="80" height="44" rx="6" fill="url(#fixture-body)" stroke={FOG_400} strokeWidth="0.8" />
              <ellipse cx="40" cy="22" rx="26" ry="10" fill={HYDRO_CYAN} opacity="0.6" className={styles.fixtureWaterSink} filter="url(#water-glow)" />
              <ellipse cx="40" cy="22" rx="26" ry="10" fill="none" stroke={FOG_400} strokeWidth="0.5" />
              <text x="40" y="62" fontFamily={FONT_MONO} fontSize="9" letterSpacing="1.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>KITCHEN</text>
            </g>

            {/* ===== Branch 2: WATER HEATER (leak point) ===== */}
            <line x1="960" y1="350" x2="960" y2="480" stroke="url(#pipe-outer)" strokeWidth="10" strokeLinecap="round" />
            <line x1="960" y1="350" x2="960" y2="480" stroke={HYDRO_CYAN} strokeWidth="7" strokeLinecap="round" className={styles.fillBranch2} />
            <g transform="translate(925, 480)">
              <rect x="0" y="0" width="70" height="100" rx="8" fill="url(#fixture-body)" stroke={FOG_400} strokeWidth="0.8" />
              <rect x="3" y="3" width="64" height="94" rx="6" fill={HYDRO_CYAN} opacity="0.5" className={styles.heaterWater} filter="url(#water-glow)" />
              {/* Tank detail strokes */}
              <circle cx="35" cy="22" r="8" fill="none" stroke={FOG_400} strokeWidth="0.5" />
              <line x1="12" y1="48" x2="58" y2="48" stroke={FOG_400} strokeWidth="0.4" opacity="0.5" />
              <line x1="12" y1="64" x2="58" y2="64" stroke={FOG_400} strokeWidth="0.4" opacity="0.5" />
              <line x1="12" y1="80" x2="58" y2="80" stroke={FOG_400} strokeWidth="0.4" opacity="0.5" />
              {/* Crack */}
              <g className={styles.heaterCrack}>
                <path d="M 68 60 L 70 65 L 67 70 L 70 76 L 68 80" stroke={ALERT_ORANGE} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <text x="35" y="120" fontFamily={FONT_MONO} fontSize="9" letterSpacing="1.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>HEATER</text>
            </g>

            {/* Initial drips */}
            <circle cx="998" cy="555" r="3.5" fill={HYDRO_CYAN} className={styles.initialDrip} filter="url(#water-glow)" />
            <circle cx="1000" cy="565" r="3" fill={HYDRO_CYAN} className={`${styles.initialDrip} ${styles.initialDrip2}`} filter="url(#water-glow)" />
            <circle cx="999" cy="575" r="3.5" fill={HYDRO_CYAN} className={`${styles.initialDrip} ${styles.initialDrip3}`} filter="url(#water-glow)" />

            {/* BIG LEAK STREAMS with glow */}
            <g filter="url(#leak-glow)">
              <path d="M 998 545 Q 1015 580, 1030 640" stroke={HYDRO_CYAN} strokeWidth="6.5" fill="none" strokeLinecap="round" className={styles.leakStream} />
              <path d="M 998 555 Q 1025 595, 1055 640" stroke={HYDRO_CYAN} strokeWidth="6" fill="none" strokeLinecap="round" className={styles.leakStream} style={{ animationDelay: "-15.93s" }} />
              <path d="M 1000 565 Q 1010 600, 1015 640" stroke={HYDRO_CYAN} strokeWidth="5.5" fill="none" strokeLinecap="round" className={styles.leakStream} style={{ animationDelay: "-15.87s" }} />
              <path d="M 998 555 Q 1040 590, 1085 640" stroke={HYDRO_CYAN} strokeWidth="5" fill="none" strokeLinecap="round" className={styles.leakStream} style={{ animationDelay: "-15.81s" }} />
            </g>

            {/* Puddle with gradient reflection */}
            <ellipse cx="1050" cy="640" rx="80" ry="8" fill="url(#puddle-grad)" className={styles.puddle} />
            <ellipse cx="1050" cy="640" rx="50" ry="5" fill={HYDRO_LIGHT} opacity="0.5" className={styles.puddle} style={{ animationDelay: "-15.95s" }} />

            {/* Splash particles */}
            <g>
              <circle cx="1020" cy="638" r="2.5" className={`${styles.splashParticle} ${styles.splash1}`} />
              <circle cx="1075" cy="638" r="2.2" className={`${styles.splashParticle} ${styles.splash2}`} />
              <circle cx="1045" cy="638" r="2.8" className={`${styles.splashParticle} ${styles.splash3}`} />
              <circle cx="1060" cy="638" r="2" className={`${styles.splashParticle} ${styles.splash4}`} />
              <circle cx="1030" cy="638" r="2.6" className={`${styles.splashParticle} ${styles.splash5}`} />
              <circle cx="1080" cy="638" r="2.4" className={`${styles.splashParticle} ${styles.splash6}`} />
              <circle cx="1035" cy="638" r="2.1" className={`${styles.splashParticle} ${styles.splash7}`} />
              <circle cx="1068" cy="638" r="2.7" className={`${styles.splashParticle} ${styles.splash8}`} />
            </g>

            {/* ===== Branch 3: BATHROOM ===== */}
            <line x1="1180" y1="350" x2="1180" y2="560" stroke="url(#pipe-outer)" strokeWidth="10" strokeLinecap="round" />
            <line x1="1180" y1="350" x2="1180" y2="560" stroke={HYDRO_CYAN} strokeWidth="7" strokeLinecap="round" className={styles.fillBranch3} />
            <g transform="translate(1140, 560)">
              <rect x="0" y="0" width="80" height="44" rx="6" fill="url(#fixture-body)" stroke={FOG_400} strokeWidth="0.8" />
              <ellipse cx="40" cy="22" rx="26" ry="10" fill={HYDRO_CYAN} opacity="0.6" className={styles.fixtureWaterSink} filter="url(#water-glow)" />
              <ellipse cx="40" cy="22" rx="26" ry="10" fill="none" stroke={FOG_400} strokeWidth="0.5" />
              <text x="40" y="62" fontFamily={FONT_MONO} fontSize="9" letterSpacing="1.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>BATHROOM</text>
            </g>

            {/* ===== Branch 4: WASHER ===== */}
            <line x1="1360" y1="350" x2="1360" y2="540" stroke="url(#pipe-outer)" strokeWidth="10" strokeLinecap="round" />
            <line x1="1360" y1="350" x2="1360" y2="540" stroke={HYDRO_CYAN} strokeWidth="7" strokeLinecap="round" className={styles.fillBranch4} />
            <g transform="translate(1320, 540)">
              <rect x="0" y="0" width="80" height="80" rx="8" fill="url(#fixture-body)" stroke={FOG_400} strokeWidth="0.8" />
              <circle cx="40" cy="40" r="20" fill={HYDRO_CYAN} opacity="0.5" className={styles.washerWater} filter="url(#water-glow)" />
              <circle cx="40" cy="40" r="24" fill="none" stroke={FOG_400} strokeWidth="0.5" />
              <circle cx="40" cy="40" r="14" fill="none" stroke={FOG_400} strokeWidth="0.4" />
              <text x="40" y="98" fontFamily={FONT_MONO} fontSize="9" letterSpacing="1.5" fill={FOG_300} textAnchor="middle" className={styles.smallLabel}>WASHER</text>
            </g>
          </g>
          {/* ===== END SCENE ===== */}

          {/* ===== STATUS CALLOUTS — frosted bar ===== */}
          {showCaptions && (
            <g>
              {/* Frosted caption background */}
              <rect x="0" y="710" width="1600" height="120" fill="url(#caption-bg)" />
              <line x1="60" y1="720" x2="1540" y2="720" stroke="#FFF" strokeWidth="0.5" opacity="0.06" />

              <g className={styles.label1}>
                <circle cx="120" cy="770" r="6" fill={HYDRO_CYAN} filter="url(#led-glow)" />
                <text x="142" y="767" fontFamily={FONT_MONO} fontSize="13" letterSpacing="2.5" fill={HYDRO_CYAN}>WATER ON</text>
                <text x="142" y="789" fontFamily={FONT_SERIF} fontSize="16" fill={FOG_50}>Water flows in from the city main, filling pipes and fixtures.</text>
              </g>

              <g className={styles.label2}>
                <circle cx="120" cy="770" r="6" fill={STATUS_GREEN} filter="url(#led-glow)" />
                <text x="142" y="767" fontFamily={FONT_MONO} fontSize="13" letterSpacing="2.5" fill={STATUS_GREEN}>NORMAL OPERATION</text>
                <text x="142" y="789" fontFamily={FONT_SERIF} fontSize="16" fill={FOG_50}>Every fixture in the home is supplied. The device is watching.</text>
              </g>

              <g className={styles.label3}>
                <circle cx="120" cy="770" r="6" fill={ALERT_ORANGE} filter="url(#led-glow)" />
                <text x="142" y="767" fontFamily={FONT_MONO} fontSize="13" letterSpacing="2.5" fill={ALERT_ORANGE}>CATASTROPHIC LEAK</text>
                <text x="142" y="789" fontFamily={FONT_SERIF} fontSize="16" fill={FOG_50}>Water heater ruptures. Hundreds of gallons start flooding the floor.</text>
              </g>

              <g className={styles.label4}>
                <circle cx="120" cy="770" r="6" fill={ALERT_ORANGE} filter="url(#led-glow)" />
                <text x="142" y="767" fontFamily={FONT_MONO} fontSize="13" letterSpacing="2.5" fill={ALERT_ORANGE}>MAIN VALVE CLOSED</text>
                <text x="142" y="789" fontFamily={FONT_SERIF} fontSize="16" fill={FOG_50}>Eight seconds from detection to shutoff. The main is sealed.</text>
              </g>

              <g className={styles.label5}>
                <circle cx="120" cy="770" r="6" fill={SIGNAL_GOLD} filter="url(#led-glow)" />
                <text x="142" y="767" fontFamily={FONT_MONO} fontSize="13" letterSpacing="2.5" fill={SIGNAL_GOLD}>DAMAGE AVERTED</text>
                <text x="142" y="789" fontFamily={FONT_SERIF} fontSize="16" fill={FOG_50}>Without the device: ~$28,400 in claims. With it: a mop and a service call.</text>
              </g>
            </g>
          )}

          {/* ===== FOOTER ===== */}
          <line x1="60" y1={captionY - 70} x2="1540" y2={captionY - 70} stroke="#FFFFFF" strokeWidth="0.5" opacity="0.06" />
          <g transform={`translate(60, ${captionY - 45})`}>
            {/* Water drop mark */}
            <g opacity="0.9">
              <path d="M16 4 C16 4 8 16 8 22 C8 27 12 30 16 30 C20 30 24 27 24 22 C24 16 16 4 16 4 Z" fill={HYDRO_CYAN} />
              <path d="M12 19 C12 24 14 26 16 25.5" stroke="#FFF" strokeWidth="0.8" fill="none" opacity="0.3" strokeLinecap="round" />
            </g>
            <text x="38" y="20" fontFamily={FONT_SANS} fontSize="13" fontWeight="500" letterSpacing="3" fill={FOG_50}>HYDROSENSE</text>
            <text x="38" y="34" fontFamily={FONT_SANS} fontSize="10" letterSpacing="4" fill={FOG_300}>TEXAS</text>
          </g>
          <text x="800" y={captionY - 23} fontFamily={FONT_SANS} fontSize="13" fill={FOG_200} textAnchor="middle" opacity="0.7">hydrosensetx.com</text>
          <text x="1540" y={captionY - 23} fontFamily={FONT_SANS} fontSize="11" fill={FOG_300} textAnchor="end" opacity="0.5">A service of Lead Ledger Pro LLC</text>
        </svg>
      )}
    </div>
  );
}
