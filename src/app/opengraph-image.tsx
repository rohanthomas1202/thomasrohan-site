import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rohan Thomas — Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#050505",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: "#c5ff00",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(80% 60% at 80% 20%, rgba(197,255,0,0.12), transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a8a8a",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#c5ff00",
              }}
            />
            thomasrohan.com
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                fontSize: 132,
                fontWeight: 800,
                letterSpacing: -5,
                lineHeight: 0.9,
                display: "flex",
              }}
            >
              Rohan Thomas
            </div>
            <div
              style={{
                fontSize: 40,
                color: "#cfcfcf",
                lineHeight: 1.2,
                maxWidth: 900,
                display: "flex",
              }}
            >
              Trading screens moving{" "}
              <span style={{ color: "#c5ff00", marginLeft: 12 }}>$3T+</span>.
            </div>
            <div
              style={{
                fontSize: 32,
                color: "#8a8a8a",
                display: "flex",
              }}
            >
              Agents after hours.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#8a8a8a",
            }}
          >
            <span>Full-Stack Engineer</span>
            <span>Austin, TX</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
