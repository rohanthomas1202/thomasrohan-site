import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rohan Thomas — I build AI products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENTS = ["#2456F5", "#E56910", "#D6417F", "#3E8F4D", "#7351E8"];

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF6EF",
          color: "#1A1815",
          fontFamily: "sans-serif",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#6B6459" }}>
          Rohan Thomas · Austin, TX
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 980 }}>
          I build AI products — agents, dev tools, and the interfaces around them.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {ACCENTS.map((c) => (
              <div key={c} style={{ width: 28, height: 28, borderRadius: 14, background: c, display: "flex" }} />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#6B6459" }}>thomasrohan.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
