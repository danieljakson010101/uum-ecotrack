import { C, STATUS } from "../../constants/theme";

// ── Badge ──────────────────────────────────────────────────────────────────────
export const Badge = ({ status }) => {
  const s = STATUS[status] || STATUS.good;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.color}44`,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
};

// ── FillBar ────────────────────────────────────────────────────────────────────
export const FillBar = ({ value, status }) => {
  const s = STATUS[status] || STATUS.good;
  return (
    <div style={{ height: 7, background: C.borderLight, borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg,${s.color}99,${s.color})`,
        transition: "width 0.8s ease",
      }} />
    </div>
  );
};

// ── Card ───────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick, highlight }) => (
  <div
    onClick={onClick}
    style={{
      background: C.surface, borderRadius: 14,
      border: `1.5px solid ${highlight ? C.blue : C.border}`,
      boxShadow: highlight ? `0 4px 20px ${C.blue}18` : "0 1px 6px rgba(15,45,94,0.05)",
      padding: "22px 24px", transition: "all 0.2s",
      cursor: onClick ? "pointer" : "default", ...style,
    }}
  >{children}</div>
);

// ── SectionLabel ───────────────────────────────────────────────────────────────
export const SectionLabel = ({ title, subtitle }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 0 }}>
      <div style={{ width: 4, height: 22, borderRadius: 99, background: `linear-gradient(180deg,${C.blue},${C.accent})` }} />
      <h2 style={{ color: C.navy, fontSize: 19, fontWeight: 800, margin: 0, fontFamily: "'Sora',sans-serif", letterSpacing: "-0.02em" }}>{title}</h2>
    </div>
    {subtitle && <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 0 14px" }}>{subtitle}</p>}
  </div>
);

// ── KPICard ────────────────────────────────────────────────────────────────────
export const KPICard = ({ icon, label, value, unit, delta, sub }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ color: C.navy, fontSize: 30, fontWeight: 800, fontFamily: "'Sora',sans-serif", letterSpacing: "-0.03em" }}>{value}</span>
          {unit && <span style={{ color: C.textMuted, fontSize: 14 }}>{unit}</span>}
        </div>
        {delta !== undefined && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: delta >= 0 ? C.accentGreen : C.accentRed, fontWeight: 600 }}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs last week
          </p>
        )}
        {sub && <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: 12 }}>{sub}</p>}
      </div>
      <div style={{ background: C.bluePale, borderRadius: 12, padding: "10px 12px", fontSize: 22 }}>{icon}</div>
    </div>
  </Card>
);

// ── Tooltip2 (custom recharts tooltip) ────────────────────────────────────────
export const Tooltip2 = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 16px rgba(15,45,94,0.1)" }}>
      <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: <span style={{ color: C.text }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};