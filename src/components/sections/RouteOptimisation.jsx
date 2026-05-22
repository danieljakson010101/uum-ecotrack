import { useState, useEffect, useRef } from "react";
import { C } from "../../constants/theme";
import { STATUS } from "../../constants/theme";
import { TRUCKS, ALL_BINS } from "../../constants/data";
import { Card, SectionLabel } from "../ui";

// ── VERIFIED GPS from PDF ─────────────────────────────────────────────────────
const BIN_LOCATIONS = {
  // CAS
  "SOC":    { lat: 6.4683369, lng: 100.5078438, label: "School of Computing" },
  "SMMTC":  { lat: 6.4565322, lng: 100.5077664, label: "School of Multimedia Technology & Communication" },
  "SQS":    { lat: 6.4544773, lng: 100.5075981, label: "School of Quantitative Sciences" },
  "SAPSP":  { lat: 6.4591688, lng: 100.5067679, label: "School of Applied Psychology, Social Work & Policy" },
  "SOE":    { lat: 6.4661938, lng: 100.5076675, label: "School of Education" },
  "SLCP":   { lat: 6.4661402, lng: 100.5066298, label: "School of Language, Civilisation & Philosophy" },
  "SCIMPA": { lat: 6.4554162, lng: 100.5077439, label: "School of Creative Industry Management & Performing Arts" },
  // COB
  "TISSA":  { lat: 6.4644455, lng: 100.5074351, label: "Tunku Puteri Intan Safinaz School of Accountancy" },
  "SBM":    { lat: 6.4636789, lng: 100.5067196, label: "School of Business Management" },
  "SEFB":   { lat: 6.4650708, lng: 100.5066751, label: "School of Economics, Finance & Banking" },
  "STML":   { lat: 6.4533463, lng: 100.5079059, label: "School of Technology Management & Logistics" },
  "IBS":    { lat: 6.4645811, lng: 100.5058878, label: "Islamic Business School" },
  "AGN":    { lat: 6.4803452, lng: 100.5041152, label: "Academy Golf National" },
  // COLGIS
  "SOG":    { lat: 6.4575297, lng: 100.5068906, label: "School of Government" },
  "SOIS":   { lat: 6.4530621, lng: 100.5000859, label: "School of International Studies" },
  "STHEM":  { lat: 6.4543488, lng: 100.4998046, label: "School of Tourism, Hospitality & Event Management" },
  "SOL":    { lat: 6.4582376, lng: 100.5071582, label: "School of Law" },
  // INASIS Route A
  "MAS":        { lat: 6.4560765, lng: 100.5045618, label: "MAS College (INASIS — Laluan A)" },
  "TNB":        { lat: 6.4579241, lng: 100.5036535, label: "TNB College (INASIS — Laluan A)" },
  "Tradewind":  { lat: 6.4593530, lng: 100.5027620, label: "Tradewind College (INASIS — Laluan A)" },
  "Proton":     { lat: 6.4590472, lng: 100.5013800, label: "Proton College (INASIS — Laluan A)" },
  // INASIS Route B
  "Perodua":    { lat: 6.4637375, lng: 100.5009311, label: "Perodua College (INASIS — Laluan B)" },
  "SimeDarby":  { lat: 6.4676173, lng: 100.5000185, label: "Sime Darby College (INASIS — Laluan B)" },
  "BankIslam":  { lat: 6.4673448, lng: 100.4980709, label: "Bank Islam College (INASIS — Laluan B)" },
  "TM":         { lat: 6.4704397, lng: 100.4973145, label: "TM College (INASIS — Laluan B)" },
  "BSN":        { lat: 6.4703984, lng: 100.5007568, label: "BSN College (INASIS — Laluan B)" },
  "MiSC":       { lat: 6.4713575, lng: 100.5004104, label: "MiSC College (INASIS — Laluan B)" },
  // INASIS Route C
  "YAB":        { lat: 6.4814056, lng: 100.5100181, label: "YAB College (INASIS — Laluan C)" },
  "Muamalat":   { lat: 6.4784447, lng: 100.5091189, label: "Muamalat College (INASIS — Laluan C)" },
  // INASIS Route D
  "BankRakyat": { lat: 6.4419177, lng: 100.5281522, label: "Bank Rakyat College (INASIS — Laluan D)" },
  "SMEBank":    { lat: 6.4382003, lng: 100.5304143, label: "SME Bank College (INASIS — Laluan D)" },
};

// Trucks positioned near their current route areas (real GPS)
const TRUCK_LOCATIONS = [
  { ...TRUCKS[0], lat: 6.4579241, lng: 100.5036535 }, // Route A — near TNB
  { ...TRUCKS[1], lat: 6.4676173, lng: 100.5000185 }, // Route B — near Sime Darby
  { ...TRUCKS[2], lat: 6.4636789, lng: 100.5067196 }, // Idle — near SBM
  { ...TRUCKS[3], lat: 6.4419177, lng: 100.5281522 }, // Route D — near Bank Rakyat
];

// ── Status config for bin badges ─────────────────────────────────────────────
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

// ── Shared overlay panel style ────────────────────────────────────────────────
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

    // Route polylines
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

    // Bin markers
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

    // Truck markers
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

      {/* ── Top-right: Bin Status + Trucks ── */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, ...overlayPanel, minWidth: 168 }}>

        {/* Bin Status */}
        <p style={overlayTitle}>
          <span>📍</span> Bin status
        </p>
        {BIN_STATUS_CONFIG.map(({ key, label, dot, bg, tc }) => {
          const count = ALL_BINS.filter(b => b.status === key).length;
          if (count === 0) return null;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#1e293b" }}>{label}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "1px 8px",
                borderRadius: 99, background: bg, color: tc,
              }}>
                {count}
              </span>
            </div>
          );
        })}

        {/* Divider */}
        <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "10px 0" }} />

        {/* Trucks */}
        <p style={{ ...overlayTitle, marginBottom: 8 }}>
          <span>🚛</span> Trucks
        </p>
        {TRUCK_LOCATIONS.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{t.id}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: TRUCK_STATUS_COLORS[t.status] || "#94a3b8" }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom-left: Route legend ── */}
      <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 10, ...overlayPanel }}>
        <p style={overlayTitle}>
          <span>🗺️</span> Routes
        </p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", paddingRight: 2 }}>
          {TRUCKS.map(truck => {
            const sc = TRUCK_STATUS_COLORS[truck.status] || C.textMuted;
            const isActive = activeTruck?.id === truck.id;
            return (
              <Card key={truck.id} highlight={isActive} onClick={() => setActiveTruck(isActive ? null : truck)} style={{ padding: "11px 14px", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <div>
                    <span style={{ color: C.blue, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11 }}>{truck.id}</span>
                    <p style={{ color: C.navy, fontWeight: 700, margin: "1px 0 0", fontSize: 13 }}>{truck.driver}</p>
                  </div>
                  <span style={{
                    background: sc + "18", color: sc,
                    border: `1px solid ${sc}33`, padding: "3px 9px",
                    borderRadius: 99, fontSize: 10, fontWeight: 700,
                  }}>
                    {truck.status}
                  </span>
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
                  <span style={{ color: C.textMuted, fontSize: 11 }}>{truck.bins} bins pending</span>
                </div>
                {isActive && (
                  <div style={{ marginTop: 9, paddingTop: 9, borderTop: `1px solid ${C.border}` }}>
                    <button style={{
                      width: "100%", padding: "7px 0", background: C.navy,
                      border: "none", color: "#fff", borderRadius: 8,
                      cursor: "pointer", fontSize: 11, fontWeight: 700,
                    }}>
                      🔄 Recalculate Optimal Route
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right column: map + AI panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
          <Card style={{ padding: 0, overflow: "hidden", flex: 1, minHeight: 0 }}>
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
        </div>
      </div>
    </div>
  );
};

export default RouteOptimisation;