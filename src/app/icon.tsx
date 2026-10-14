import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "1.5px solid #22c55e",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="22"
          height="22"
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
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="21" cy="4" r="1" fill="#22c55e" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
