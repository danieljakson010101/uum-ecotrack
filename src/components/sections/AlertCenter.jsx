import { C } from "../../constants/theme";
import { SectionLabel } from "../ui";

const ICON_MAP  = { fire: "🔥", overfill: "📊", maintenance: "🔧", route: "🗺️" };
const COLOR_MAP = { critical: "#dc2626", warning: "#d97706", info: "#1e6fc4" };
const BG_MAP    = { critical: "#fee2e2", warning: "#fef3c7", info: "#e8f1fb" };

const AlertCenter = ({ alerts, setAlerts }) => {
  const ack     = id => setAlerts(prev => prev.map(a => a.id === id ? { ...a, ack: true } : a));
  const dismiss = id => setAlerts(prev => prev.filter(a => a.id !== id));
  const unread  = alerts.filter(a => !a.ack).length;

  return (
    <div>
      <SectionLabel title="Alert & Notification Centre" subtitle="Review and manage system incidents in real time" />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Unacknowledged", val: unread,                                               color: "#dc2626", bg: "#fee2e2", icon: "🔔" },
          { label: "Critical Issues", val: alerts.filter(a => a.severity === "critical").length, color: "#d97706", bg: "#fef3c7", icon: "⚠️" },
          { label: "Resolved Today",  val: 9,                                                    color: "#16a34a", bg: "#dcfce7", icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textSub, fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {alerts.map(alert => {
          const bc = COLOR_MAP[alert.severity];
          return (
            <div key={alert.id} style={{
              background:   alert.ack ? C.surfaceAlt : BG_MAP[alert.severity],
              border:       `1px solid ${alert.ack ? C.border : bc + "44"}`,
              borderLeft:   `4px solid ${alert.ack ? C.border : bc}`,
              borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              opacity: alert.ack ? 0.6 : 1, transition: "all 0.3s",
            }}>
              <span style={{ fontSize: 22 }}>{ICON_MAP[alert.type]}</span>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ background: bc + "22", color: bc, border: `1px solid ${bc}44`, padding: "2px 9px", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                    {alert.severity}
                  </span>
                  {alert.bin  && <span style={{ color: C.blue, fontWeight: 700, fontSize: 12, fontFamily: "'Sora',sans-serif" }}>{alert.bin}</span>}
                  {alert.zone && <span style={{ color: C.textMuted, fontSize: 12 }}>· {alert.zone}</span>}
                </div>
                <p style={{ color: alert.ack ? C.textMuted : C.text, margin: 0, fontSize: 14, fontWeight: 500 }}>{alert.msg}</p>
                <p style={{ color: C.textMuted, margin: "4px 0 0", fontSize: 11 }}>🕐 {alert.time}</p>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!alert.ack && (
                  <button onClick={() => ack(alert.id)} style={{ padding: "7px 14px", background: "#16a34a", border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                    ✓ Acknowledge
                  </button>
                )}
                <button onClick={() => dismiss(alert.id)} style={{ padding: "7px 14px", background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {alerts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: "#16a34a", fontSize: 18, fontWeight: 800 }}>All Clear</p>
            <p style={{ color: C.textMuted, fontSize: 14 }}>No active alerts — system operating normally.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;