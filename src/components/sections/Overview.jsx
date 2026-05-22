import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { C } from "../../constants/theme";
import { ALL_BINS, COLLEGES, TRUCKS, weeklyData, wasteTypes } from "../../constants/data";
import { Card, Tooltip2 } from "../ui";

const COLLEGE_COLORS = { CAS: "#3b8fe8", COB: "#6d9fd4", COLGIS: "#a78bfa" };

const ZONE_TO_COLLEGE = {};
Object.entries(COLLEGES).forEach(([collegeKey, col]) => {
  col.schools.forEach(s => { ZONE_TO_COLLEGE[s.code] = collegeKey; });
});
const INASIS_ZONES = ["MAS","TNB","Tradewinds","Proton","Petronas","SimeDarby","Grantt","TM","BSN","MiSC","Muamalat","YAB","BankRakyat","Bank Rakyat","SMEBank"];
INASIS_ZONES.forEach(z => { ZONE_TO_COLLEGE[z] = "INASIS"; });

const BinsPopover = ({ onClose }) => {
  const counts = { CAS: 0, COB: 0, COLGIS: 0, INASIS: 0 };
  ALL_BINS.forEach(b => {
    const key = ZONE_TO_COLLEGE[b.zone] ?? "Other";
    if (key in counts) counts[key]++;
  });
  const rows = [
    ...Object.entries(COLLEGES).map(([key, col]) => ({ key, label: col.label, full: col.full, count: counts[key] ?? 0, color: COLLEGE_COLORS[key] ?? C.textMuted })),
    { key: "INASIS", label: "INASIS", full: "Residential Colleges", count: counts.INASIS, color: "#0d9488" },
  ];
  return (
    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 300, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", width: 230, boxShadow: "0 8px 32px rgba(15,45,94,0.13)" }}>
      <div style={{ position: "absolute", top: -7, left: 24, width: 12, height: 12, background: "#fff", border: `1px solid ${C.border}`, borderBottom: "none", borderRight: "none", transform: "rotate(45deg)" }} />
      <p style={{ color: C.textMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Bins by College</p>
      {rows.map(r => (
        <div key={r.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <span style={{ color: C.textSub, fontSize: 12, fontWeight: 700 }}>{r.key}</span>
              <span style={{ color: C.textMuted, fontSize: 10, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>{r.full}</span>
            </div>
          </div>
          <span style={{ background: r.count > 0 ? C.bluePale : "#f1f5f9", color: r.count > 0 ? C.blue : C.textMuted, fontWeight: 700, fontSize: 12, borderRadius: 7, padding: "2px 10px", fontFamily: "'Sora',sans-serif", flexShrink: 0, marginLeft: 6 }}>{r.count}</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 2, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Total</span>
        <span style={{ color: C.navy, fontSize: 12, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{ALL_BINS.length} units</span>
      </div>
      <button onClick={onClose} style={{ marginTop: 10, width: "100%", padding: "7px 0", background: C.bluePale, border: "none", borderRadius: 7, color: C.blue, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Close</button>
    </div>
  );
};

const KPICell = ({ icon, iconBg, label, value, unit, delta, deltaDir, onClick, clickable }) => {
  const deltaColor = deltaDir === "up" ? C.accentGreen : deltaDir === "down" ? C.accentRed : C.textMuted;
  const deltaArrow = deltaDir === "up" ? "▲" : deltaDir === "down" ? "▼" : "—";
  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", cursor: clickable ? "pointer" : "default", borderRadius: 8, transition: "background 0.15s" }}
      onMouseEnter={e => { if (clickable) e.currentTarget.style.background = "rgba(59,143,232,0.04)"; }}
      onMouseLeave={e => { if (clickable) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <p style={{ color: C.textMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{label}</p>
          {clickable && <span style={{ color: C.blue, fontSize: 9 }}>▾</span>}
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: iconBg ?? C.bluePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
      </div>
      <div style={{ margin: "6px 0 4px" }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.navy, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{value}</span>
        <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 5 }}>{unit}</span>
      </div>
      <span style={{ color: deltaColor, fontSize: 11, fontWeight: 700 }}>
        {delta !== undefined ? `${deltaArrow} ${Math.abs(delta)}% vs last week` : "\u00A0"}
      </span>
    </div>
  );
};

const Overview = ({ alerts, onViewAlerts }) => {
  const [showBinsPopover, setShowBinsPopover] = useState(false);
  const criticalCount = ALL_BINS.filter(b => ["critical", "fire"].includes(b.status)).length;
  const unread        = alerts.filter(a => !a.ack).length;
  const avgFill       = Math.round(ALL_BINS.reduce((s, b) => s + b.fill, 0) / ALL_BINS.length);
  const cellPad       = { padding: 16 };

  return (
    <div onClick={showBinsPopover ? () => setShowBinsPopover(false) : undefined}>
      {/* Critical banner */}
      {criticalCount > 0 && (
        <div style={{ background: "linear-gradient(90deg,#fee2e2,#fff7ed)", border: `1px solid ${C.accentRed}33`, borderLeft: `4px solid ${C.accentRed}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>🚨</span>
          <div>
            <strong style={{ color: C.accentRed, fontSize: 13 }}>Critical Alert — </strong>
            <span style={{ color: C.textSub, fontSize: 12 }}>{criticalCount} bin(s) require immediate attention, including a fire alert at SOG.</span>
          </div>
          <button onClick={onViewAlerts} style={{ marginLeft: "auto", background: C.accentRed, color: "#fff", border: "none", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>View Now</button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Card style={{ padding: 0, overflow: "visible" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%" }}>
            <div style={{ ...cellPad, borderRight: `1px solid ${C.border}`, position: "relative" }} onClick={e => { e.stopPropagation(); setShowBinsPopover(v => !v); }}>
              <KPICell icon="🗑️" iconBg={C.bluePale} label="Total Bins" value={ALL_BINS.length} unit="units" delta={0} deltaDir="up" clickable />
              {showBinsPopover && <BinsPopover onClose={() => setShowBinsPopover(false)} />}
            </div>
            <div style={{ ...cellPad, cursor: "pointer", borderRadius: "0 12px 12px 0", transition: "background 0.15s" }} onClick={e => { e.stopPropagation(); onViewAlerts(); }} onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <KPICell icon="⚠️" iconBg="#fff7ed" label="Active Alerts" value={unread} unit="alerts" delta={8} deltaDir="down" clickable />
            </div>
          </div>
        </Card>
        <Card style={cellPad}><KPICell icon="📊" iconBg={C.bluePale} label="Avg Fill Level" value={avgFill} unit="%" delta={5} deltaDir="up" /></Card>
        <Card style={cellPad}><KPICell icon="🚛" iconBg={C.bluePale} label="Active Trucks" value={TRUCKS.filter(t => t.status !== "Idle").length} unit="trucks" /></Card>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginBottom: 12 }}>
        <Card style={{ padding: "14px 16px" }}>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Collection vs Recycled (kg) — This Week</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity={0.15} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} /></linearGradient>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accentGreen} stopOpacity={0.15} /><stop offset="100%" stopColor={C.accentGreen} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<Tooltip2 />} />
              <Area type="monotone" dataKey="collected" stroke={C.blue} fill="url(#gc)" strokeWidth={2} name="Collected" />
              <Area type="monotone" dataKey="recycled" stroke={C.accentGreen} fill="url(#gr)" strokeWidth={2} name="Recycled" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: "14px 16px" }}>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Waste Type Distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">
                {wasteTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<Tooltip2 />} />
              <Legend iconSize={7} formatter={v => <span style={{ color: C.textSub, fontSize: 10 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System health */}
      <Card style={{ padding: "14px 16px" }}>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>System Health</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { label: "IoT Uptime",       val: "99.1%", ok: true  },
            { label: "GPS Accuracy",     val: "98.6%", ok: true  },
            { label: "Route Efficiency", val: "83.4%", ok: true  },
            { label: "Sensor Battery",   val: "68%",   ok: false },
          ].map((s, i) => (
            <div key={i} style={{ background: s.ok ? "#f0fdf4" : "#fffbeb", border: `1px solid ${s.ok ? "#bbf7d0" : "#fde68a"}`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.ok ? C.accentGreen : C.accentAmber, fontFamily: "'Sora',sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textMuted, fontSize: 10, marginTop: 3 }}>{s.label}</div>
              <div style={{ marginTop: 5, fontSize: 13 }}>{s.ok ? "✅" : "⚠️"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Overview;