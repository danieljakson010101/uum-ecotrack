import { C } from "../../constants/theme";
import { COLLEGES, INASIS_ROUTES } from "../../constants/data";

const NAV_ITEMS = [
  { id: "overview",  icon: "⬡",  label: "Overview" },
  { id: "bins",      icon: "🗑️", label: "Bin Monitor" },
  { id: "routes",    icon: "🚛", label: "Routes" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "alerts",    icon: "🔔", label: "Alerts" },
];

const Sidebar = ({ section, setSection, unreadAlerts, time }) => (
  <aside style={{
    width: 248, background: C.navy, minHeight: "100vh",
    display: "flex", flexDirection: "column",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "3px 0 20px rgba(15,45,94,0.14)",
  }}>
    {/* Brand */}
    <div style={{ padding: "28px 24px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            <img src="/logo.png" alt="EcoTrack UUM Logo" style={{ width: 40, height: 40, objectFit: "contain" }} />
          </div>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>EcoTrack UUM</div>
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, marginTop: 2, letterSpacing: "0.05em" }}>SMART WASTE SYSTEM</div>
        </div>
      </div>
    </div>

    {/* Colleges */}
    <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Colleges</p>
      {Object.entries(COLLEGES).map(([key, col]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: key === "CAS" ? "#3b8fe8" : key === "COB" ? "#6d9fd4" : "#a78bfa" }} />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600 }}>{col.label}</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{col.schools.length} schools</span>
        </div>
      ))}
    </div>

    {/* INASIS routes */}
    <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>INASIS Routes</p>
      {Object.entries(INASIS_ROUTES).map(([route, colleges]) => (
        <div key={route} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{route}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{colleges.length} colleges</span>
        </div>
      ))}
    </div>

    {/* Navigation */}
    <nav style={{ flex: 1, padding: "14px 12px" }}>
      {NAV_ITEMS.map(item => {
        const active = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, marginBottom: 3,
              background: active ? "rgba(255,255,255,0.1)" : "transparent",
              border: "none", cursor: "pointer", transition: "background 0.18s", textAlign: "left",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ color: active ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: active ? 700 : 400, flex: 1 }}>{item.label}</span>
            {item.id === "alerts" && unreadAlerts > 0 && (
              <span style={{ background: C.accentRed, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 7px", animation: "pulse 2s infinite" }}>{unreadAlerts}</span>
            )}
            {active && <div style={{ width: 3, height: 16, borderRadius: 99, background: C.blueLight }} />}
          </button>
        );
      })}
    </nav>

    {/* Live clock */}
    <div style={{ padding: "14px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentGreen, animation: "pulse 2s infinite" }} />
        <span style={{ color: C.accentGreen, fontSize: 11, fontWeight: 700 }}>SYSTEM LIVE</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "'Sora',sans-serif" }}>
        {time.toLocaleTimeString("en-MY")}
      </p>
      <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, marginTop: 2 }}>
        {time.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  </aside>
);

export default Sidebar;