import { useState, useEffect, useRef } from "react";
import { C } from "../../constants/theme";
import { STATUS } from "../../constants/theme";
import { TRUCKS, ALL_BINS } from "../../constants/data";
import { Card, SectionLabel } from "../ui";

// ── VERIFIED GPS from PDF ─────────────────────────────────────────────────────
const BIN_LOCATIONS = {
  "SOC":    { lat: 6.4683369, lng: 100.5078438, label: "School of Computing" },
  "SMMTC":  { lat: 6.4565322, lng: 100.5077664, label: "School of Multimedia Technology & Communication" },
  "SQS":    { lat: 6.4544773, lng: 100.5075981, label: "School of Quantitative Sciences" },
  "SAPSP":  { lat: 6.4591688, lng: 100.5067679, label: "School of Applied Psychology, Social Work & Policy" },
  "SOE":    { lat: 6.4661938, lng: 100.5076675, label: "School of Education" },
  "SLCP":   { lat: 6.4661402, lng: 100.5066298, label: "School of Language, Civilisation & Philosophy" },
  "SCIMPA": { lat: 6.4554162, lng: 100.5077439, label: "School of Creative Industry Management & Performing Arts" },
  "TISSA":  { lat: 6.4644455, lng: 100.5074351, label: "Tunku Puteri Intan Safinaz School of Accountancy" },
  "SBM":    { lat: 6.4636789, lng: 100.5067196, label: "School of Business Management" },
  "SEFB":   { lat: 6.4650708, lng: 100.5066751, label: "School of Economics, Finance & Banking" },
  "STML":   { lat: 6.4533463, lng: 100.5079059, label: "School of Technology Management & Logistics" },
  "IBS":    { lat: 6.4645811, lng: 100.5058878, label: "Islamic Business School" },
  "AGN":    { lat: 6.4803452, lng: 100.5041152, label: "Academy Golf National" },
  "SOG":    { lat: 6.4575297, lng: 100.5068906, label: "School of Government" },
  "SOIS":   { lat: 6.4530621, lng: 100.5000859, label: "School of International Studies" },
  "STHEM":  { lat: 6.4543488, lng: 100.4998046, label: "School of Tourism, Hospitality & Event Management" },
  "SOL":    { lat: 6.4582376, lng: 100.5071582, label: "School of Law" },
  "MAS":        { lat: 6.4560765, lng: 100.5045618, label: "MAS College (INASIS — Laluan A)" },
  "TNB":        { lat: 6.4579241, lng: 100.5036535, label: "TNB College (INASIS — Laluan A)" },
  "Tradewind":  { lat: 6.4593530, lng: 100.5027620, label: "Tradewind College (INASIS — Laluan A)" },
  "Proton":     { lat: 6.4590472, lng: 100.5013800, label: "Proton College (INASIS — Laluan A)" },
  "Perodua":    { lat: 6.4637375, lng: 100.5009311, label: "Perodua College (INASIS — Laluan B)" },
  "SimeDarby":  { lat: 6.4676173, lng: 100.5000185, label: "Sime Darby College (INASIS — Laluan B)" },
  "BankIslam":  { lat: 6.4673448, lng: 100.4980709, label: "Bank Islam College (INASIS — Laluan B)" },
  "TM":         { lat: 6.4704397, lng: 100.4973145, label: "TM College (INASIS — Laluan B)" },
  "BSN":        { lat: 6.4703984, lng: 100.5007568, label: "BSN College (INASIS — Laluan B)" },
  "MiSC":       { lat: 6.4713575, lng: 100.5004104, label: "MiSC College (INASIS — Laluan B)" },
  "YAB":        { lat: 6.4814056, lng: 100.5100181, label: "YAB College (INASIS — Laluan C)" },
  "Muamalat":   { lat: 6.4784447, lng: 100.5091189, label: "Muamalat College (INASIS — Laluan C)" },
  "BankRakyat": { lat: 6.4419177, lng: 100.5281522, label: "Bank Rakyat College (INASIS — Laluan D)" },
  "SMEBank":    { lat: 6.4382003, lng: 100.5304143, label: "SME Bank College (INASIS — Laluan D)" },
};

const TRUCK_LOCATIONS = [
  { ...TRUCKS[0], lat: 6.4579241, lng: 100.5036535 },
  { ...TRUCKS[1], lat: 6.4676173, lng: 100.5000185 },
  { ...TRUCKS[2], lat: 6.4636789, lng: 100.5067196 },
  { ...TRUCKS[3], lat: 6.4419177, lng: 100.5281522 },
];

const BINS_BY_ROUTE = {
  "Route A": ["BIN-MAS-01", "BIN-TNB-01", "BIN-TWD-01"],
  "Route B": ["BIN-PER-01", "BIN-SD-01", "BIN-BI-01", "BIN-TM-01", "BIN-BSN-01"],
  "Route C": ["BIN-YAB-01", "BIN-MUA-01"],
  "Route D": ["BIN-BR-01", "BIN-SME-01", "BIN-SOG-01", "BIN-SOL-01"],
};

const BIN_STATUS_CONFIG = [
  { key: "good",     label: "Good",       dot: "#16a34a", bg: "#dcfce7", tc: "#15803d" },
  { key: "moderate", label: "Moderate",   dot: "#2563eb", bg: "#dbeafe", tc: "#1d4ed8" },
  { key: "warning",  label: "Warning",    dot: "#f59e0b", bg: "#fef3c7", tc: "#b45309" },
  { key: "critical", label: "Critical",   dot: "#dc2626", bg: "#fee2e2", tc: "#b91c1c" },
  { key: "fire",     label: "Fire alert", dot: "#ea580c", bg: "#ffedd5", tc: "#c2410c" },
];

const TRUCK_STATUS_COLORS = {
  "En Route":   "#2563eb",
  "Collecting": "#16a34a",
  "Idle":       "#94a3b8",
};

const ROUTE_CONFIG = [
  { label: "Route A — Laluan A", color: "#1e6fc4" },
  { label: "Route B — Laluan B", color: "#16a34a" },
  { label: "Route C — Laluan C", color: "#d97706" },
  { label: "Route D — Laluan D", color: "#8b5cf6" },
];

const overlayPanel = {
  background: "rgba(255,255,255,0.97)",
  border: "0.5px solid rgba(0,0,0,0.10)",
  borderRadius: 12,
  padding: "12px 14px",
  fontFamily: "'Segoe UI', sans-serif",
};

const overlayTitle = {
  margin: "0 0 9px",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  gap: 5,
};

// ── Collection Details Modal (read-only, admin view) ──────────────────────────
const CollectionDetailsModal = ({ truck, onClose, collectionLog }) => {
  const entries = collectionLog
    .filter(l => l.truckId === truck.id)
    .slice()
    .reverse();

  const bins = BINS_BY_ROUTE[truck.route] || [];
  const collectedBins = entries.map(e => e.binId);
  const pendingBins = bins.filter(b => !collectedBins.includes(b));
  const latest = entries[0];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 20,
        width: 360, maxWidth: "95vw", maxHeight: "85vh", overflowY: "auto",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f2d5e" }}>
              Collection Details — {truck.id}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              {truck.driver} · {truck.route}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", fontSize: 18, lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Info grid */}
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
            {[
              { label: "Driver", val: truck.driver },
              { label: "Truck",  val: truck.id },
              { label: "Route",  val: truck.route },
              { label: "Collected", val: `${collectedBins.length} / ${bins.length} bins` },
            ].map(({ label, val }) => (
              <div key={label}>
                <span style={{ color: "#94a3b8" }}>{label}</span><br />
                <strong style={{ color: "#0f2d5e" }}>{val}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Latest photo (view-only) */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Latest Collection Photo
          </div>
          {latest?.hasPhoto ? (
            <img
              src={latest.photoUrl}
              alt="Collection proof"
              style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "0.5px solid #e2e8f0", display: "block" }}
            />
          ) : (
            <div style={{
              border: "1.5px dashed #cbd5e1", borderRadius: 10, padding: 22,
              textAlign: "center", background: "#f8fafc",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>📷</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>No photo on record yet</div>
            </div>
          )}
        </div>

        {/* GPS row */}
        {latest && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: 8,
            background: "#f0fdf4", borderRadius: 8, marginBottom: 12,
          }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#15803d" }}>Last collection location</div>
              <div style={{ fontSize: 10, color: "#4ade80" }}>{latest.gps}</div>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 700,
              background: "#dcfce7", color: "#15803d", padding: "2px 7px", borderRadius: 99,
            }}>VERIFIED</span>
          </div>
        )}

        {/* Bin checklist */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Bins on this route
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {bins.map(b => {
              const done = collectedBins.includes(b);
              return (
                <div key={b} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: 12, padding: "6px 9px", borderRadius: 7,
                  background: done ? "#f0fdf4" : "#f8fafc",
                  border: `0.5px solid ${done ? "#bbf7d0" : "#e2e8f0"}`,
                }}>
                  <span style={{ color: "#334155" }}>{b}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 99,
                    background: done ? "#dcfce7" : "#f1f5f9",
                    color: done ? "#15803d" : "#94a3b8",
                  }}>
                    {done ? "✓ COLLECTED" : "PENDING"}
                  </span>
                </div>
              );
            })}
            {bins.length === 0 && (
              <div style={{ fontSize: 11, color: "#94a3b8" }}>No bins mapped for this route.</div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        {entries.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Recent activity
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {entries.map((e, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 0", borderBottom: i < entries.length - 1 ? "0.5px solid #f1f5f9" : "none",
                  fontSize: 11,
                }}>
                  <span style={{ color: "#0f2d5e", fontWeight: 600 }}>{e.binId}</span>
                  <span style={{ color: "#94a3b8" }}>⏱ {e.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close action */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: 9, background: "#0f2d5e",
            border: "none", color: "#fff", borderRadius: 8,
            cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ── Collection Log Panel ──────────────────────────────────────────────────────
const CollectionLog = ({ log }) => {
  const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const AVATAR_COLORS = ["#15803d", "#1d4ed8", "#64748b", "#7c3aed"];

  return (
    <Card style={{ padding: "11px 14px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <p style={{ ...overlayTitle, margin: 0 }}><span>📋</span> Driver Collection Log</p>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "#94a3b8" }}>Photo-verified pickups only</span>
      </div>

      {log.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px 0", color: "#94a3b8", fontSize: 12 }}>
          No verified collections yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[...log].reverse().map((entry, i) => {
            const truckIdx = TRUCK_LOCATIONS.findIndex(t => t.id === entry.truckId);
            const avatarBg = AVATAR_COLORS[truckIdx] || "#0f2d5e";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "8px 0",
                borderBottom: i < log.length - 1 ? "0.5px solid #f1f5f9" : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: avatarBg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 700,
                  color: "#fff", flexShrink: 0,
                }}>
                  {initials(entry.driver)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0f2d5e" }}>{entry.driver}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{entry.truckId}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, background: "#dcfce7",
                      color: "#15803d", padding: "1px 6px", borderRadius: 99,
                    }}>✓ VERIFIED</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                    Collected <strong>{entry.binId}</strong> · {entry.route}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>⏱ {entry.timestamp}</div>
                  {entry.gps && (
                    <div style={{ fontSize: 10, color: "#16a34a", marginTop: 1 }}>📍 GPS: {entry.gps}</div>
                  )}
                </div>
                {entry.hasPhoto ? (
                  <img
                    src={entry.photoUrl}
                    alt="Proof"
                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "0.5px solid #e2e8f0", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: "#f1f5f9", border: "1.5px dashed #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>📷</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

// ── Driver Performance Dashboard ──────────────────────────────────────────────
// Helper: try to parse a "timestamp" string (e.g. "10:42 AM") into minutes-since-midnight.
// Falls back to null if it can't be parsed, so averages degrade gracefully.
const parseTimeToMinutes = (timestamp) => {
  if (!timestamp) return null;
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(timestamp);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (period) {
    const p = period.toUpperCase();
    if (p === "PM" && h !== 12) h += 12;
    if (p === "AM" && h === 12) h = 0;
  }
  return h * 60 + m;
};

const formatMinutes = (mins) => {
  if (mins == null) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
};

const DriverPerformance = ({ log, truckBins }) => {
  const stats = TRUCK_LOCATIONS.map(truck => {
    const entries = log.filter(l => l.truckId === truck.id);
    const completed = entries.length;

    // Average pickup time = average gap between consecutive verified collections for this truck
    const times = entries
      .map(e => parseTimeToMinutes(e.timestamp))
      .filter(t => t !== null)
      .sort((a, b) => a - b);

    let avgGap = null;
    if (times.length > 1) {
      const gaps = [];
      for (let i = 1; i < times.length; i++) {
        const diff = times[i] - times[i - 1];
        if (diff > 0) gaps.push(diff);
      }
      if (gaps.length > 0) {
        avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      }
    }

    const totalBinsOnRoute = (BINS_BY_ROUTE[truck.route] || []).length;
    const collectedUnique = new Set(entries.map(e => e.binId)).size;
    const missed = Math.max(totalBinsOnRoute - collectedUnique, 0);

    const completionRate = totalBinsOnRoute > 0
      ? Math.round((collectedUnique / totalBinsOnRoute) * 100)
      : 0;

    return {
      id: truck.id,
      driver: truck.driver,
      route: truck.route,
      completed,
      avgGap,
      missed,
      completionRate,
    };
  });

  const totals = stats.reduce((acc, s) => ({
    completed: acc.completed + s.completed,
    missed: acc.missed + s.missed,
  }), { completed: 0, missed: 0 });

  const overallAvgGap = (() => {
    const valid = stats.filter(s => s.avgGap !== null);
    if (valid.length === 0) return null;
    return valid.reduce((a, s) => a + s.avgGap, 0) / valid.length;
  })();

  return (
    <Card style={{ padding: "11px 14px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <p style={{ ...overlayTitle, margin: 0 }}><span>📊</span> Driver Performance Dashboard</p>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "#94a3b8" }}>Management insight</span>
      </div>

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Completed Pickups", val: totals.completed, icon: "✅", color: "#16a34a" },
          { label: "Avg Pickup Gap",    val: formatMinutes(overallAvgGap), icon: "⏱", color: "#1d4ed8" },
          { label: "Missed Pickups",    val: totals.missed, icon: "⚠️", color: "#dc2626" },
        ].map((m, i) => (
          <div key={i} style={{
            background: "#ffffff", borderRadius: 10, padding: "9px 10px",
            textAlign: "center", border: `1px solid ${m.color}22`,
            boxShadow: "0 1px 4px rgba(15,45,94,0.06)",
          }}>
            <div style={{ fontSize: 13, marginBottom: 2 }}>{m.icon}</div>
            <div style={{ color: m.color, fontWeight: 800, fontSize: 15, fontFamily: "'Sora',sans-serif" }}>{m.val}</div>
            <div style={{ color: "#94a3b8", fontSize: 9, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Per-driver breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {stats.map((s, i) => (
          <div key={s.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 9px", borderRadius: 8,
            background: "#f8fafc", border: "0.5px solid #e2e8f0",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f2d5e" }}>{s.driver}</span>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{s.id} · {s.route}</span>
              </div>
              <div style={{ height: 5, background: "#e2e8f0", borderRadius: 99, marginTop: 6 }}>
                <div style={{
                  width: `${s.completionRate}%`, height: "100%",
                  background: s.completionRate >= 75
                    ? "linear-gradient(90deg,#16a34a,#22c55e)"
                    : s.completionRate >= 40
                      ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                      : "linear-gradient(90deg,#dc2626,#ef4444)",
                  borderRadius: 99,
                }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <div style={{ textAlign: "center", minWidth: 38 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{s.completed}</div>
                <div style={{ fontSize: 8, color: "#94a3b8" }}>Done</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 46 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>{formatMinutes(s.avgGap)}</div>
                <div style={{ fontSize: 8, color: "#94a3b8" }}>Avg time</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 38 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.missed > 0 ? "#dc2626" : "#94a3b8" }}>{s.missed}</div>
                <div style={{ fontSize: 8, color: "#94a3b8" }}>Missed</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ── Google Maps component ─────────────────────────────────────────────────────
const UUMGoogleMap = () => {
  const mapRef = useRef(null);
  const mapObj = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) { initMap(); return; }
    const existingScript = document.getElementById("gmaps-script");
    if (existingScript) { existingScript.addEventListener("load", initMap); return; }
    const script = document.createElement("script");
    script.id  = "gmaps-script";
    script.src = "https://maps.googleapis.com/maps/api/js?callback=initUUMMap";
    script.async = true;
    script.defer = true;
    window.initUUMMap = initMap;
    document.head.appendChild(script);
    return () => { delete window.initUUMMap; };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapObj.current) return;
    const UUM_CENTER = { lat: 6.4620, lng: 100.5060 };
    const map = new window.google.maps.Map(mapRef.current, {
      center: UUM_CENTER, zoom: 14, mapTypeId: "roadmap",
      styles: [
        { featureType: "water",          elementType: "geometry",        stylers: [{ color: "#c9e8f5" }] },
        { featureType: "landscape",      elementType: "geometry",        stylers: [{ color: "#f0f4f0" }] },
        { featureType: "road",           elementType: "geometry",        stylers: [{ color: "#ffffff" }] },
        { featureType: "road",           elementType: "geometry.stroke", stylers: [{ color: "#d0d8e0" }] },
        { featureType: "poi",            elementType: "labels",          stylers: [{ visibility: "simplified" }] },
        { featureType: "transit",        elementType: "labels",          stylers: [{ visibility: "off" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9d1d9" }] },
      ],
      disableDefaultUI: false, zoomControl: true, streetViewControl: false,
      mapTypeControl: false, fullscreenControl: true,
    });
    mapObj.current = map;
    const infoWindow = new window.google.maps.InfoWindow();

    const ROUTE_COLORS = { "Route A": "#1e6fc4", "Route B": "#16a34a", "Route C": "#d97706", "Route D": "#8b5cf6" };
    const ROUTE_PATHS  = {
      "Route A": ["MAS", "TNB", "Tradewind", "Proton"],
      "Route B": ["Perodua", "SimeDarby", "BankIslam", "TM", "BSN", "MiSC"],
      "Route C": ["YAB", "Muamalat"],
      "Route D": ["BankRakyat", "SMEBank"],
    };
    Object.entries(ROUTE_PATHS).forEach(([route, zones]) => {
      const path = zones.map(z => BIN_LOCATIONS[z]).filter(Boolean).map(l => ({ lat: l.lat, lng: l.lng }));
      if (path.length < 2) return;
      new window.google.maps.Polyline({
        path, map,
        strokeColor: ROUTE_COLORS[route],
        strokeOpacity: 0.55,
        strokeWeight: 3,
        icons: [{
          icon: { path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 2.5, strokeOpacity: 0.8 },
          offset: "50%",
        }],
      });
    });

    ALL_BINS.forEach(bin => {
      const loc = BIN_LOCATIONS[bin.zone];
      if (!loc) return;
      const s = STATUS[bin.status];
      const svgIcon = {
        path: "M 0,-12 C 4,-12 8,-8 8,-4 C 8,2 0,12 0,12 C 0,12 -8,2 -8,-4 C -8,-8 -4,-12 0,-12 Z",
        fillColor: s.color, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2, scale: 1.3,
        anchor: new window.google.maps.Point(0, 12),
      };
      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng }, map, icon: svgIcon,
        title: `${bin.id} — ${loc.label}`, zIndex: 10,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="font-family:'Segoe UI',sans-serif;padding:4px 2px;min-width:200px">
            <div style="font-weight:700;font-size:13px;color:#0f2d5e;margin-bottom:2px">${bin.id}</div>
            <div style="font-size:11px;color:#475569;margin-bottom:8px">${loc.label}</div>
            <div style="font-size:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div><span style="color:#94a3b8">Fill:</span> <strong style="color:${bin.fill > 80 ? "#dc2626" : "#0f2d5e"}">${bin.fill}%</strong></div>
              <div><span style="color:#94a3b8">Weight:</span> <strong>${bin.weight}kg</strong></div>
              <div><span style="color:#94a3b8">Temp:</span> <strong style="color:${bin.temp > 55 ? "#ea580c" : "#0f2d5e"}">${bin.temp}°C${bin.temp > 55 ? " ⚠️" : ""}</strong></div>
              <div><span style="color:#94a3b8">Type:</span> <strong>${bin.type}</strong></div>
            </div>
            <div style="margin-top:8px">
              <span style="background:${s.bg};color:${s.color};border:1px solid ${s.color}44;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700">${s.label}</span>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });

    TRUCK_LOCATIONS.forEach(truck => {
      const statusColor = TRUCK_STATUS_COLORS[truck.status] || "#94a3b8";
      const truckSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="${statusColor}" stroke="white" stroke-width="2.5"/><text x="18" y="23" text-anchor="middle" font-size="16">🚛</text></svg>`;
      const marker = new window.google.maps.Marker({
        position: { lat: truck.lat, lng: truck.lng }, map,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(truckSVG),
          scaledSize: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(18, 18),
        },
        title: `${truck.id} — ${truck.driver}`, zIndex: 20,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="font-family:'Segoe UI',sans-serif;padding:4px 2px;min-width:170px">
            <div style="font-weight:700;font-size:13px;color:#0f2d5e;margin-bottom:2px">🚛 ${truck.id}</div>
            <div style="font-size:12px;color:#475569;margin-bottom:8px">${truck.driver}</div>
            <div style="font-size:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div><span style="color:#94a3b8">Status:</span> <strong style="color:${statusColor}">${truck.status}</strong></div>
              <div><span style="color:#94a3b8">Route:</span> <strong>${truck.route}</strong></div>
              <div><span style="color:#94a3b8">ETA:</span> <strong>${truck.eta}</strong></div>
              <div><span style="color:#94a3b8">Bins:</span> <strong>${truck.bins} pending</strong></div>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Top-right overlay */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, ...overlayPanel, minWidth: 168 }}>
        <p style={overlayTitle}><span>📍</span> Bin status</p>
        {BIN_STATUS_CONFIG.map(({ key, label, dot, bg, tc }) => {
          const count = ALL_BINS.filter(b => b.status === key).length;
          if (count === 0) return null;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#1e293b" }}>{label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 8px", borderRadius: 99, background: bg, color: tc }}>
                {count}
              </span>
            </div>
          );
        })}
        <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "10px 0" }} />
        <p style={{ ...overlayTitle, marginBottom: 8 }}><span>🚛</span> Trucks</p>
        {TRUCK_LOCATIONS.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{t.id}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: TRUCK_STATUS_COLORS[t.status] || "#94a3b8" }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom-left route legend */}
      <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 10, ...overlayPanel }}>
        <p style={overlayTitle}><span>🗺️</span> Routes</p>
        {ROUTE_CONFIG.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < ROUTE_CONFIG.length - 1 ? 6 : 0 }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: r.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#334155" }}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── RouteOptimisation Page ────────────────────────────────────────────────────
const RouteOptimisation = () => {
  const [activeTruck, setActiveTruck] = useState(null);
  const [modalTruck, setModalTruck] = useState(null);
  const [collectionLog, setCollectionLog] = useState([]);
  const [truckBins, setTruckBins] = useState(() =>
    Object.fromEntries(TRUCKS.map(t => [t.id, t.bins]))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ marginBottom: 10, flexShrink: 0 }}>
        <SectionLabel
          title="Garbage Truck Route Optimisation"
          subtitle="Live GPS tracking on real UUM campus map with AI-powered route recommendations"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 12, flex: 1, minHeight: 0 }}>

        {/* Truck list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", paddingRight: 2, minHeight: 0 }}>
          {TRUCKS.map(truck => {
            const sc = TRUCK_STATUS_COLORS[truck.status] || C.textMuted;
            const isActive = activeTruck?.id === truck.id;
            const verifiedCount = collectionLog.filter(l => l.truckId === truck.id && l.hasPhoto).length;
            const pendingBins = truckBins[truck.id] ?? truck.bins;

            return (
              <Card key={truck.id} highlight={isActive} onClick={() => setActiveTruck(isActive ? null : truck)} style={{ padding: "11px 14px", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                  <div>
                    <span style={{ color: C.blue, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11 }}>{truck.id}</span>
                    <p style={{ color: C.navy, fontWeight: 700, margin: "1px 0 0", fontSize: 13 }}>{truck.driver}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                    <span style={{
                      background: sc + "18", color: sc,
                      border: `1px solid ${sc}33`, padding: "3px 9px",
                      borderRadius: 99, fontSize: 10, fontWeight: 700,
                    }}>
                      {truck.status}
                    </span>
                    {verifiedCount > 0 && (
                      <span style={{
                        fontSize: 9, background: "#dcfce7", color: "#15803d",
                        padding: "1px 6px", borderRadius: 99, fontWeight: 700,
                      }}>
                        ✓ {verifiedCount} verified
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>{truck.route}</span>
                    <span style={{ color: C.navy, fontWeight: 700, fontSize: 11, fontFamily: "'Sora',sans-serif" }}>{truck.progress}%</span>
                  </div>
                  <div style={{ height: 5, background: C.borderLight, borderRadius: 99 }}>
                    <div style={{
                      width: `${truck.progress}%`, height: "100%",
                      background: `linear-gradient(90deg,${C.blue},${C.accent})`, borderRadius: 99,
                    }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textMuted, fontSize: 11 }}>⏱ ETA: {truck.eta}</span>
                  <span style={{ color: C.textMuted, fontSize: 11 }}>{pendingBins} bins pending</span>
                </div>

                {isActive && (
                  <div style={{ marginTop: 9, paddingTop: 9, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalTruck(truck); }}
                      style={{
                        width: "100%", padding: "7px 0", background: C.navy,
                        border: "none", color: "#fff", borderRadius: 8,
                        cursor: "pointer", fontSize: 11, fontWeight: 700,
                      }}
                    >
                      👁 View Collection Details
                    </button>
                    <button style={{
                      width: "100%", padding: "6px 0", background: "#fff",
                      border: `1px solid ${C.blue}`, color: C.blue, borderRadius: 8,
                      cursor: "pointer", fontSize: 11, fontWeight: 600,
                    }}>
                      🔄 Recalculate Optimal Route
                    </button>
                  </div>
                )}
              </Card>
            );
          })}

          {/* Fleet Summary — fills remaining space, gives the left column a finished, balanced look */}
          <Card style={{
            background: "linear-gradient(160deg,#f8fbff,#ffffff)",
            border: `1px solid ${C.border}`,
            flexShrink: 0, padding: "13px 14px", marginTop: 2,
          }}>
            <p style={overlayTitle}><span>🚮</span> Fleet Summary</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 12 }}>
              {[
                { label: "Active Trucks",   val: TRUCKS.filter(t => t.status !== "Idle").length, total: TRUCKS.length, color: C.blue },
                { label: "Avg Route Progress", val: `${Math.round(TRUCKS.reduce((a, t) => a + t.progress, 0) / TRUCKS.length)}%`, color: C.accentGreen },
                { label: "Total Bins Pending", val: TRUCKS.reduce((a, t) => a + t.bins, 0), color: "#dc2626" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.textSub }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: row.color, fontFamily: "'Sora',sans-serif" }}>
                    {row.val}{row.total ? ` / ${row.total}` : ""}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Status Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {Object.entries(
                  TRUCKS.reduce((acc, t) => ({ ...acc, [t.status]: (acc[t.status] || 0) + 1 }), {})
                ).map(([status, count]) => {
                  const sc = TRUCK_STATUS_COLORS[status] || "#94a3b8";
                  return (
                    <div key={status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "#334155", flex: 1 }}>{status}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: sc }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              marginTop: 12, padding: "9px 10px", borderRadius: 8,
              background: "#f0f7ff", border: `1px solid ${C.blue}22`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ fontSize: 11, color: C.textSub, lineHeight: 1.4 }}>
                Fleet is operating at <strong style={{ color: C.navy }}>{Math.round(TRUCKS.reduce((a, t) => a + t.progress, 0) / TRUCKS.length)}%</strong> average route completion.
              </span>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflowY: "auto", paddingRight: 2 }}>
          <Card style={{ padding: 0, overflow: "hidden", flex: "1 1 420px", minHeight: 420 }}>
            <UUMGoogleMap />
          </Card>

          <Card style={{
            background: "linear-gradient(135deg,#f0f7ff,#f8fbff)",
            border: `1.5px solid ${C.blue}33`,
            flexShrink: 0, padding: "11px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ background: C.navy, borderRadius: 8, padding: "5px 7px", fontSize: 14 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: C.navy, fontWeight: 800, margin: 0, fontSize: 13 }}>AI Route Recommendation</p>
                <p style={{ color: C.textMuted, fontSize: 10, margin: 0 }}>Auto-optimised based on real-time bin status</p>
              </div>
              <span style={{
                background: C.accentGreen + "18", color: C.accentGreen,
                border: `1px solid ${C.accentGreen}44`, padding: "2px 9px",
                borderRadius: 99, fontSize: 10, fontWeight: 700,
              }}>ACTIVE</span>
            </div>
            <p style={{ color: C.textSub, fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>
              Rerouting <strong style={{ color: C.navy }}>UUM-T02</strong> via{" "}
              <strong style={{ color: C.navy }}>Perodua → Sime Darby → TM → BSN</strong> prioritises critical bins.
              Estimated fuel saving: <strong style={{ color: C.accentGreen }}>16%</strong>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { label: "Distance Saved", val: "3.8 km", icon: "📍" },
                { label: "Time Saved",     val: "18 min", icon: "⏱" },
                { label: "CO₂ Reduced",   val: "1.4 kg", icon: "🌿" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: "#ffffff", borderRadius: 10, padding: "9px 12px",
                  textAlign: "center", border: `1px solid ${C.blue}22`,
                  boxShadow: "0 1px 4px rgba(15,45,94,0.07)",
                }}>
                  <div style={{ fontSize: 13, marginBottom: 2 }}>{m.icon}</div>
                  <div style={{ color: C.navy, fontWeight: 800, fontSize: 15, fontFamily: "'Sora',sans-serif" }}>{m.val}</div>
                  <div style={{ color: C.textMuted, fontSize: 9, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <CollectionLog log={collectionLog} />

          <DriverPerformance log={collectionLog} truckBins={truckBins} />
        </div>
      </div>

      {modalTruck && (
        <CollectionDetailsModal
          truck={{ ...modalTruck, ...TRUCK_LOCATIONS.find(t => t.id === modalTruck.id) }}
          onClose={() => setModalTruck(null)}
          collectionLog={collectionLog}
        />
      )}
    </div>
  );
};

export default RouteOptimisation;