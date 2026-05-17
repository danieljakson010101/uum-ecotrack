import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { C } from "../../constants/theme";
import { weeklyData, monthlyTrend } from "../../constants/data";
import { Card, KPICard, SectionLabel, Tooltip2 } from "../ui";

const Analytics = () => (
  <div>
    <SectionLabel title="Analytics & Reports" subtitle="Recycling performance, waste trends and operational efficiency" />

    {/* KPI row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
      <KPICard icon="♻️" label="Recycling Rate"        value="84"  unit="%" delta={4} />
      <KPICard icon="📦" label="Tonnes Collected (MTD)" value="318" unit="t" delta={11} />
      <KPICard icon="🗑️" label="Bins Serviced Today"   value="31"  unit="bins" delta={-2} />
    </div>

    {/* Trend + zone performance */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>
          Monthly Recycling Rate Trend (%)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
            <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[58, 92]} tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tooltip2 />} />
            <Line type="monotone" dataKey="rate" stroke={C.accentGreen} strokeWidth={2.5} dot={{ fill: C.accentGreen, r: 4, strokeWidth: 0 }} name="Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 16px" }}>
          Performance by Zone
        </p>
        {[
          { zone: "CAS (Overall)",    score: 79, delta: "+3%" },
          { zone: "COB (Overall)",    score: 85, delta: "+6%" },
          { zone: "COLGIS (Overall)", score: 68, delta: "−4%" },
          { zone: "INASIS Route A",   score: 74, delta: "+2%" },
          { zone: "INASIS Route B",   score: 71, delta: "+1%" },
        ].map((z, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: C.textSub, fontSize: 12 }}>{z.zone}</span>
              <span style={{ color: z.delta.startsWith("+") ? C.accentGreen : C.accentRed, fontSize: 11, fontWeight: 600 }}>{z.delta}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 7, background: C.borderLight, borderRadius: 99 }}>
                <div style={{
                  width: `${z.score}%`, height: "100%", borderRadius: 99,
                  background: z.score >= 80 ? C.accentGreen : z.score >= 70 ? C.blue : C.accentAmber,
                }} />
              </div>
              <span style={{ color: C.navy, fontSize: 12, fontWeight: 700, width: 34, textAlign: "right", fontFamily: "'Sora',sans-serif" }}>{z.score}%</span>
            </div>
          </div>
        ))}
      </Card>
    </div>

    {/* Bar chart */}
    <Card>
      <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>
        Daily Collection This Week (kg)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
          <XAxis dataKey="day"   tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis               tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tooltip2 />} />
          <Bar dataKey="collected" fill={C.blue}        radius={[5, 5, 0, 0]} name="Collected" opacity={0.85} />
          <Bar dataKey="recycled"  fill={C.accentGreen} radius={[5, 5, 0, 0]} name="Recycled"  opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

export default Analytics;