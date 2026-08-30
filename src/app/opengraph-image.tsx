import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";

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
        {/* Neon wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 70% at 85% 15%, rgba(255,61,127,0.28), transparent 70%), radial-gradient(55% 60% at 10% 90%, rgba(233,162,74,0.22), transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Butterfly mark */}
          <svg width="64" height="58" viewBox="0 0 100 90" fill="none" stroke="#FF4D8D" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 27v44" />
            <path d="M50 27c-4-7-9-11-14-13M50 27c4-7 9-11 14-13" />
            <path d="M50 31C44 15 26 9 16 18 7 27 14 42 31 46c8 2 16-7 19-15Z" />
            <path d="M50 31c6-16 24-22 34-13 9 9 2 24-15 28-8 2-16-7-19-15Z" />
            <path d="M50 43c-5 12-19 15-24 25-4 9 4 15 11 11 8-5 12-22 13-36Z" />
            <path d="M50 43c5 12 19 15 24 25 4 9-4 15-11 11-8-5-12-22-13-36Z" />
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
