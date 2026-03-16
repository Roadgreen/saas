import React from "react";
import {
  AbsoluteFill,
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

// ---- Utility components ----

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({ children, delay = 0, duration = 15 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, duration], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
};

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
    [0, 0.6, 0.3, 0],
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
        background: `radial-gradient(circle, ${ORANGE}88, transparent)`,
        opacity: frame > delay ? opacity : 0,
        filter: "blur(2px)",
      }}
    />
  );
};

// ---- Scene 1: Logo Reveal ----
const SceneIntro: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [50, 80], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background particles */}
      <GlowDot x={200} y={300} size={80} delay={5} />
      <GlowDot x={800} y={600} size={60} delay={15} />
      <GlowDot x={150} y={square ? 700 : 1400} size={100} delay={10} />
      <GlowDot x={900} y={square ? 200 : 400} size={70} delay={20} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            width: 160,
            height: 160,
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
              fontSize: 80,
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
            fontSize: 96,
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
            fontSize: 36,
            color: GRAY,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          L'app qui pr&eacute;dit tes ventes
          <br />
          de food truck
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 2: Features list animated ----
const features = [
  { icon: "🤖", label: "Prédictions IA", desc: "Anticipe tes ventes du jour" },
  { icon: "📦", label: "Scan stocks", desc: "Inventaire en un clic" },
  { icon: "♻️", label: "Réduction gaspillage", desc: "Moins de pertes, plus de marge" },
  { icon: "📊", label: "Dashboard analytics", desc: "Tout en un coup d'œil" },
];

const SceneFeatures: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FadeIn delay={0} duration={15}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: WHITE,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Tout ce qu'il te faut
        </div>
      </FadeIn>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
          maxWidth: 900,
        }}
      >
        {features.map((f, i) => {
          const delay = 15 + i * 12;
          const s = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity,
                transform: `translateX(${(1 - s) * 80}px)`,
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${ORANGE}22, ${ORANGE}11)`,
                  border: `2px solid ${ORANGE}44`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 44,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: WHITE,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {f.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: GRAY,
                    fontFamily: "system-ui, sans-serif",
                    marginTop: 4,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 3: Phone Mockup Showcase ----
const mockups = [
  { file: "mockup-iphone-dashboard.png", label: "Dashboard" },
  { file: "mockup-iphone-products.png", label: "Produits" },
  { file: "mockup-iphone-recipes.png", label: "Recettes" },
  { file: "mockup-iphone-analytics.png", label: "Analytics" },
];

const SceneMockups: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Each mockup gets ~60 frames, slide in from right
  const mockupDuration = 60;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, overflow: "hidden" }}>
      {/* Gradient overlay top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(180deg, ${DARK_BG}, transparent)`,
          zIndex: 10,
        }}
      />

      {/* Title */}
      <FadeIn delay={0} duration={15}>
        <div
          style={{
            position: "absolute",
            top: square ? 80 : 200,
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Ton food truck,{" "}
            <span style={{ color: ORANGE }}>en poche</span>
          </span>
        </div>
      </FadeIn>

      {/* Mockups carousel */}
      {mockups.map((m, i) => {
        const start = i * mockupDuration;
        const localFrame = frame - start;
        const isActive = localFrame >= 0 && localFrame < mockupDuration + 15;

        if (!isActive) return null;

        const enterX = interpolate(localFrame, [0, 20], [1080, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const exitX = interpolate(
          localFrame,
          [mockupDuration - 10, mockupDuration + 15],
          [0, -1080],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          }
        );
        const x = localFrame < mockupDuration - 10 ? enterX : exitX;

        const opacity = interpolate(localFrame, [0, 15, mockupDuration - 5, mockupDuration + 15], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const phoneHeight = square ? 600 : 1000;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: square ? "50%" : "55%",
              transform: `translate(calc(-50% + ${x}px), -50%)`,
              opacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div
              style={{
                width: phoneHeight * 0.49,
                height: phoneHeight,
                borderRadius: 40,
                overflow: "hidden",
                boxShadow: `0 0 80px ${ORANGE}33, 0 20px 60px rgba(0,0,0,0.5)`,
                border: `3px solid ${ORANGE}44`,
              }}
            >
              <Img
                src={staticFile(m.file)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: ORANGE,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {m.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- Scene 4: CTA ----
const SceneCTA: React.FC<{ square: boolean }> = ({ square }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.8 },
  });

  const buttonPulse = interpolate(
    frame % 40,
    [0, 20, 40],
    [1, 1.05, 1],
    { extrapolateRight: "clamp" }
  );

  const ctaOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
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
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ORANGE}15, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          transform: `scale(${scale})`,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 120,
            height: 120,
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
              fontSize: 64,
              fontWeight: 900,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            F
          </span>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: WHITE,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Prêt à booster
          <br />
          ton <span style={{ color: ORANGE }}>food truck</span> ?
        </div>

        {/* CTA button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${buttonPulse})`,
            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`,
            borderRadius: 60,
            padding: "28px 70px",
            boxShadow: `0 0 40px ${ORANGE}55`,
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Essai gratuit
          </span>
        </div>

        <div
          style={{
            opacity: ctaOpacity,
            fontSize: 44,
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
  );
};

// ---- Main Composition ----
export const FoodTracksVideo: React.FC<{ square?: boolean }> = ({
  square = false,
}) => {
  // Total: 750 frames @ 30fps = 25 seconds
  // Scene 1 (Intro): 0-149 (5s)
  // Scene 2 (Features): 150-329 (6s)
  // Scene 3 (Mockups): 330-599 (9s)
  // Scene 4 (CTA): 600-749 (5s)

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <SceneIntro square={square} />
      </Sequence>

      <Sequence from={150} durationInFrames={180}>
        <SceneFeatures square={square} />
      </Sequence>

      <Sequence from={330} durationInFrames={270}>
        <SceneMockups square={square} />
      </Sequence>

      <Sequence from={600} durationInFrames={150}>
        <SceneCTA square={square} />
      </Sequence>
    </AbsoluteFill>
  );
};
