import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";
import { BUTTERFLY_VIEWBOX, SOLID_PATH } from "@/components/marks/butterfly-paths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bloom Kreations — loctician in Bridgeport, Chicago";

/**
 * Generated rather than shipped as a file so the card can never drift out of
 * sync with the rating or the address. Uses system type only — ImageResponse
 * cannot see the self-hosted variable fonts, and a fake fallback would look
 * worse than a clean geometric card.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#120c0d",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Neon wash and the mark's glow, both drawn as one inline SVG.
            Satori renders only the first of a comma-separated CSS background
            and clips a radial-gradient to its own box — an absolutely
            positioned div comes out as a visible glowing square. Inline SVG is
            handed to resvg instead, which does gradients properly. */}
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <radialGradient id="wash-rose" cx="0.85" cy="0.12" r="0.7">
              <stop offset="0" stopColor="#FF3D7F" stopOpacity="0.32" />
              <stop offset="1" stopColor="#FF3D7F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wash-honey" cx="0.08" cy="0.92" r="0.62">
              <stop offset="0" stopColor="#E9A24A" stopOpacity="0.16" />
              <stop offset="1" stopColor="#E9A24A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mark-glow">
              <stop offset="0" stopColor="#FF4D8D" stopOpacity="0.42" />
              <stop offset="1" stopColor="#FF4D8D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={size.width} height={size.height} fill="url(#wash-rose)" />
          <rect width={size.width} height={size.height} fill="url(#wash-honey)" />
          <circle cx={115} cy={107} r={108} fill="url(#mark-glow)" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* The real mark, straight from the traced logo. Its glow is the
              radial gradient painted behind it above. */}
          <svg
            width={86}
            height={Math.round((86 * BUTTERFLY_VIEWBOX.h) / BUTTERFLY_VIEWBOX.w)}
            viewBox={`0 0 ${BUTTERFLY_VIEWBOX.w} ${BUTTERFLY_VIEWBOX.h}`}
          >
            <path d={SOLID_PATH} fill="#FF4D8D" />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 800,
              color: "#F7ECE0",
              letterSpacing: -1,
            }}
          >
            Bloom Kreations
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3.5,
              color: "#F7ECE0",
            }}
          >
            Healthy locs.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3.5,
              color: "#FF4D8D",
            }}
          >
            Happy crown.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 26,
            color: "#C4AE9C",
            borderTop: "1px solid rgba(160,105,75,0.5)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", color: "#E9A24A", fontWeight: 700 }}>
            {BUSINESS.rating.value} · {BUSINESS.rating.count} Google reviews
          </div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>
            {BUSINESS.address.street}, {BUSINESS.address.neighborhood}
          </div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>{BUSINESS.phone}</div>
        </div>
      </div>
    ),
    size
  );
}
