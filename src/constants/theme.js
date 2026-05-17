// ── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg:           "#f0f4f8",
  surface:      "#ffffff",
  surfaceAlt:   "#f7f9fc",
  border:       "#e2e8f0",
  borderLight:  "#eef1f6",
  navy:         "#0f2d5e",
  navyMid:      "#1a4480",
  blue:         "#1e6fc4",
  blueLight:    "#3b8fe8",
  bluePale:     "#e8f1fb",
  accent:       "#0ea5e9",
  accentGreen:  "#16a34a",
  accentAmber:  "#d97706",
  accentRed:    "#dc2626",
  accentOrange: "#ea580c",
  text:         "#0f172a",
  textSub:      "#475569",
  textMuted:    "#94a3b8",
};

export const STATUS = {
  good:     { color: C.accentGreen,  label: "Good",       bg: "#dcfce7" },
  moderate: { color: C.blue,         label: "Moderate",   bg: C.bluePale },
  warning:  { color: C.accentAmber,  label: "Warning",    bg: "#fef3c7" },
  critical: { color: C.accentRed,    label: "Critical",   bg: "#fee2e2" },
  fire:     { color: C.accentOrange, label: "Fire Alert", bg: "#ffedd5" },
};