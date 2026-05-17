import { useState, useEffect, useRef } from "react";
import { C } from "../../constants/theme";
import { STATUS } from "../../constants/theme";
import { TRUCKS, ALL_BINS } from "../../constants/data";
import { Card, SectionLabel } from "../ui";

// ── Real UUM GPS coordinates for each bin zone ────────────────────────────────
// UUM Sintok campus: ~6.4640° N, 100.5066° E
const BIN_LOCATIONS = {
  "SOC":         { lat: 6.4672, lng: 100.5078, label: "School of Computing" },
  "SBM":         { lat: 6.4658, lng: 100.5055, label: "School of Business Management" },
  "TISSA":       { lat: 6.4663, lng: 100.5041, label: "TISSA" },
  "SOG":         { lat: 6.4645, lng: 100.5090, label: "School of Government" },
  "SQS":         { lat: 6.4680, lng: 100.5065, label: "School of Quantitative Sciences" },
  "IBS":         { lat: 6.4651, lng: 100.5030, label: "Islamic Business School" },
  "MAS":         { lat: 6.4620, lng: 100.5010, label: "MAS College (INASIS)" },
  "TNB":         { lat: 6.4608, lng: 100.5022, label: "TNB College (INASIS)" },
  "Petronas":    { lat: 6.4635, lng: 100.5100, label: "Petronas College (INASIS)" },
  "TM":          { lat: 6.4615, lng: 100.5088, label: "TM College (INASIS)" },
  "BSN":         { lat: 6.4600, lng: 100.5075, label: "BSN College (INASIS)" },
  "Bank Rakyat": { lat: 6.4592, lng: 100.5110, label: "Bank Rakyat College (INASIS)" },
};

const TRUCK_LOCATIONS = [
  { ...TRUCKS[0], lat: 6.4625, lng: 100.5014 },
  { ...TRUCKS[1], lat: 6.4638, lng: 100.5096 },
  { ...TRUCKS[2], lat: 6.4682, lng: 100.5060 },
  { ...TRUCKS[3], lat: 6.4598, lng: 100.5108 },
];

const ROUTE_COLORS = {
  "Route A": "#1e6fc4",
  "Route B": "#16a34a",
  "Route C": "#d97706",
  "Route D": "#8b5cf6",
};

// ── Google Maps component ─────────────────────────────────────────────────────
const UUMGoogleMap = () => {
  const mapRef    = useRef(null);
  const mapObj    = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    // Load Google Maps JS API (no key = limited but works for embed/display)
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const existingScript = document.getElementById("gmaps-script");
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    const script = document.createElement("script");
    script.id  = "gmaps-script";
    // Use Maps Embed static tiles via iframe fallback below if API key unavailable
    script.src = "https://maps.googleapis.com/maps/api/js?callback=initUUMMap";
    script.async = true;
    script.defer = true;
    window.initUUMMap = initMap;
    document.head.appendChild(script);

    return () => { delete window.initUUMMap; };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapObj.current) return;
    const UUM_CENTER = { lat: 6.4640, lng: 100.5066 };

    const map = new window.google.maps.Map(mapRef.current, {
      center:    UUM_CENTER,
      zoom:      15,
      mapTypeId: "roadmap",
      styles: [
        { featureType: "poi.school",   elementType: "labels", stylers: [{ visibility: "on" }] },
        { featureType: "water",        elementType: "geometry", stylers: [{ color: "#c9e8f5" }] },
        { featureType: "landscape",    elementType: "geometry", stylers: [{ color: "#f0f4f0" }] },
        { featureType: "road",         elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road",         elementType: "geometry.stroke", stylers: [{ color: "#d0d8e0" }] },
        { featureType: "road.arterial",elementType: "labels.text.fill", stylers: [{ color: "#555" }] },
        { featureType: "transit",      elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9d1d9" }] },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    mapObj.current = map;
    const infoWindow = new window.google.maps.InfoWindow();

    // Add bin markers
    ALL_BINS.forEach(bin => {
      const loc = BIN_LOCATIONS[bin.zone];
      if (!loc) return;
      const s = STATUS[bin.status];

      const svgIcon = {
        path: "M 0,-12 C 4,-12 8,-8 8,-4 C 8,2 0,12 0,12 C 0,12 -8,2 -8,-4 C -8,-8 -4,-12 0,-12 Z",
        fillColor:   s.color,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
        scale: 1.3,
        anchor: new window.google.maps.Point(0, 12),
      };

      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        icon:  svgIcon,
        title: `${bin.id} — ${loc.label}`,
        zIndex: 10,
      });

      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="font-family:'Segoe UI',sans-serif;padding:4px 2px;min-width:180px">
            <div style="font-weight:800;font-size:13px;color:#0f2d5e;margin-bottom:4px">${bin.id}</div>
            <div style="font-size:12px;color:#475569;margin-bottom:8px">${loc.label}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span style="background:${s.bg};color:${s.color};border:1px solid ${s.color}44;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700">${s.label}</span>
            </div>
            <div style="margin-top:8px;font-size:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div><span style="color:#94a3b8">Fill:</span> <strong style="color:#0f2d5e">${bin.fill}%</strong></div>
              <div><span style="color:#94a3b8">Weight:</span> <strong style="color:#0f2d5e">${bin.weight}kg</strong></div>
              <div><span style="color:#94a3b8">Temp:</span> <strong style="color:${bin.temp>55?"#ea580c":"#0f2d5e"}">${bin.temp}°C${bin.temp>55?" ⚠️":""}</strong></div>
              <div><span style="color:#94a3b8">Type:</span> <strong style="color:#0f2d5e">${bin.type}</strong></div>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });

    // Add truck markers
    TRUCK_LOCATIONS.forEach(truck => {
      const statusColor = { "En Route": "#1e6fc4", "Collecting": "#16a34a", "Idle": "#94a3b8" }[truck.status];
      const truckSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="17" fill="${statusColor}" stroke="white" stroke-width="2.5"/>
          <text x="18" y="23" text-anchor="middle" font-size="16">🚛</text>
        </svg>`;

      const marker = new window.google.maps.Marker({
        position: { lat: truck.lat, lng: truck.lng },
        map,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(truckSVG),
          scaledSize: new window.google.maps.Size(36, 36),
          anchor:     new window.google.maps.Point(18, 18),
        },
        title:  `${truck.id} — ${truck.driver}`,
        zIndex: 20,
      });

      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="font-family:'Segoe UI',sans-serif;padding:4px 2px;min-width:170px">
            <div style="font-weight:800;font-size:13px;color:#0f2d5e;margin-bottom:2px">🚛 ${truck.id}</div>
            <div style="font-size:12px;color:#475569;margin-bottom:8px">${truck.driver}</div>
            <div style="font-size:12px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div><span style="color:#94a3b8">Status:</span> <strong style="color:${statusColor}">${truck.status}</strong></div>
              <div><span style="color:#94a3b8">Route:</span> <strong style="color:#0f2d5e">${truck.route}</strong></div>
              <div><span style="color:#94a3b8">ETA:</span> <strong style="color:#0f2d5e">${truck.eta}</strong></div>
              <div><span style="color:#94a3b8">Bins:</span> <strong style="color:#0f2d5e">${truck.bins} pending</strong></div>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });
  };

  // ── Fallback: embed iframe (no API key needed) ─────────────────────────────
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Google Maps iframe — always works, no API key, real UUM campus */}
      <iframe
        title="UUM Campus Live Map"
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d100.5041!3d6.4640!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b8b1b1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sUniversiti%20Utara%20Malaysia!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy&z=15"
      />

      {/* Bin status overlay — floats on top of the iframe */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "rgba(255,255,255,0.96)", borderRadius: 12,
        padding: "12px 16px", border: `1px solid ${C.border}`,
        backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(15,45,94,0.12)",
        zIndex: 10, minWidth: 170,
      }}>
        <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 800, margin: "0 0 10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>📍 Bin Status</p>
        {Object.entries(STATUS).map(([key, s]) => {
          const count = ALL_BINS.filter(b => b.status === key).length;
          if (count === 0) return null;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ color: C.textSub, fontSize: 11 }}>{s.label}</span>
              </div>
              <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 99 }}>{count}</span>
            </div>
          );
        })}

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10 }}>
          <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 800, margin: "0 0 8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>🚛 Trucks</p>
          {TRUCK_LOCATIONS.map(t => {
            const sc = { "En Route": C.blue, "Collecting": C.accentGreen, "Idle": C.textMuted }[t.status];
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: C.textSub, fontSize: 11 }}>{t.id}</span>
                <span style={{ color: sc, fontSize: 10, fontWeight: 700 }}>{t.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom left badge */}
      <div style={{
        position: "absolute", bottom: 14, left: 14,
        background: "rgba(15,45,94,0.88)", borderRadius: 9,
        padding: "8px 14px", backdropFilter: "blur(6px)", zIndex: 10,
      }}>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>🏫 UUM Sintok Campus — Live</span>
      </div>
    </div>
  );
};

// ── RouteOptimisation Page ────────────────────────────────────────────────────
const RouteOptimisation = () => {
  const [activeTruck, setActiveTruck] = useState(null);

  return (
    <div>
      <SectionLabel title="Garbage Truck Route Optimisation" subtitle="Live GPS tracking on real UUM campus map with AI-powered route recommendations" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 16 }}>

        {/* ── Truck list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TRUCKS.map(truck => {
            const sc = { "En Route": C.blue, "Collecting": C.accentGreen, "Idle": C.textMuted }[truck.status];
            const isActive = activeTruck?.id === truck.id;
            return (
              <Card key={truck.id} highlight={isActive} onClick={() => setActiveTruck(isActive ? null : truck)} style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ color: C.blue, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12 }}>{truck.id}</span>
                    <p style={{ color: C.navy, fontWeight: 700, margin: "2px 0 0", fontSize: 14 }}>{truck.driver}</p>
                  </div>
                  <span style={{ background: sc + "18", color: sc, border: `1px solid ${sc}33`, padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                    {truck.status}
                  </span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>{truck.route}</span>
                    <span style={{ color: C.navy, fontWeight: 700, fontSize: 12, fontFamily: "'Sora',sans-serif" }}>{truck.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: C.borderLight, borderRadius: 99 }}>
                    <div style={{ width: `${truck.progress}%`, height: "100%", background: `linear-gradient(90deg,${C.blue},${C.accent})`, borderRadius: 99 }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>⏱ ETA: {truck.eta}</span>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>{truck.bins} bins pending</span>
                </div>

                {isActive && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <button style={{ width: "100%", padding: 9, background: C.navy, border: "none", color: "#fff", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      🔄 Recalculate Optimal Route
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── Map + AI panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Real Google Map */}
          <Card style={{ padding: 0, overflow: "hidden", height: 420 }}>
            <UUMGoogleMap />
          </Card>

          {/* AI recommendation panel */}
          <Card style={{ background: "linear-gradient(135deg,#f0f7ff,#f8fbff)", border: `1.5px solid ${C.blue}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: C.navy, borderRadius: 9, padding: "7px 9px", fontSize: 16 }}>🤖</div>
              <div>
                <p style={{ color: C.navy, fontWeight: 800, margin: 0, fontSize: 14 }}>AI Route Recommendation</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>Auto-optimised based on real-time bin status</p>
              </div>
              <span style={{ marginLeft: "auto", background: C.accentGreen + "18", color: C.accentGreen, border: `1px solid ${C.accentGreen}44`, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
            </div>
            <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 }}>
              Rerouting <strong style={{ color: C.navy }}>UUM-T02</strong> via <strong style={{ color: C.navy }}>MAS → Petronas → TM</strong> prioritises critical bins.
              Estimated fuel saving: <strong style={{ color: C.accentGreen }}>16%</strong>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { label: "Distance Saved", val: "3.8 km" },
                { label: "Time Saved",     val: "18 min" },
                { label: "CO₂ Reduced",   val: "1.4 kg" },
              ].map((m, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 10, padding: 11, textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div style={{ color: C.navy, fontWeight: 800, fontSize: 16, fontFamily: "'Sora',sans-serif" }}>{m.val}</div>
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

export default RouteOptimisation;