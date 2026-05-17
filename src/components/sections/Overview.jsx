import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { C } from "../../constants/theme";
import { ALL_BINS, TRUCKS, weeklyData, wasteTypes } from "../../constants/data";
import { Card, KPICard, Tooltip2 } from "../ui";

const Overview = ({ alerts, onViewAlerts }) => {
  const criticalCount = ALL_BINS.filter(b => ["critical", "fire"].includes(b.status)).length;
  const unread        = alerts.filter(a => !a.ack).length;
  const avgFill       = Math.round(ALL_BINS.reduce((s, b) => s + b.fill, 0) / ALL_BINS.length);

  return (
    <div>
      {/* Critical banner */}
      {criticalCount > 0 && (
        <div style={{
          background: "linear-gradient(90deg,#fee2e2,#fff7ed)",
          border: `1px solid ${C.accentRed}33`, borderLeft: `4px solid ${C.accentRed}`,
          borderRadius: 12, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
        }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div>
            <strong style={{ color: C.accentRed, fontSize: 14 }}>Critical Alert — </strong>
            <span style={{ color: C.textSub, fontSize: 13 }}>
              {criticalCount} bin(s) require immediate attention, including a fire alert at SOG.
            </span>
          </div>
          <button
            onClick={onViewAlerts}
            style={{ marginLeft: "auto", background: C.accentRed, color: "#fff", border: "none", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
          >
            View Now
          </button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        <KPICard icon="🗑️" label="Total Bins"    value={ALL_BINS.length}                                      unit="units"  delta={0} />
        <KPICard icon="⚠️" label="Active Alerts" value={unread}                                               unit="alerts" delta={-8} />
        <KPICard icon="📊" label="Avg Fill Level" value={avgFill}                                              unit="%"      delta={5} />
        <KPICard icon="🚛" label="Active Trucks"  value={TRUCKS.filter(t => t.status !== "Idle").length}      unit="trucks" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Area chart */}
        <Card>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>
            Collection vs Recycled (kg) — This Week
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue}        stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.blue}        stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.accentGreen} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.accentGreen} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
              <XAxis dataKey="day"  tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis               tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip2 />} />
              <Area type="monotone" dataKey="collected" stroke={C.blue}        fill="url(#gc)" strokeWidth={2.5} name="Collected" />
              <Area type="monotone" dataKey="recycled"  stroke={C.accentGreen} fill="url(#gr)" strokeWidth={2.5} name="Recycled" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>
            Waste Type Distribution
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                {wasteTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<Tooltip2 />} />
              <Legend iconSize={8} formatter={v => <span style={{ color: C.textSub, fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System health */}
      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 16px" }}>
          System Health
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "IoT Uptime",      val: "99.1%", ok: true  },
            { label: "GPS Accuracy",    val: "98.6%", ok: true  },
            { label: "Route Efficiency",val: "83.4%", ok: true  },
            { label: "Sensor Battery",  val: "68%",   ok: false },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.ok ? "#f0fdf4" : "#fffbeb",
              border: `1px solid ${s.ok ? "#bbf7d0" : "#fde68a"}`,
              borderRadius: 12, padding: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.ok ? C.accentGreen : C.accentAmber, fontFamily: "'Sora',sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>{s.label}</div>
              <div style={{ marginTop: 8 }}>{s.ok ? "✅" : "⚠️"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Overview;