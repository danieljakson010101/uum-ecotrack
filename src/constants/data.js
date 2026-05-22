// ── UUM Static Data — coordinates verified against PDF ───────────────────────

export const COLLEGES = {
  CAS: {
    label: "CAS", full: "College of Arts and Sciences", color: "#1e6fc4",
    schools: [
      { code: "SOC",    name: "School of Computing" },
      { code: "SMMTC",  name: "School of Multimedia Technology & Communication" },
      { code: "SQS",    name: "School of Quantitative Sciences" },
      { code: "SAPSP",  name: "School of Applied Psychology, Social Work & Policy" },
      { code: "SOE",    name: "School of Education" },
      { code: "SLCP",   name: "School of Language, Civilisation & Philosophy" },
      { code: "SCIMPA", name: "School of Creative Industry Management & Performing Arts" },
    ],
  },
  COB: {
    label: "COB", full: "College of Business", color: "#0f2d5e",
    schools: [
      { code: "TISSA", name: "Tunku Puteri Intan Safinaz School of Accountancy" },
      { code: "SBM",   name: "School of Business Management" },
      { code: "SEFB",  name: "School of Economics, Finance & Banking" },
      { code: "STML",  name: "School of Technology Management & Logistics" },
      { code: "IBS",   name: "Islamic Business School" },
      { code: "AGN",   name: "Academy Golf National" },
    ],
  },
  COLGIS: {
    label: "COLGIS", full: "College of Law, Government & International Studies", color: "#6d28d9",
    schools: [
      { code: "SOG",   name: "School of Government" },
      { code: "SOIS",  name: "School of International Studies" },
      { code: "STHEM", name: "School of Tourism, Hospitality & Event Management" },
      { code: "SOL",   name: "School of Law" },
    ],
  },
};

// ── INASIS routes with REAL GPS from PDF ─────────────────────────────────────
export const INASIS_ROUTES = {
  "Route A": [
    { id: "MAS",       name: "MAS College",       note: "Female only", lat: 6.4560765, lng: 100.5045618, female: true  },
    { id: "TNB",       name: "TNB College",        note: "",            lat: 6.4579241, lng: 100.5036535, female: false },
    { id: "Tradewind", name: "Tradewind College",  note: "",            lat: 6.4593530, lng: 100.5027620, female: false },
    { id: "Proton",    name: "Proton College",     note: "",            lat: 6.4590472, lng: 100.5013800, female: false },
  ],
  "Route B": [
    { id: "Perodua",   name: "Perodua College",    note: "",            lat: 6.4637375, lng: 100.5009311, female: false },
    { id: "SimeDarby", name: "Sime Darby College", note: "Female only", lat: 6.4676173, lng: 100.5000185, female: true  },
    { id: "BankIslam", name: "Bank Islam College", note: "",            lat: 6.4673448, lng: 100.4980709, female: false },
    { id: "TM",        name: "TM College",         note: "",            lat: 6.4704397, lng: 100.4973145, female: false },
    { id: "BSN",       name: "BSN College",        note: "Female only", lat: 6.4703984, lng: 100.5007568, female: true  },
    { id: "MiSC",      name: "MiSC College",       note: "",            lat: 6.4713575, lng: 100.5004104, female: false },
  ],
  "Route C": [
    { id: "YAB",       name: "YAB College",        note: "",            lat: 6.4814056, lng: 100.5100181, female: false },
    { id: "Muamalat",  name: "Muamalat College",   note: "Female only", lat: 6.4784447, lng: 100.5091189, female: true  },
  ],
  "Route D": [
    { id: "BankRakyat", name: "Bank Rakyat College", note: "",          lat: 6.4419177, lng: 100.5281522, female: false },
    { id: "SMEBank",    name: "SME Bank College",    note: "",           lat: 6.4382003, lng: 100.5304143, female: false },
  ],
};

// ── ALL_BINS — 1 bin per real GPS location, statuses varied ──────────────────
export const ALL_BINS = [
  // ── CAS ──────────────────────────────────────────────────────────────────
  { id: "BIN-SOC-01",    zone: "SOC",      type: "Plastic", fill: 82, weight: 38, temp: 29, status: "critical", area: "academic" },
  { id: "BIN-SMMTC-01",  zone: "SMMTC",   type: "Paper",   fill: 47, weight: 20, temp: 26, status: "moderate", area: "academic" },
  { id: "BIN-SQS-01",    zone: "SQS",     type: "Metal",   fill: 71, weight: 36, temp: 27, status: "warning",  area: "academic" },
  { id: "BIN-SAPSP-01",  zone: "SAPSP",   type: "Organic", fill: 38, weight: 16, temp: 25, status: "good",     area: "academic" },
  { id: "BIN-SOE-01",    zone: "SOE",     type: "Paper",   fill: 55, weight: 24, temp: 26, status: "moderate", area: "academic" },
  { id: "BIN-SLCP-01",   zone: "SLCP",    type: "Plastic", fill: 29, weight: 12, temp: 25, status: "good",     area: "academic" },
  { id: "BIN-SCIMPA-01", zone: "SCIMPA",  type: "Glass",   fill: 63, weight: 28, temp: 26, status: "warning",  area: "academic" },

  // ── COB ──────────────────────────────────────────────────────────────────
  { id: "BIN-TISSA-01",  zone: "TISSA",   type: "Glass",   fill: 33, weight: 14, temp: 25, status: "good",     area: "academic" },
  { id: "BIN-SBM-01",    zone: "SBM",     type: "Paper",   fill: 55, weight: 22, temp: 26, status: "moderate", area: "academic" },
  { id: "BIN-SEFB-01",   zone: "SEFB",   type: "Plastic", fill: 78, weight: 35, temp: 28, status: "warning",  area: "academic" },
  { id: "BIN-STML-01",   zone: "STML",   type: "Metal",   fill: 44, weight: 19, temp: 25, status: "good",     area: "academic" },
  { id: "BIN-IBS-01",    zone: "IBS",     type: "Plastic", fill: 44, weight: 19, temp: 25, status: "good",     area: "academic" },
  { id: "BIN-AGN-01",    zone: "AGN",    type: "Organic", fill: 31, weight: 13, temp: 24, status: "good",     area: "academic" },

  // ── COLGIS ───────────────────────────────────────────────────────────────
  { id: "BIN-SOG-01",    zone: "SOG",     type: "Organic", fill: 91, weight: 50, temp: 74, status: "fire",     area: "academic" },
  { id: "BIN-SOIS-01",   zone: "SOIS",   type: "Paper",   fill: 52, weight: 22, temp: 26, status: "moderate", area: "academic" },
  { id: "BIN-STHEM-01",  zone: "STHEM",  type: "Plastic", fill: 67, weight: 30, temp: 27, status: "warning",  area: "academic" },
  { id: "BIN-SOL-01",    zone: "SOL",    type: "Glass",   fill: 40, weight: 17, temp: 25, status: "good",     area: "academic" },

  // ── INASIS Route A ───────────────────────────────────────────────────────
  { id: "BIN-MAS-01",    zone: "MAS",       type: "Organic", fill: 88, weight: 47, temp: 31, status: "critical", area: "inasis" },
  { id: "BIN-TNB-01",    zone: "TNB",       type: "Paper",   fill: 61, weight: 28, temp: 26, status: "warning",  area: "inasis" },
  { id: "BIN-TWD-01",    zone: "Tradewind", type: "Plastic", fill: 35, weight: 15, temp: 25, status: "good",     area: "inasis" },
  { id: "BIN-PRO-01",    zone: "Proton",    type: "Metal",   fill: 49, weight: 21, temp: 26, status: "moderate", area: "inasis" },

  // ── INASIS Route B ───────────────────────────────────────────────────────
  { id: "BIN-PER-01",    zone: "Perodua",   type: "Plastic", fill: 72, weight: 33, temp: 27, status: "warning",  area: "inasis" },
  { id: "BIN-SD-01",     zone: "SimeDarby", type: "Glass",   fill: 28, weight: 12, temp: 24, status: "good",     area: "inasis" },
  { id: "BIN-BI-01",     zone: "BankIslam", type: "Paper",   fill: 58, weight: 25, temp: 26, status: "moderate", area: "inasis" },
  { id: "BIN-TM-01",     zone: "TM",        type: "Plastic", fill: 75, weight: 41, temp: 28, status: "warning",  area: "inasis" },
  { id: "BIN-BSN-01",    zone: "BSN",       type: "Organic", fill: 40, weight: 18, temp: 25, status: "moderate", area: "inasis" },
  { id: "BIN-MISC-01",   zone: "MiSC",      type: "Metal",   fill: 54, weight: 23, temp: 26, status: "moderate", area: "inasis" },

  // ── INASIS Route C ───────────────────────────────────────────────────────
  { id: "BIN-YAB-01",    zone: "YAB",       type: "Paper",   fill: 36, weight: 16, temp: 25, status: "good",     area: "inasis" },
  { id: "BIN-MUA-01",    zone: "Muamalat",  type: "Organic", fill: 66, weight: 29, temp: 27, status: "warning",  area: "inasis" },

  // ── INASIS Route D ───────────────────────────────────────────────────────
  { id: "BIN-BR-01",     zone: "BankRakyat", type: "Metal",  fill: 58, weight: 32, temp: 26, status: "moderate", area: "inasis" },
  { id: "BIN-SME-01",    zone: "SMEBank",    type: "Plastic",fill: 43, weight: 19, temp: 25, status: "good",     area: "inasis" },
];

export const TRUCKS = [
  { id: "UUM-T01", driver: "Ahmad Fadzil",  status: "Collecting", route: "Route A", progress: 70,  bins: 3, eta: "8 min" },
  { id: "UUM-T02", driver: "Siti Hajar",    status: "En Route",   route: "Route B", progress: 35,  bins: 5, eta: "22 min" },
  { id: "UUM-T03", driver: "Razif Mansor",  status: "Idle",       route: "Route C", progress: 100, bins: 0, eta: "—" },
  { id: "UUM-T04", driver: "Noraini Bt.",   status: "En Route",   route: "Route D", progress: 18,  bins: 4, eta: "40 min" },
];

export const ALERTS_INIT = [
  { id: 1, type: "fire",        severity: "critical", bin: "BIN-SOG-01",   zone: "SOG — COLGIS",      msg: "Temperature 74°C detected — possible fire hazard. Immediate action required.", time: "2m ago",  ack: false },
  { id: 2, type: "overfill",    severity: "critical", bin: "BIN-SOC-01",   zone: "SOC — CAS",         msg: "Fill level at 82% — schedule immediate collection.",                          time: "6m ago",  ack: false },
  { id: 3, type: "overfill",    severity: "critical", bin: "BIN-MAS-01",   zone: "MAS — INASIS",      msg: "Fill level at 88% — high priority collection required.",                      time: "9m ago",  ack: false },
  { id: 4, type: "overfill",    severity: "warning",  bin: "BIN-TM-01",    zone: "TM — INASIS",       msg: "Fill level at 75% — plan collection within 2 hours.",                         time: "20m ago", ack: false },
  { id: 5, type: "maintenance", severity: "info",     bin: "BIN-SQS-01",   zone: "SQS — CAS",         msg: "Sensor calibration overdue — please schedule within 48 hours.",                time: "1h ago",  ack: true  },
  { id: 6, type: "route",       severity: "info",     bin: null,            zone: null,                msg: "AI re-optimised Route B — estimated 16% fuel saving applied.",                 time: "2h ago",  ack: true  },
];

export const weeklyData = [
  { day: "Mon", collected: 380, recycled: 290 },
  { day: "Tue", collected: 420, recycled: 330 },
  { day: "Wed", collected: 510, recycled: 410 },
  { day: "Thu", collected: 470, recycled: 370 },
  { day: "Fri", collected: 590, recycled: 480 },
  { day: "Sat", collected: 310, recycled: 250 },
  { day: "Sun", collected: 200, recycled: 160 },
];

export const monthlyTrend = [
  { month: "Jan", rate: 64 }, { month: "Feb", rate: 67 }, { month: "Mar", rate: 69 },
  { month: "Apr", rate: 72 }, { month: "May", rate: 75 }, { month: "Jun", rate: 78 },
  { month: "Jul", rate: 76 }, { month: "Aug", rate: 80 }, { month: "Sep", rate: 83 },
  { month: "Oct", rate: 85 }, { month: "Nov", rate: 82 }, { month: "Dec", rate: 87 },
];

export const wasteTypes = [
  { name: "Plastic",  value: 30, color: "#1e6fc4" },
  { name: "Paper",    value: 22, color: "#0ea5e9" },
  { name: "Glass",    value: 18, color: "#16a34a" },
  { name: "Metal",    value: 13, color: "#d97706" },
  { name: "Organic",  value: 12, color: "#f97316" },
  { name: "E-Waste",  value:  5, color: "#dc2626" },
];