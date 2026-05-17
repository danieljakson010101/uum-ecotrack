import { C } from "../../constants/theme";
import { ALL_BINS, TRUCKS } from "../../constants/data";

const Footer = () => (
  <footer style={{
    padding: "12px 32px", borderTop: `1px solid ${C.border}`,
    background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center",
  }}>
    <span style={{ color: C.textMuted, fontSize: 11 }}>
      © 2025 UUM EcoTrack — Smart Waste Management System | Sintok, Kedah, Malaysia
    </span>
    <div style={{ display: "flex", gap: 20 }}>
      {[
        { label: "Bins Online",   val: `${ALL_BINS.length}/${ALL_BINS.length}` },
        { label: "Active Trucks", val: `${TRUCKS.filter(t => t.status !== "Idle").length}/${TRUCKS.length}` },
        { label: "API Latency",   val: "18 ms" },
      ].map((s, i) => (
        <span key={i} style={{ color: C.accentGreen, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
          <span>●</span>
          {s.label}: <strong style={{ fontFamily: "'Sora',sans-serif" }}>{s.val}</strong>
        </span>
      ))}
    </div>
  </footer>
);

export default Footer;