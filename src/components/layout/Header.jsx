import { C } from "../../constants/theme";

const Header = ({ time, unreadAlerts, onViewAlerts }) => (
  <header style={{
    background: C.surface, borderBottom: `1px solid ${C.border}`,
    padding: "0 32px", height: 66,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 50,
    boxShadow: "0 1px 8px rgba(15,45,94,0.06)",
  }}>

    {/* Title with logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/logo.png" alt="EcoTrack UUM" style={{ width: 42, height: 42, objectFit: "contain" }} />
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: C.navy, fontFamily: "'Sora',sans-serif", margin: 0, letterSpacing: "-0.02em" }}>
          EcoTrack UUM &mdash; Smart Waste Dashboard
        </h1>
        <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Universiti Utara Malaysia &mdash; Sintok Campus, Kedah</p>
      </div>
    </div>

    {/* Right side */}
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {/* Alert pill */}
      {unreadAlerts > 0 && (
        <button
          onClick={onViewAlerts}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fee2e2", border: `1px solid ${C.accentRed}33`,
            borderRadius: 99, padding: "6px 14px", cursor: "pointer",
            animation: "pulse 3s infinite",
          }}
        >
          <span style={{ fontSize: 14 }}>🔔</span>
          <span style={{ color: C.accentRed, fontSize: 12, fontWeight: 700 }}>{unreadAlerts} New Alerts</span>
        </button>
      )}

      <div style={{ width: 1, height: 32, background: C.border }} />

      {/* Clock */}
      <div style={{ textAlign: "right" }}>
        <div style={{ color: C.navy, fontSize: 14, fontFamily: "'Sora',sans-serif", fontWeight: 700 }}>
          {time.toLocaleTimeString("en-MY")}
        </div>
        <div style={{ color: C.textMuted, fontSize: 10 }}>Malaysia Time (MYT)</div>
      </div>

      <div style={{ width: 1, height: 32, background: C.border }} />

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a4480,#1e6fc4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff" }}>👤</div>
        <div>
          <div style={{ color: C.navy, fontSize: 12, fontWeight: 700 }}>UUM Administrator</div>
          <div style={{ color: C.textMuted, fontSize: 10 }}>Estates & Facilities Division</div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;