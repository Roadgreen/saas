import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Easing,
} from "remotion";

// Brand colors
const DARK_BG = "#0D0905";
const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FB923C";
const WHITE = "#FAFAF9";
const GRAY = "#A8A29E";

// ---- Shared constants ----
const FPS = 30;

// Scene durations in frames (30fps)
const SCENE_INTRO = 3 * FPS; // 90
const SCENE_LANDING = 3 * FPS; // 90
const SCENE_REGISTER = 3 * FPS; // 90
const SCENE_ONBOARDING = 3 * FPS; // 90
const SCENE_DASHBOARD = 4 * FPS; // 120
const SCENE_PRODUCTS = 3 * FPS; // 90
const SCENE_RECIPES = 3 * FPS; // 90
const SCENE_SALES = 3 * FPS; // 90
const SCENE_ANALYTICS = 3 * FPS; // 90
const SCENE_CTA = 3 * FPS; // 90

const TOTAL_FRAMES =
  SCENE_INTRO +
  SCENE_LANDING +
  SCENE_REGISTER +
  SCENE_ONBOARDING +
  SCENE_DASHBOARD +
  SCENE_PRODUCTS +
  SCENE_RECIPES +
  SCENE_SALES +
  SCENE_ANALYTICS +
  SCENE_CTA;

export { TOTAL_FRAMES };

// ---- Utility: slide transition wrapper ----
// Handles enter (slide-in from right) and exit (slide-out to left) for each scene
const SlideTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  direction?: "horizontal" | "fade";
}> = ({ children, durationInFrames, direction = "horizontal" }) => {
  const frame = useCurrentFrame();
  const transFrames = 10; // transition duration in frames

  // Enter
  const enterProgress = interpolate(frame, [0, transFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Exit
  const exitProgress = interpolate(
    frame,
    [durationInFrames - transFrames, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  let transform = "";
  let opacity = 1;

  if (direction === "horizontal") {
    const enterX = (1 - enterProgress) * 120;
    const exitX = exitProgress * -120;
    const x = frame < durationInFrames - transFrames ? enterX : exitX;
    transform = `translateX(${x}px)`;
    opacity = interpolate(
      frame,
      [0, transFrames * 0.6, durationInFrames - transFrames * 0.6, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else {
    opacity = interpolate(
      frame,
      [0, transFrames, durationInFrames - transFrames, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  return (
    <AbsoluteFill style={{ opacity, transform }}>
      {children}
    </AbsoluteFill>
  );
};

// ---- Utility: text pill overlay ----
const TextPill: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  bottom?: number | string;
  top?: number | string;
}> = ({ children, delay = 8, fontSize = 42, bottom, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posStyle: React.CSSProperties = {};
  if (bottom !== undefined) posStyle.bottom = bottom;
  if (top !== undefined) posStyle.top = top;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 30,
        ...posStyle,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${s}) translateY(${(1 - s) * 20}px)`,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(12px)",
          borderRadius: 50,
          padding: "16px 48px",
          border: `2px solid ${ORANGE}44`,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: WHITE,
            fontFamily: "system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
};

// ---- Utility: screenshot with zoom/pan ----
const ScreenshotDisplay: React.FC<{
  src: string;
  square: boolean;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  durationInFrames: number;
}> = ({
  src,
  square,
  zoomFrom = 1.0,
  zoomTo = 1.08,
  panX = 0,
  panY = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const px = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const py = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // Browser frame dimensions
  const frameW = square ? 860 : 920;
  const frameH = square ? 540 : 1100;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Laptop/browser frame */}
      <div
        style={{
          background: "#1C1C1E",
          borderRadius: 18,
          padding: "14px 14px 0 14px",
          boxShadow: `0 0 80px ${ORANGE}18, 0 40px 80px rgba(0,0,0,0.5)`,
          border: `1.5px solid rgba(255,255,255,0.08)`,
        }}
      >
        {/* Browser bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            padding: "4px 8px",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              flex: 1,
              marginLeft: 16,
              height: 26,
              borderRadius: 8,
              background: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
              fontSize: 15,
              color: GRAY,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            foodtracks.io
          </div>
        </div>
        {/* Screenshot */}
        <div
          style={{
            width: frameW,
            height: frameH,
            borderRadius: "4px 4px 0 0",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
              transform: `scale(${zoom}) translate(${px}px, ${py}px)`,
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
      {/* Laptop base */}
      <div
        style={{
          width: frameW + 80,
          height: 14,
          background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
          borderRadius: "0 0 8px 8px",
          marginTop: -1,
        }}
      />
    </div>
  );
};

// ---- Utility: animated glow particles ----
const GlowDot: React.FC<{ x: number; y: number; size: number; delay: number }> = ({
  x,
  y,
  size,
  delay,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    (frame - delay) % 90,
    [0, 30, 60, 90],
    [0, 0.5, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${ORANGE}66, transparent)`,
        opacity: frame > delay ? opacity : 0,
        filter: "blur(4px)",
        pointerEvents: "none",
      }}
    />
  );
};

// ===========================================================
// Scene 1: INTRO - Logo + tagline
// ===========================================================
const SceneIntro: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const textOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [35, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = interpolate(frame, [45, 70], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SlideTransition durationInFrames={SCENE_INTRO} direction="fade">
      <AbsoluteFill
        style={{
          backgroundColor: DARK_BG,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowDot x={200} y={300} size={80} delay={5} />
        <GlowDot x={800} y={600} size={60} delay={15} />
        <GlowDot x={150} y={square ? 700 : 1400} size={100} delay={10} />
        <GlowDot x={900} y={square ? 200 : 400} size={70} delay={20} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              width: 140,
              height: 140,
              borderRadius: 32,
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 60px ${ORANGE}44`,
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: WHITE,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              F
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              opacity: textOpacity,
              fontSize: 88,
              fontWeight: 900,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "-2px",
            }}
          >
            Food<span style={{ color: ORANGE }}>Tracks</span>
          </div>

          {/* Accent line */}
          <div
            style={{
              width: lineWidth,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
              borderRadius: 2,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              fontSize: 34,
              color: GRAY,
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            L'app qui prédit tes ventes
            <br />
            de food truck
          </div>
        </div>
      </AbsoluteFill>
    </SlideTransition>
  );
};

// ===========================================================
// Scene 2-8: Screenshot scenes (generic)
// ===========================================================
interface ScreenshotSceneProps {
  square: boolean;
  screenshotFile: string;
  label: string;
  accent?: string;
  durationInFrames: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  pillPosition?: "top" | "bottom";
}

const ScreenshotScene: React.FC<ScreenshotSceneProps> = ({
  square,
  screenshotFile,
  label,
  accent,
  durationInFrames,
  zoomFrom = 1.0,
  zoomTo = 1.06,
  panX = 0,
  panY = 0,
  pillPosition = "bottom",
}) => {
  return (
    <SlideTransition durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
        <ScreenshotDisplay
          src={screenshotFile}
          square={square}
          zoomFrom={zoomFrom}
          zoomTo={zoomTo}
          panX={panX}
          panY={panY}
          durationInFrames={durationInFrames}
        />

        {/* Text pill overlay */}
        <TextPill
          delay={6}
          fontSize={square ? 36 : 40}
          {...(pillPosition === "bottom"
            ? { bottom: square ? 80 : 160 }
            : { top: square ? 50 : 100 })}
        >
          {accent ? (
            <>
              {label} <span style={{ color: ORANGE }}>{accent}</span>
            </>
          ) : (
            label
          )}
        </TextPill>
      </AbsoluteFill>
    </SlideTransition>
  );
};

// ===========================================================
// Scene 9: CTA
// ===========================================================
const SceneCTA: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.8 },
  });

  const buttonPulse = interpolate(
    frame % 36,
    [0, 18, 36],
    [1, 1.06, 1],
    { extrapolateRight: "clamp" }
  );

  const buttonGlow = interpolate(
    frame % 36,
    [0, 18, 36],
    [0.4, 0.8, 0.4],
    { extrapolateRight: "clamp" }
  );

  const ctaOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SlideTransition durationInFrames={SCENE_CTA} direction="fade">
      <AbsoluteFill
        style={{
          backgroundColor: DARK_BG,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ORANGE}18, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <GlowDot x={100} y={200} size={90} delay={0} />
        <GlowDot x={850} y={square ? 700 : 1500} size={70} delay={8} />
        <GlowDot x={700} y={150} size={50} delay={12} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            transform: `scale(${scale})`,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 28,
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 40px ${ORANGE}44`,
            }}
          >
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: WHITE,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              F
            </span>
          </div>

          {/* Main text */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Essayez{" "}
            <span style={{ color: ORANGE }}>gratuitement</span>
          </div>

          {/* CTA button */}
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${buttonPulse})`,
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`,
              borderRadius: 60,
              padding: "24px 64px",
              boxShadow: `0 0 ${40 + buttonGlow * 30}px ${ORANGE}${Math.round(buttonGlow * 99)
                .toString()
                .padStart(2, "0")}`,
            }}
          >
            <span
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: WHITE,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Commencer maintenant
            </span>
          </div>

          {/* URL */}
          <div
            style={{
              opacity: urlOpacity,
              fontSize: 46,
              fontWeight: 700,
              color: ORANGE,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "2px",
            }}
          >
            foodtracks.io
          </div>
        </div>
      </AbsoluteFill>
    </SlideTransition>
  );
};

// ===========================================================
// Main Composition
// ===========================================================
export const FoodTracksVideo: React.FC<{ square?: boolean }> = ({
  square = false,
}) => {
  // Cumulative offsets
  let offset = 0;
  const introStart = offset;
  offset += SCENE_INTRO;

  const landingStart = offset;
  offset += SCENE_LANDING;

  const registerStart = offset;
  offset += SCENE_REGISTER;

  const onboardingStart = offset;
  offset += SCENE_ONBOARDING;

  const dashboardStart = offset;
  offset += SCENE_DASHBOARD;

  const productsStart = offset;
  offset += SCENE_PRODUCTS;

  const recipesStart = offset;
  offset += SCENE_RECIPES;

  const salesStart = offset;
  offset += SCENE_SALES;

  const analyticsStart = offset;
  offset += SCENE_ANALYTICS;

  const ctaStart = offset;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Background music with fade in/out */}
      <Audio
        src={staticFile("bg-music-calm.mp3")}
        volume={(f) => {
          const fadeInFrames = 30; // 1s fade in
          const fadeOutFrames = 45; // 1.5s fade out
          const baseVolume = 0.12;
          // Fade in
          if (f < fadeInFrames) {
            return (f / fadeInFrames) * baseVolume;
          }
          // Fade out
          if (f > TOTAL_FRAMES - fadeOutFrames) {
            return (
              ((TOTAL_FRAMES - f) / fadeOutFrames) * baseVolume
            );
          }
          return baseVolume;
        }}
        endAt={TOTAL_FRAMES}
      />

      {/* 1. Intro (3s) */}
      <Sequence from={introStart} durationInFrames={SCENE_INTRO}>
        <SceneIntro square={square} />
      </Sequence>

      {/* 2. Landing page (3s) */}
      <Sequence from={landingStart} durationInFrames={SCENE_LANDING}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-01-landing.png"
          label="Bienvenue sur"
          accent="FoodTracks"
          durationInFrames={SCENE_LANDING}
          zoomFrom={1.1}
          zoomTo={1.0}
          pillPosition="top"
        />
      </Sequence>

      {/* 3. Registration (3s) */}
      <Sequence from={registerStart} durationInFrames={SCENE_REGISTER}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-02-register.png"
          label="Inscription gratuite en 30 secondes"
          durationInFrames={SCENE_REGISTER}
          zoomFrom={1.0}
          zoomTo={1.05}
          panY={-8}
        />
      </Sequence>

      {/* 4. Onboarding (3s) */}
      <Sequence from={onboardingStart} durationInFrames={SCENE_ONBOARDING}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-04-onboarding.png"
          label="Un assistant"
          accent="vous guide"
          durationInFrames={SCENE_ONBOARDING}
          zoomFrom={1.0}
          zoomTo={1.04}
          panX={5}
        />
      </Sequence>

      {/* 5. Dashboard (4s) */}
      <Sequence from={dashboardStart} durationInFrames={SCENE_DASHBOARD}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-05-dashboard.png"
          label="Votre tableau de bord"
          durationInFrames={SCENE_DASHBOARD}
          zoomFrom={1.0}
          zoomTo={1.07}
          panY={-10}
          pillPosition="top"
        />
      </Sequence>

      {/* 6. Products (3s) */}
      <Sequence from={productsStart} durationInFrames={SCENE_PRODUCTS}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-06-products.png"
          label="Gérez vos stocks"
          accent="facilement"
          durationInFrames={SCENE_PRODUCTS}
          zoomFrom={1.02}
          zoomTo={1.06}
          panX={-5}
        />
      </Sequence>

      {/* 7. Recipes (3s) */}
      <Sequence from={recipesStart} durationInFrames={SCENE_RECIPES}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-07-recipes.png"
          label="Créez vos recettes"
          durationInFrames={SCENE_RECIPES}
          zoomFrom={1.0}
          zoomTo={1.05}
          panY={-6}
        />
      </Sequence>

      {/* 8. Sales (3s) */}
      <Sequence from={salesStart} durationInFrames={SCENE_SALES}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-08-sales.png"
          label="Suivez vos"
          accent="ventes"
          durationInFrames={SCENE_SALES}
          zoomFrom={1.0}
          zoomTo={1.05}
          panY={-8}
        />
      </Sequence>

      {/* 9. Analytics (3s) */}
      <Sequence from={analyticsStart} durationInFrames={SCENE_ANALYTICS}>
        <ScreenshotScene
          square={square}
          screenshotFile="journey-09-analytics.png"
          label="Analysez vos"
          accent="performances"
          durationInFrames={SCENE_ANALYTICS}
          zoomFrom={1.0}
          zoomTo={1.06}
          panX={4}
          panY={-5}
        />
      </Sequence>

      {/* 9. CTA (3s) */}
      <Sequence from={ctaStart} durationInFrames={SCENE_CTA}>
        <SceneCTA square={square} />
      </Sequence>
    </AbsoluteFill>
  );
};
