import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 30% 30%, #27272a, #09090b)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          border: "4px solid #22c55e",
          boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ghost body */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9v11l2.5-1.5L10 20l2-1.5 2 1.5 2.5-1.5L19 20V9c0-3.87-3.13-7-7-7z"
            fill="#ffffff"
          />
          {/* Ghost eyes */}
          <circle cx="9.5" cy="9" r="1.2" fill="#09090b" />
          <circle cx="14.5" cy="9" r="1.2" fill="#09090b" />
          {/* Atomizer nozzle spray */}
          <path
            d="M18 6l3-2m-1 4l3 1"
            stroke="#22c55e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="21" cy="4" r="1.2" fill="#22c55e" />
        </svg>
        <span
          style={{
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "4px",
            marginTop: 4,
            textTransform: "uppercase",
          }}
        >
          VIBES
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
