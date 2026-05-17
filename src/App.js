import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  surfaceAlt: "#f7f9fc",
  border: "#e2e8f0",
  borderLight: "#eef1f6",
  navy: "#0f2d5e",
  navyMid: "#1a4480",
  blue: "#1e6fc4",
  blueLight: "#3b8fe8",
  bluePale: "#e8f1fb",
  accent: "#0ea5e9",
  accentGreen: "#16a34a",
  accentAmber: "#d97706",
  accentRed: "#dc2626",
  accentOrange: "#ea580c",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#94a3b8",
  gold: "#b8860b",
};

// ── UUM Location Data ─────────────────────────────────────────────────────────
const COLLEGES = {
  CAS: {
    label: "CAS", full: "College of Arts and Sciences",
    color: "#1e6fc4", schools: [
      { code: "SOC",   name: "School of Computing" },
      { code: "SMMTC", name: "School of Multimedia Technology and Communication" },
      { code: "SQS",   name: "School of Quantitative Sciences" },
      { code: "SAPSP", name: "School of Applied Psychology, Social Work and Policy" },
      { code: "SOE",   name: "School of Education" },
      { code: "SLCP",  name: "School of Language, Civilisation and Philosophy" },
      { code: "SCIMPA",name: "School of Creative Industry Management and Performing Arts" },
    ]
  },
  COB: {
    label: "COB", full: "College of Business",
    color: "#0f2d5e", schools: [
      { code: "TISSA", name: "Tunku Puteri Intan Safinaz School of Accountancy" },
      { code: "SBM",   name: "School of Business Management" },
      { code: "SEFB",  name: "School of Economics, Finance and Banking" },
      { code: "STML",  name: "School of Technology Management and Logistics" },
      { code: "IBS",   name: "Islamic Business School" },
      { code: "AGN",   name: "Academy Golf National" },
    ]
  },
  COLGIS: {
    label: "COLGIS", full: "College of Law, Government and International Studies",
    color: "#6d28d9", schools: [
      { code: "SOG",   name: "School of Government" },
      { code: "SOIS",  name: "School of International Studies" },
      { code: "STHEM", name: "School of Tourism, Hospitality and Event Management" },
      { code: "SOL",   name: "School of Law" },
    ]
  },
};

// English label overrides applied inline below

const INASIS_ROUTES = {
  "Laluan A": [
    { id: "MAS",        name: "Kolej MAS",        note: "Khas mahasiswi", lat: 38, lng: 22, female: true },
    { id: "TNB",        name: "Kolej TNB",         note: "",               lat: 34, lng: 30, female: false },
    { id: "Tradewinds", name: "Kolej Tradewinds",  note: "",               lat: 30, lng: 26, female: false },
    { id: "Proton",     name: "Kolej Proton",      note: "",               lat: 26, lng: 35, female: false },
  ],
  "Laluan B": [
    { id: "Petronas",   name: "Kolej Petronas",    note: "",               lat: 42, lng: 48, female: false },
    { id: "SimeDarby",  name: "Kolej Sime Darby",  note: "Khas mahasiswi", lat: 38, lng: 54, female: true },
    { id: "Grantt",     name: "Kolej Grantt",      note: "",               lat: 44, lng: 58, female: false },
    { id: "TM",         name: "Kolej TM",          note: "",               lat: 48, lng: 52, female: false },
    { id: "BSN",        name: "Kolej BSN",         note: "Khas mahasiswi", lat: 52, lng: 46, female: true },
    { id: "MiSC",       name: "Kolej MiSC",        note: "",               lat: 55, lng: 55, female: false },
  ],
  "Laluan C": [
    { id: "Muamalat",   name: "Kolej Muamalat",    note: "Khas mahasiswi", lat: 60, lng: 34, female: true },
    { id: "YAB",        name: "Kolej YAB",         note: "",               lat: 65, lng: 28, female: false },
  ],
  "Laluan D": [
    { id: "BankRakyat", name: "Kolej Bank Rakyat", note: "",               lat: 68, lng: 60, female: false },
    { id: "SMEBank",    name: "Kolej SME Bank",    note: "",               lat: 72, lng: 66, female: false },
  ],
};

// Flatten bins for monitoring
const ALL_BINS = [
  // Academic
  { id: "BIN-SOC-01",   zone: "SOC",    type: "Plastic", fill: 82, weight: 38, temp: 29, status: "critical",  area: "academic" },
  { id: "BIN-SBM-01",   zone: "SBM",    type: "Paper",   fill: 55, weight: 22, temp: 26, status: "moderate",  area: "academic" },
  { id: "BIN-TISSA-01", zone: "TISSA",  type: "Glass",   fill: 33, weight: 14, temp: 25, status: "good",      area: "academic" },
  { id: "BIN-SOG-01",   zone: "SOG",    type: "Organic", fill: 91, weight: 50, temp: 74, status: "fire",      area: "academic" },
  { id: "BIN-SQS-01",   zone: "SQS",    type: "Metal",   fill: 71, weight: 36, temp: 27, status: "warning",   area: "academic" },
  { id: "BIN-IBS-01",   zone: "IBS",    type: "Plastic", fill: 44, weight: 19, temp: 25, status: "good",      area: "academic" },
  // INASIS
  { id: "BIN-MAS-01",   zone: "MAS",    type: "Organic", fill: 88, weight: 47, temp: 31, status: "critical",  area: "inasis" },
  { id: "BIN-TNB-01",   zone: "TNB",    type: "Paper",   fill: 61, weight: 28, temp: 26, status: "warning",   area: "inasis" },
  { id: "BIN-PET-01",   zone: "Petronas",type:"Glass",   fill: 28, weight: 12, temp: 24, status: "good",      area: "inasis" },
  { id: "BIN-TM-01",    zone: "TM",     type: "Plastic", fill: 75, weight: 41, temp: 28, status: "warning",   area: "inasis" },
  { id: "BIN-BSN-01",   zone: "BSN",    type: "Organic", fill: 40, weight: 18, temp: 25, status: "moderate",  area: "inasis" },
  { id: "BIN-BR-01",    zone: "Bank Rakyat",type:"Metal",fill: 58, weight: 32, temp: 26, status: "moderate",  area: "inasis" },
];

const TRUCKS = [
  { id: "UUM-01", driver: "Ahmad Fadzil", status: "Collecting", route: "Laluan A", progress: 70, bins: 3, eta: "8 min" },
  { id: "UUM-02", driver: "Siti Hajar",   status: "En Route",   route: "Laluan B", progress: 35, bins: 5, eta: "22 min" },
  { id: "UUM-03", driver: "Razif Mansor", status: "Idle",       route: "Laluan C", progress: 100, bins: 0, eta: "–" },
  { id: "UUM-04", driver: "Noraini Bt.",  status: "En Route",   route: "Laluan D", progress: 18, bins: 4, eta: "40 min" },
];

const ALERTS = [
  { id: 1, type: "fire",      severity: "critical", bin: "BIN-SOG-01",  zone: "SOG – COLGIS",      msg: "Temperature 74°C — possible fire hazard. Immediate action required.", time: "2m ago",  ack: false },
  { id: 2, type: "overfill",  severity: "critical", bin: "BIN-SOC-01",  zone: "SOC – CAS",         msg: "Fill level 82% — schedule immediate collection.", time: "6m ago",  ack: false },
  { id: 3, type: "overfill",  severity: "critical", bin: "BIN-MAS-01",  zone: "MAS INASIS",        msg: "Fill level 88% — high priority collection needed.", time: "9m ago",  ack: false },
  { id: 4, type: "overfill",  severity: "warning",  bin: "BIN-TM-01",   zone: "TM INASIS",         msg: "Fill level 75% — plan collection within 2 hours.", time: "20m ago", ack: false },
  { id: 5, type: "maintenance",severity: "info",    bin: "BIN-SQS-01",  zone: "SQS – CAS",         msg: "Sensor calibration due — schedule within 48 hours.", time: "1h ago",  ack: true },
  { id: 6, type: "route",     severity: "info",     bin: null,           zone: null,                msg: "AI optimised Laluan B route — estimated 16% fuel saving.", time: "2h ago",  ack: true },
];

const weeklyData = [
  { day: "Isn", collected: 380, recycled: 290 },
  { day: "Sel", collected: 420, recycled: 330 },
  { day: "Rab", collected: 510, recycled: 410 },
  { day: "Kha", collected: 470, recycled: 370 },
  { day: "Jum", collected: 590, recycled: 480 },
  { day: "Sab", collected: 310, recycled: 250 },
  { day: "Ahd", collected: 200, recycled: 160 },
];

const monthlyTrend = [
  { month: "Jan", rate: 64 }, { month: "Feb", rate: 67 }, { month: "Mac", rate: 69 },
  { month: "Apr", rate: 72 }, { month: "Mei", rate: 75 }, { month: "Jun", rate: 78 },
  { month: "Jul", rate: 76 }, { month: "Ogo", rate: 80 }, { month: "Sep", rate: 83 },
  { month: "Okt", rate: 85 }, { month: "Nov", rate: 82 }, { month: "Dis", rate: 87 },
];

const wasteTypes = [
  { name: "Plastik",  value: 30, color: C.blue },
  { name: "Kertas",   value: 22, color: C.accent },
  { name: "Kaca",     value: 18, color: C.accentGreen },
  { name: "Logam",    value: 13, color: C.accentAmber },
  { name: "Organik",  value: 12, color: "#f97316" },
  { name: "E-Waste",  value: 5,  color: C.accentRed },
];

// ── Shared Components ─────────────────────────────────────────────────────────
const statusMeta = {
  good:     { color: C.accentGreen, label: "Baik",     bg: "#dcfce7" },
  moderate: { color: C.blue,        label: "Sederhana", bg: C.bluePale },
  warning:  { color: C.accentAmber, label: "Amaran",   bg: "#fef3c7" },
  critical: { color: C.accentRed,   label: "Kritikal", bg: "#fee2e2" },
  fire:     { color: C.accentOrange,label: "Bahaya Api",bg: "#ffedd5" },
};

const Badge = ({ status }) => {
  const m = statusMeta[status] || statusMeta.good;
  return (
    <span style={{
      background: m.bg, color: m.color, border: `1px solid ${m.color}44`,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      letterSpacing: "0.04em"
    }}>{m.label}</span>
  );
};

const FillBar = ({ value, status }) => {
  const m = statusMeta[status] || statusMeta.good;
  return (
    <div style={{ height: 7, background: C.borderLight, borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${m.color}aa, ${m.color})`,
        transition: "width 0.8s ease"
      }} />
    </div>
  );
};

const Card = ({ children, style = {}, hover }) => (
  <div style={{
    background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
    boxShadow: "0 1px 6px rgba(15,45,94,0.06)", padding: "22px 24px",
    transition: "box-shadow 0.2s, transform 0.2s",
    ...style
  }}
    onMouseEnter={e => { if (hover) { e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,45,94,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
    onMouseLeave={e => { if (hover) { e.currentTarget.style.boxShadow = "0 1px 6px rgba(15,45,94,0.06)"; e.currentTarget.style.transform = "none"; } }}
  >
    {children}
  </div>
);

const SectionLabel = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
    <div style={{ width: 4, height: 20, borderRadius: 99, background: `linear-gradient(180deg, ${C.blue}, ${C.accent})` }} />
    <h2 style={{ color: C.navy, fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>{text}</h2>
  </div>
);

const KPICard = ({ icon, label, value, unit, delta, sub }) => (
  <Card hover>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ color: C.navy, fontSize: 30, fontWeight: 800, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.03em" }}>{value}</span>
          {unit && <span style={{ color: C.textMuted, fontSize: 14 }}>{unit}</span>}
        </div>
        {delta !== undefined && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: delta >= 0 ? C.accentGreen : C.accentRed, fontWeight: 600 }}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% minggu ini
          </p>
        )}
        {sub && <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: 12 }}>{sub}</p>}
      </div>
      <div style={{ background: C.bluePale, borderRadius: 12, padding: "10px 12px", fontSize: 22 }}>{icon}</div>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 16px rgba(15,45,94,0.1)" }}>
      <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0", fontSize: 13, fontWeight: 600 }}>{p.name}: <span style={{ color: C.text }}>{p.value}</span></p>
      ))}
    </div>
  );
};

// ── Section 1: Dashboard Overview ─────────────────────────────────────────────
const Overview = () => {
  const criticalCount = ALL_BINS.filter(b => ["critical","fire"].includes(b.status)).length;
  const unackAlerts = ALERTS.filter(a => !a.ack).length;
  const avgFill = Math.round(ALL_BINS.reduce((s, b) => s + b.fill, 0) / ALL_BINS.length);

  return (
    <div>
      {/* Critical Banner */}
      {criticalCount > 0 && (
        <div style={{
          background: "linear-gradient(90deg, #fee2e2, #fff7ed)",
          border: `1px solid ${C.accentRed}33`,
          borderLeft: `4px solid ${C.accentRed}`,
          borderRadius: 12, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24
        }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div>
            <span style={{ color: C.accentRed, fontWeight: 700, fontSize: 14 }}>Amaran Kritikal</span>
            <span style={{ color: C.textSub, fontSize: 13, marginLeft: 10 }}>
              {criticalCount} tong sampah memerlukan tindakan segera — termasuk amaran kebakaran di SOG
            </span>
          </div>
          <button style={{
            marginLeft: "auto", background: C.accentRed, color: "#fff",
            border: "none", padding: "7px 16px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: 700
          }}>Lihat Sekarang</button>
        </div>
      )}

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        <KPICard icon="🗑️" label="Jumlah Tong" value={ALL_BINS.length} unit="unit" delta={0} />
        <KPICard icon="⚠️" label="Amaran Aktif" value={unackAlerts} unit="amaran" delta={-8} />
        <KPICard icon="📊" label="Purata Isipadu" value={avgFill} unit="%" delta={5} />
        <KPICard icon="🚛" label="Trak Aktif" value={TRUCKS.filter(t=>t.status!=="Idle").length} unit="trak" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>Pengumpulan vs Dikitar Semula (kg) — Minggu Ini</p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accentGreen} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.accentGreen} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="collected" stroke={C.blue} fill="url(#gc)" strokeWidth={2.5} name="Dikumpul" />
              <Area type="monotone" dataKey="recycled" stroke={C.accentGreen} fill="url(#gr)" strokeWidth={2.5} name="Dikitar Semula" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>Jenis Buangan</p>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                {wasteTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={8} formatter={v => <span style={{ color: C.textSub, fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 16px" }}>Status Sistem</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "Masa Aktif IoT",        val: "99.1%",  ok: true },
            { label: "Ketepatan GPS",          val: "98.6%",  ok: true },
            { label: "Kecekapan Laluan",        val: "83.4%",  ok: true },
            { label: "Bateri Sensor",           val: "68%",    ok: false },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.ok ? "#f0fdf4" : "#fffbeb",
              border: `1px solid ${s.ok ? "#bbf7d0" : "#fde68a"}`,
              borderRadius: 12, padding: "16px", textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.ok ? C.accentGreen : C.accentAmber, fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>{s.label}</div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                <span style={{ fontSize: 14 }}>{s.ok ? "✅" : "⚠️"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── Section 2: Bin Monitoring ─────────────────────────────────────────────────
const BinMonitoring = () => {
  const [filter, setFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = ALL_BINS.filter(b => {
    const statusOk = filter === "all" || b.status === filter;
    const areaOk = areaFilter === "all" || b.area === areaFilter;
    return statusOk && areaOk;
  });

  return (
    <div>
      <SectionLabel text="Pemantauan Tong Pintar" />
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: -10 }}>Data sensor IoT masa nyata — isipadu, berat dan suhu</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
          {["all","academic","inasis"].map(a => (
            <button key={a} onClick={() => setAreaFilter(a)} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: areaFilter === a ? C.navy : "transparent",
              color: areaFilter === a ? "#fff" : C.textMuted,
            }}>
              {a === "all" ? "Semua" : a === "academic" ? "🏛️ Akademik" : "🏠 INASIS"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all","critical","fire","warning","moderate","good"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${filter === s ? (statusMeta[s]?.color || C.navy) : C.border}`,
              background: filter === s ? (statusMeta[s]?.bg || C.bluePale) : C.surface,
              color: filter === s ? (statusMeta[s]?.color || C.navy) : C.textMuted,
              letterSpacing: "0.04em"
            }}>
              {s === "all" ? "Semua Status" : (statusMeta[s]?.label || s)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
        {filtered.map(bin => {
          const m = statusMeta[bin.status];
          const isSelected = selected?.id === bin.id;
          const tempAlert = bin.temp > 55;
          return (
            <div key={bin.id} onClick={() => setSelected(isSelected ? null : bin)} style={{
              background: C.surface, borderRadius: 14, padding: "20px",
              border: `1.5px solid ${isSelected ? m.color : C.border}`,
              boxShadow: isSelected ? `0 4px 20px ${m.color}22` : "0 1px 6px rgba(15,45,94,0.05)",
              cursor: "pointer", transition: "all 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ color: C.blue, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12, margin: 0 }}>{bin.id}</p>
                  <p style={{ color: C.navy, fontWeight: 700, margin: "3px 0 1px", fontSize: 15 }}>{bin.zone}</p>
                  <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>{bin.type}</p>
                </div>
                <Badge status={bin.status} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>Isipadu</span>
                  <span style={{ color: C.navy, fontWeight: 700, fontSize: 13, fontFamily: "'Sora', sans-serif" }}>{bin.fill}%</span>
                </div>
                <FillBar value={bin.fill} status={bin.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: C.surfaceAlt, borderRadius: 9, padding: "10px 12px" }}>
                  <p style={{ color: C.textMuted, fontSize: 10, margin: "0 0 3px", fontWeight: 600 }}>⚖️ BERAT</p>
                  <p style={{ color: C.navy, fontWeight: 700, fontSize: 14, margin: 0, fontFamily: "'Sora', sans-serif" }}>{bin.weight} kg</p>
                </div>
                <div style={{
                  background: tempAlert ? "#fff7ed" : C.surfaceAlt,
                  border: tempAlert ? `1px solid ${C.accentAmber}44` : "none",
                  borderRadius: 9, padding: "10px 12px"
                }}>
                  <p style={{ color: tempAlert ? C.accentOrange : C.textMuted, fontSize: 10, margin: "0 0 3px", fontWeight: 600 }}>🌡️ SUHU</p>
                  <p style={{ color: tempAlert ? C.accentOrange : C.navy, fontWeight: 700, fontSize: 14, margin: 0, fontFamily: "'Sora', sans-serif" }}>
                    {bin.temp}°C {tempAlert && "⚠️"}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "9px", background: C.bluePale, border: `1px solid ${C.blue}33`, color: C.blue, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>📋 Butiran</button>
                  <button style={{ flex: 1, padding: "9px", background: C.navy, border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>🚛 Hantar Trak</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Section 3: Route Optimization ────────────────────────────────────────────
const RouteOptimization = () => {
  const [activeRoute, setActiveRoute] = useState(null);
  const routeColors = { "Laluan A": C.blue, "Laluan B": C.accentGreen, "Laluan C": C.accentAmber, "Laluan D": "#8b5cf6" };

  return (
    <div>
      <SectionLabel text="Pengoptimuman Laluan Trak" />
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: -10 }}>Penjejakan GPS masa nyata dan cadangan laluan pintar AI</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 16 }}>
        {/* Truck List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TRUCKS.map(truck => {
            const statusColor = { "En Route": C.blue, "Collecting": C.accentGreen, "Idle": C.textMuted }[truck.status];
            const isActive = activeRoute?.id === truck.id;
            return (
              <div key={truck.id} onClick={() => setActiveRoute(isActive ? null : truck)} style={{
                background: C.surface, borderRadius: 14, padding: "18px 20px",
                border: `1.5px solid ${isActive ? C.blue : C.border}`,
                boxShadow: isActive ? `0 4px 20px ${C.blue}18` : "0 1px 6px rgba(15,45,94,0.05)",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ color: C.blue, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12 }}>{truck.id}</span>
                    <p style={{ color: C.navy, fontWeight: 700, margin: "2px 0 0", fontSize: 14 }}>{truck.driver}</p>
                  </div>
                  <span style={{ background: statusColor + "18", color: statusColor, border: `1px solid ${statusColor}33`, padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{truck.status}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>{truck.route}</span>
                    <span style={{ color: C.navy, fontWeight: 700, fontSize: 12, fontFamily: "'Sora', sans-serif" }}>{truck.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: C.borderLight, borderRadius: 99 }}>
                    <div style={{ width: `${truck.progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.accent})`, borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>⏱ ETA: {truck.eta}</span>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>{truck.bins} tong tertunda</span>
                </div>

                {isActive && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <button style={{ width: "100%", padding: "9px", background: C.navy, border: "none", color: "#fff", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      🔄 Kira Semula Laluan Optimum
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map + AI */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Map */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: 360, position: "relative", background: "linear-gradient(135deg, #e8f1fb 0%, #f0f7ff 40%, #e8f5f0 100%)" }}>
              {/* Grid */}
              {[...Array(7)].map((_, i) => (
                <div key={`h${i}`} style={{ position: "absolute", top: `${i * 15}%`, left: 0, right: 0, height: 1, background: "rgba(15,45,94,0.06)" }} />
              ))}
              {[...Array(9)].map((_, i) => (
                <div key={`v${i}`} style={{ position: "absolute", left: `${i * 12}%`, top: 0, bottom: 0, width: 1, background: "rgba(15,45,94,0.06)" }} />
              ))}

              {/* Route lines */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <polyline points="22%,38% 30%,34% 26%,30% 35%,26%" stroke={routeColors["Laluan A"]} strokeWidth="2.5" fill="none" strokeDasharray="7 4" opacity="0.6" />
                <polyline points="48%,42% 54%,38% 58%,44% 52%,48% 46%,52% 55%,55%" stroke={routeColors["Laluan B"]} strokeWidth="2.5" fill="none" strokeDasharray="7 4" opacity="0.6" />
                <polyline points="34%,60% 28%,65%" stroke={routeColors["Laluan C"]} strokeWidth="2.5" fill="none" strokeDasharray="7 4" opacity="0.6" />
                <polyline points="60%,68% 66%,72%" stroke={routeColors["Laluan D"]} strokeWidth="2.5" fill="none" strokeDasharray="7 4" opacity="0.6" />
              </svg>

              {/* INASIS Bins */}
              {Object.entries(INASIS_ROUTES).flatMap(([route, colleges]) =>
                colleges.map(col => {
                  const bin = ALL_BINS.find(b => b.zone === col.id) || { status: "good" };
                  const m = statusMeta[bin.status];
                  return (
                    <div key={col.id} title={col.name} style={{
                      position: "absolute", left: `${col.lng}%`, top: `${col.lat}%`,
                      transform: "translate(-50%,-50%)", width: 13, height: 13,
                      borderRadius: "50%", background: m.color,
                      border: "2px solid #fff", boxShadow: `0 0 8px ${m.color}66`,
                      cursor: "pointer", zIndex: 2
                    }} />
                  );
                })
              )}

              {/* Trucks */}
              {TRUCKS.map((truck, i) => {
                const positions = [{ l: 28, t: 36 }, { l: 51, t: 45 }, { l: 34, t: 62 }, { l: 62, t: 68 }];
                return (
                  <div key={truck.id} style={{
                    position: "absolute", left: `${positions[i].l}%`, top: `${positions[i].t}%`,
                    transform: "translate(-50%,-50%)", fontSize: 20, cursor: "pointer", zIndex: 3,
                    filter: truck.status === "Idle" ? "grayscale(1) opacity(0.5)" : "none"
                  }} title={`${truck.id} — ${truck.driver}`}>🚛</div>
                );
              })}

              {/* UUM Label */}
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.92)", borderRadius: 9, padding: "8px 14px", border: `1px solid ${C.border}`, backdropFilter: "blur(6px)" }}>
                <span style={{ color: C.navy, fontSize: 12, fontWeight: 800 }}>🏫 UUM Campus — Peta Langkawi</span>
              </div>

              {/* Legend */}
              <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(255,255,255,0.92)", borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.border}`, backdropFilter: "blur(6px)" }}>
                <p style={{ color: C.textMuted, fontSize: 10, margin: "0 0 7px", fontWeight: 700, textTransform: "uppercase" }}>Laluan</p>
                {Object.entries(routeColors).map(([route, color]) => (
                  <div key={route} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <div style={{ width: 20, height: 3, background: color, borderRadius: 99 }} />
                    <span style={{ color: C.textSub, fontSize: 11 }}>{route}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Suggestion */}
          <Card style={{ background: "linear-gradient(135deg, #f0f7ff, #f8fbff)", border: `1.5px solid ${C.blue}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: C.navy, borderRadius: 9, padding: "7px 9px", fontSize: 16 }}>🤖</div>
              <div>
                <p style={{ color: C.navy, fontWeight: 800, margin: 0, fontSize: 14 }}>Cadangan Laluan AI</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>Pengoptimuman automatik berdasarkan status tong masa nyata</p>
              </div>
              <span style={{ marginLeft: "auto", background: C.accentGreen + "18", color: C.accentGreen, border: `1px solid ${C.accentGreen}44`, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>AKTIF</span>
            </div>
            <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 }}>
              Laluan semula untuk <strong style={{ color: C.navy }}>UUM-02</strong> melalui <strong style={{ color: C.navy }}>MAS → Petronas → TM</strong> mengutamakan tong kritikal. Penjimatan bahan api anggaran: <strong style={{ color: C.accentGreen }}>16%</strong>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[{ label: "Jarak Jimat", val: "3.8 km" }, { label: "Masa Jimat", val: "18 min" }, { label: "CO₂ Kurang", val: "1.4 kg" }].map((m, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 10, padding: "11px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div style={{ color: C.navy, fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif" }}>{m.val}</div>
                  <div style={{ color: C.textMuted, fontSize: 10, marginTop: 3 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── Section 4: Analytics ──────────────────────────────────────────────────────
const Analytics = () => (
  <div>
    <SectionLabel text="Analitik & Laporan" />
    <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: -10 }}>Prestasi kitar semula, trend buangan dan kecekapan operasi</p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
      <KPICard icon="♻️" label="Kadar Kitar Semula" value="84" unit="%" delta={4} />
      <KPICard icon="📦" label="Tan Dikumpul (MTD)" value="318" unit="tan" delta={11} />
      <KPICard icon="🗑️" label="Tong Dilayan Hari Ini" value="31" unit="tong" delta={-2} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>Trend Kadar Kitar Semula Bulanan (%)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
            <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[58, 92]} tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="rate" stroke={C.accentGreen} strokeWidth={2.5} dot={{ fill: C.accentGreen, r: 4, strokeWidth: 0 }} name="Kadar %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 16px" }}>Prestasi Kolej / Kolej Kediaman</p>
        {[
          { zone: "CAS (Keseluruhan)",  score: 79, delta: "+3%" },
          { zone: "COB (Keseluruhan)",  score: 85, delta: "+6%" },
          { zone: "COLGIS (Keseluruhan)",score: 68,delta: "−4%" },
          { zone: "INASIS Laluan A",    score: 74, delta: "+2%" },
          { zone: "INASIS Laluan B",    score: 71, delta: "+1%" },
        ].map((z, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: C.textSub, fontSize: 12 }}>{z.zone}</span>
              <span style={{ color: z.delta.startsWith("+") ? C.accentGreen : C.accentRed, fontSize: 11, fontWeight: 600 }}>{z.delta}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 7, background: C.borderLight, borderRadius: 99 }}>
                <div style={{ width: `${z.score}%`, height: "100%", background: z.score >= 80 ? C.accentGreen : z.score >= 70 ? C.blue : C.accentAmber, borderRadius: 99 }} />
              </div>
              <span style={{ color: C.navy, fontSize: 12, fontWeight: 700, width: 34, textAlign: "right", fontFamily: "'Sora', sans-serif" }}>{z.score}%</span>
            </div>
          </div>
        ))}
      </Card>
    </div>

    <Card>
      <p style={{ color: C.textMuted, fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 18px" }}>Pengumpulan Harian Minggu Ini (kg)</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
          <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="collected" fill={C.blue} radius={[5,5,0,0]} name="Dikumpul" opacity={0.85} />
          <Bar dataKey="recycled" fill={C.accentGreen} radius={[5,5,0,0]} name="Dikitar Semula" opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// ── Section 5: Alerts ─────────────────────────────────────────────────────────
const AlertCenter = ({ alerts, setAlerts }) => {
  const ack = id => setAlerts(p => p.map(a => a.id === id ? { ...a, ack: true } : a));
  const dismiss = id => setAlerts(p => p.filter(a => a.id !== id));
  const unread = alerts.filter(a => !a.ack).length;
  const iconMap = { fire: "🔥", overfill: "📊", maintenance: "🔧", route: "🗺️" };
  const colorMap = { critical: C.accentRed, warning: C.accentAmber, info: C.blue };
  const bgMap = { critical: "#fee2e2", warning: "#fef3c7", info: C.bluePale };

  return (
    <div>
      <SectionLabel text="Pusat Amaran & Notifikasi" />
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: -10 }}>Semak dan uruskan insiden sistem secara masa nyata</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Belum Disahkan", val: unread, color: C.accentRed, bg: "#fee2e2", icon: "🔔" },
          { label: "Isu Kritikal", val: alerts.filter(a=>a.severity==="critical").length, color: C.accentAmber, bg: "#fef3c7", icon: "⚠️" },
          { label: "Selesai Hari Ini", val: 9, color: C.accentGreen, bg: "#dcfce7", icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textSub, fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {alerts.map(alert => {
          const bc = colorMap[alert.severity];
          return (
            <div key={alert.id} style={{
              background: alert.ack ? C.surfaceAlt : bgMap[alert.severity],
              border: `1px solid ${alert.ack ? C.border : bc + "44"}`,
              borderLeft: `4px solid ${alert.ack ? C.border : bc}`,
              borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              opacity: alert.ack ? 0.65 : 1, transition: "all 0.3s"
            }}>
              <span style={{ fontSize: 22 }}>{iconMap[alert.type]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ background: bc + "22", color: bc, border: `1px solid ${bc}44`, padding: "2px 9px", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{alert.severity}</span>
                  {alert.bin && <span style={{ color: C.blue, fontWeight: 700, fontSize: 12, fontFamily: "'Sora', sans-serif" }}>{alert.bin}</span>}
                  {alert.zone && <span style={{ color: C.textMuted, fontSize: 12 }}>· {alert.zone}</span>}
                </div>
                <p style={{ color: alert.ack ? C.textMuted : C.text, margin: 0, fontSize: 14, fontWeight: 500 }}>{alert.msg}</p>
                <p style={{ color: C.textMuted, margin: "4px 0 0", fontSize: 11 }}>🕐 {alert.time}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!alert.ack && (
                  <button onClick={() => ack(alert.id)} style={{ padding: "7px 14px", background: C.accentGreen, border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                    ✓ Sahkan
                  </button>
                )}
                <button onClick={() => dismiss(alert.id)} style={{ padding: "7px 14px", background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                  ✕
                </button>
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: C.accentGreen, fontSize: 18, fontWeight: 800 }}>Semua Bersih</p>
            <p style={{ color: C.textMuted, fontSize: 14 }}>Tiada amaran aktif — sistem beroperasi dengan normal</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("overview");
  const [alerts, setAlerts] = useState(ALERTS);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unread = alerts.filter(a => !a.ack).length;

  const navItems = [
    { id: "overview",  icon: "⬡",  label: "Gambaran Umum" },
    { id: "bins",      icon: "🗑️",  label: "Pemantauan Tong" },
    { id: "routes",    icon: "🚛",  label: "Laluan Trak" },
    { id: "analytics", icon: "📊", label: "Analitik" },
    { id: "alerts",    icon: "🔔", label: "Amaran", badge: unread },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Noto+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: ${C.bg}; color: ${C.text}; font-family: 'Noto Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        button { font-family: inherit; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <aside style={{
          width: 240, background: C.navy, minHeight: "100vh",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "3px 0 20px rgba(15,45,94,0.15)"
        }}>
          {/* Brand */}
          <div style={{ padding: "28px 24px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: "linear-gradient(135deg, #1e6fc4, #0ea5e9)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
              }}>♻</div>
              <div>
                <div style={{ color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>EcoTrack UUM</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2, letterSpacing: "0.04em" }}>SMART WASTE SYSTEM</div>
              </div>
            </div>
          </div>

          {/* College summary */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Kolej</p>
            {Object.entries(COLLEGES).map(([key, col]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color === C.blue ? "#3b8fe8" : col.color === C.navy ? "#6d9fd4" : "#a78bfa" }} />
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600 }}>{col.label}</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{col.schools.length} sekolah</span>
              </div>
            ))}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {navItems.map(item => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => setSection(item.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10, marginBottom: 3,
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none", cursor: "pointer", transition: "all 0.18s",
                  textAlign: "left"
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ color: active ? "#fff" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: active ? 700 : 400, flex: 1 }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{ background: C.accentRed, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 7px", animation: "pulse 2s infinite" }}>{item.badge}</span>
                  )}
                  {active && <div style={{ width: 3, height: 16, borderRadius: 99, background: "#3b8fe8", marginLeft: "auto" }} />}
                </button>
              );
            })}
          </nav>

          {/* Live indicator */}
          <div style={{ padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentGreen, animation: "pulse 2s infinite" }} />
              <span style={{ color: C.accentGreen, fontSize: 11, fontWeight: 700 }}>SISTEM AKTIF</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "'Sora', sans-serif" }}>
              {time.toLocaleTimeString("ms-MY")}
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2 }}>
              {time.toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <header style={{
            background: C.surface, borderBottom: `1px solid ${C.border}`,
            padding: "0 32px", height: 66,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 50,
            boxShadow: "0 1px 8px rgba(15,45,94,0.06)"
          }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: C.navy, fontFamily: "'Sora', sans-serif", margin: 0, letterSpacing: "-0.02em" }}>
                Sistem Pengurusan Sisa Pintar
              </h1>
              <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Universiti Utara Malaysia — Kampus Sintok, Kedah</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Alert pill */}
              {unread > 0 && (
                <button onClick={() => setSection("alerts")} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#fee2e2", border: `1px solid ${C.accentRed}33`,
                  borderRadius: 99, padding: "6px 14px", cursor: "pointer",
                  animation: "pulse 3s infinite"
                }}>
                  <span style={{ color: C.accentRed, fontSize: 14 }}>🔔</span>
                  <span style={{ color: C.accentRed, fontSize: 12, fontWeight: 700 }}>{unread} Amaran Baru</span>
                </button>
              )}

              <div style={{ width: 1, height: 32, background: C.border }} />

              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.navy, fontSize: 14, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
                  {time.toLocaleTimeString("ms-MY")}
                </div>
                <div style={{ color: C.textMuted, fontSize: 10 }}>Masa Tempatan Malaysia</div>
              </div>

              <div style={{ width: 1, height: 32, background: C.border }} />

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1a4480, #1e6fc4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff" }}>👤</div>
                <div>
                  <div style={{ color: C.navy, fontSize: 12, fontWeight: 700 }}>Pentadbir UUM</div>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>Bahagian Harta Bina</div>
                </div>
              </div>
            </div>
          </header>

          {/* Page */}
          <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            {section === "overview"  && <Overview />}
            {section === "bins"      && <BinMonitoring />}
            {section === "routes"    && <RouteOptimization />}
            {section === "analytics" && <Analytics />}
            {section === "alerts"    && <AlertCenter alerts={alerts} setAlerts={setAlerts} />}
          </main>

          {/* Footer */}
          <footer style={{
            padding: "12px 32px", borderTop: `1px solid ${C.border}`,
            background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ color: C.textMuted, fontSize: 11 }}>
              © 2025 UUM EcoTrack — Sistem Pengurusan Sisa Pintar | Kampus Sintok, Kedah
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { label: "Tong Dalam Talian", val: `${ALL_BINS.length}/${ALL_BINS.length}`, ok: true },
                { label: "Trak Aktif", val: `${TRUCKS.filter(t=>t.status!=="Idle").length}/${TRUCKS.length}`, ok: true },
                { label: "Kependaman API", val: "18ms", ok: true },
              ].map((s, i) => (
                <span key={i} style={{ color: s.ok ? C.accentGreen : C.accentAmber, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{s.ok ? "●" : "●"}</span>
                  {s.label}: <strong style={{ fontFamily: "'Sora', sans-serif" }}>{s.val}</strong>
                </span>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}