import { useState } from "react";
import { C, STATUS } from "../../constants/theme";
import { ALL_BINS, TRUCKS } from "../../constants/data";
import { Card, Badge, FillBar, SectionLabel } from "../ui";

// ── Details Modal ─────────────────────────────────────────────────────────────
const DetailsModal = ({ bin, onClose }) => {
  if (!bin) return null;
  const s         = STATUS[bin.status];
  const tempAlert = bin.temp > 55;
  const fillHistory = [
    { time: "06:00", val: 20 }, { time: "08:00", val: 34 },
    { time: "10:00", val: 48 }, { time: "12:00", val: 61 },
    { time: "14:00", val: 73 }, { time: "Now",   val: bin.fill },
  ];
  const maxVal = Math.max(...fillHistory.map(h => h.val));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,45,94,0.45)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, borderRadius: 20, width: "100%", maxWidth: 560,
          boxShadow: "0 24px 80px rgba(15,45,94,0.22)",
          border: `1.5px solid ${C.border}`, overflow: "hidden",
        }}
      >
        {/* Modal header */}
        <div style={{
          background: `linear-gradient(135deg,${C.navy},${C.navyMid})`,
          padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.08em" }}>BIN DETAILS</p>
            <h2 style={{ color: "#fff", margin: 0, fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800 }}>{bin.id}</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", margin: "2px 0 0", fontSize: 13 }}>{bin.zone} · {bin.type} Waste · {bin.area === "academic" ? "🏛 Academic Zone" : "🏠 INASIS"}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge status={bin.status} />
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {/* Key stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
            {[
              { icon: "📊", label: "Fill Level",   val: `${bin.fill}%`,    alert: bin.fill > 80,  alertColor: C.accentRed },
              { icon: "⚖️", label: "Weight",       val: `${bin.weight} kg`, alert: false,          alertColor: null },
              { icon: "🌡️", label: "Temperature", val: `${bin.temp}°C`,   alert: tempAlert,      alertColor: C.accentAmber },
            ].map((m, i) => (
              <div key={i} style={{
                background: m.alert ? m.alertColor + "12" : C.surfaceAlt,
                border: `1px solid ${m.alert ? m.alertColor + "44" : C.borderLight}`,
                borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                <div style={{ color: m.alert ? m.alertColor : C.navy, fontSize: 20, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{m.val}</div>
                <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{m.label}</div>
                {m.alert && <div style={{ color: m.alertColor, fontSize: 10, fontWeight: 700, marginTop: 4 }}>⚠️ Alert</div>}
              </div>
            ))}
          </div>

          {/* Fill history mini-chart */}
          <div style={{ background: C.surfaceAlt, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 14px" }}>Fill Level History — Today</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {fillHistory.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>{h.val}%</div>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${(h.val / maxVal) * 54}px`,
                    background: h.val > 80
                      ? `linear-gradient(180deg,${C.accentRed},${C.accentRed}aa)`
                      : h.val > 60
                        ? `linear-gradient(180deg,${C.accentAmber},${C.accentAmber}aa)`
                        : `linear-gradient(180deg,${C.blue},${C.blue}aa)`,
                  }} />
                  <div style={{ fontSize: 9, color: C.textMuted }}>{h.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Last Collected", val: "3h ago" },
              { label: "Next Scheduled", val: "in 2h" },
              { label: "Sensor Status",  val: "Online ✅" },
              { label: "IoT Battery",    val: "73%" },
            ].map((m, i) => (
              <div key={i} style={{ background: C.surfaceAlt, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.textMuted, fontSize: 12 }}>{m.label}</span>
                <span style={{ color: C.navy, fontWeight: 700, fontSize: 13, fontFamily: "'Sora',sans-serif" }}>{m.val}</span>
              </div>
            ))}
          </div>

          {/* Alert note for critical/fire */}
          {(bin.status === "critical" || bin.status === "fire") && (
            <div style={{
              background: bin.status === "fire" ? "#fff7ed" : "#fee2e2",
              border: `1px solid ${bin.status === "fire" ? C.accentOrange : C.accentRed}44`,
              borderLeft: `4px solid ${bin.status === "fire" ? C.accentOrange : C.accentRed}`,
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18 }}>{bin.status === "fire" ? "🔥" : "🚨"}</span>
              <p style={{ margin: 0, color: C.textSub, fontSize: 13, lineHeight: 1.5 }}>
                {bin.status === "fire"
                  ? `Temperature of ${bin.temp}°C detected. Possible combustion risk — do not manually handle. Safety team has been alerted.`
                  : `Fill level at ${bin.fill}% — bin is near capacity. Immediate collection recommended to prevent overflow.`}
              </p>
            </div>
          )}

          <button onClick={onClose} style={{
            width: "100%", padding: "11px 0", background: C.navy, color: "#fff",
            border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
            fontFamily: "'Sora',sans-serif",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Dispatch Modal ────────────────────────────────────────────────────────────
const DispatchModal = ({ bin, onClose }) => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [dispatched, setDispatched]       = useState(false);
  if (!bin) return null;

  const availableTrucks = TRUCKS.filter(t => t.status !== "Collecting");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,45,94,0.45)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, borderRadius: 20, width: "100%", maxWidth: 500,
          boxShadow: "0 24px 80px rgba(15,45,94,0.22)",
          border: `1.5px solid ${C.border}`, overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg,${C.navy},${C.navyMid})`,
          padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.08em" }}>DISPATCH REQUEST</p>
            <h2 style={{ color: "#fff", margin: 0, fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800 }}>🚛 Send Truck to {bin.id}</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: "3px 0 0", fontSize: 12 }}>{bin.zone} · Fill: {bin.fill}% · {bin.type}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ padding: "22px 26px" }}>
          {dispatched ? (
            /* Success state */
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
              <h3 style={{ color: C.accentGreen, fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Dispatched!</h3>
              <p style={{ color: C.textSub, fontSize: 14, margin: "0 0 4px" }}>
                <strong style={{ color: C.navy }}>{selectedTruck.id}</strong> ({selectedTruck.driver}) is heading to <strong style={{ color: C.navy }}>{bin.zone}</strong>.
              </p>
              <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 24px" }}>
                Estimated arrival: <strong>{selectedTruck.eta !== "—" ? selectedTruck.eta : "15 min"}</strong>
              </p>
              <button onClick={onClose} style={{ padding: "11px 32px", background: C.navy, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Priority note */}
              <div style={{
                background: bin.fill > 80 ? "#fee2e2" : "#fef3c7",
                border: `1px solid ${bin.fill > 80 ? C.accentRed : C.accentAmber}44`,
                borderLeft: `4px solid ${bin.fill > 80 ? C.accentRed : C.accentAmber}`,
                borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>{bin.fill > 80 ? "🚨" : "⚠️"}</span>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13 }}>
                  {bin.fill > 80
                    ? `Critical fill level (${bin.fill}%) — immediate collection needed.`
                    : `Fill level at ${bin.fill}% — collection recommended soon.`}
                </p>
              </div>

              {/* Truck list */}
              <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>
                Select Available Truck
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {availableTrucks.map(truck => {
                  const isSelected   = selectedTruck?.id === truck.id;
                  const statusColor  = truck.status === "En Route" ? C.blue : C.textMuted;
                  return (
                    <div
                      key={truck.id}
                      onClick={() => setSelectedTruck(isSelected ? null : truck)}
                      style={{
                        border: `2px solid ${isSelected ? C.blue : C.border}`,
                        background: isSelected ? C.bluePale : C.surfaceAlt,
                        borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 12,
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 22 }}>🚛</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: C.navy, fontWeight: 700, fontSize: 14, fontFamily: "'Sora',sans-serif" }}>{truck.id}</span>
                          <span style={{ background: statusColor + "18", color: statusColor, border: `1px solid ${statusColor}33`, padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{truck.status}</span>
                        </div>
                        <div style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>
                          Driver: <strong style={{ color: C.textSub }}>{truck.driver}</strong> · {truck.route} · {truck.bins} bins pending
                        </div>
                      </div>
                      {isSelected && <span style={{ color: C.blue, fontSize: 18 }}>✓</span>}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "11px 0", background: C.surfaceAlt,
                  border: `1px solid ${C.border}`, color: C.textMuted,
                  borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>
                  Cancel
                </button>
                <button
                  onClick={() => selectedTruck && setDispatched(true)}
                  style={{
                    flex: 2, padding: "11px 0",
                    background: selectedTruck ? C.navy : C.borderLight,
                    border: "none",
                    color: selectedTruck ? "#fff" : C.textMuted,
                    borderRadius: 10, cursor: selectedTruck ? "pointer" : "not-allowed",
                    fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                  }}
                >
                  🚛 Confirm Dispatch
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main BinMonitoring Component ──────────────────────────────────────────────
const BinMonitoring = () => {
  const [filter,      setFilter]      = useState("all");
  const [areaFilter,  setAreaFilter]  = useState("all");
  const [selected,    setSelected]    = useState(null);
  const [detailsBin,  setDetailsBin]  = useState(null);
  const [dispatchBin, setDispatchBin] = useState(null);

  const visible = ALL_BINS.filter(b =>
    (filter === "all" || b.status === filter) &&
    (areaFilter === "all" || b.area === areaFilter)
  );

  return (
    <div>
      <SectionLabel title="Smart Bin Monitoring" subtitle="Real-time IoT sensor data — fill level, weight and temperature" />

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>

        {/* Area filters — box 1 */}
        <div style={{ display: "flex", gap: 4, background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
          {[["all", "All"], ["academic", "🏛 Academic"], ["inasis", "🏠 INASIS"]].map(([val, lbl]) => (
            <button key={val} onClick={() => setAreaFilter(val)} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer",
              background: areaFilter === val ? C.navy : "transparent",
              color:      areaFilter === val ? "#fff" : C.textMuted,
            }}>{lbl}</button>
          ))}
        </div>

        {/* Status filters — box 2 */}
        <div style={{ display: "flex", gap: 4, background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
          {["all", "critical", "fire", "warning", "moderate", "good"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer",
              border: "none",
              background: filter === s ? (s === "all" ? C.navy : (STATUS[s]?.bg || C.bluePale)) : "transparent",
              color:      filter === s ? (s === "all" ? "#fff" : (STATUS[s]?.color || C.navy)) : C.textMuted,
              letterSpacing: "0.04em",
            }}>
              {s === "all" ? "All Status" : STATUS[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Bin grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
        {visible.map(bin => {
          const isActive  = selected?.id === bin.id;
          const tempAlert = bin.temp > 55;
          return (
            <Card key={bin.id} highlight={isActive} onClick={() => setSelected(isActive ? null : bin)} style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ color: C.blue, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12, margin: 0 }}>{bin.id}</p>
                  <p style={{ color: C.navy, fontWeight: 700, margin: "3px 0 1px", fontSize: 15 }}>{bin.zone}</p>
                  <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>{bin.type}</p>
                </div>
                <Badge status={bin.status} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>Fill Level</span>
                  <span style={{ color: C.navy, fontWeight: 700, fontSize: 13, fontFamily: "'Sora',sans-serif" }}>{bin.fill}%</span>
                </div>
                <FillBar value={bin.fill} status={bin.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: C.surfaceAlt, borderRadius: 9, padding: "10px 12px" }}>
                  <p style={{ color: C.textMuted, fontSize: 10, margin: "0 0 3px", fontWeight: 700 }}>⚖️ WEIGHT</p>
                  <p style={{ color: C.navy, fontWeight: 700, fontSize: 14, margin: 0, fontFamily: "'Sora',sans-serif" }}>{bin.weight} kg</p>
                </div>
                <div style={{
                  background: tempAlert ? "#fff7ed" : C.surfaceAlt,
                  border: tempAlert ? `1px solid ${C.accentAmber}44` : "none",
                  borderRadius: 9, padding: "10px 12px",
                }}>
                  <p style={{ color: tempAlert ? C.accentOrange : C.textMuted, fontSize: 10, margin: "0 0 3px", fontWeight: 700 }}>🌡️ TEMP</p>
                  <p style={{ color: tempAlert ? C.accentOrange : C.navy, fontWeight: 700, fontSize: 14, margin: 0, fontFamily: "'Sora',sans-serif" }}>
                    {bin.temp}°C {tempAlert && "⚠️"}
                  </p>
                </div>
              </div>

              {/* Action buttons — shown when card is selected */}
              {isActive && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                  <button
                    onClick={e => { e.stopPropagation(); setDetailsBin(bin); }}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 9, cursor: "pointer",
                      background: C.bluePale, border: `1px solid ${C.blue}33`,
                      color: C.blue, fontSize: 12, fontWeight: 700,
                    }}
                  >
                    📋 Details
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDispatchBin(bin); }}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 9, cursor: "pointer",
                      background: C.navy, border: "none",
                      color: "#fff", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    🚛 Dispatch
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      {detailsBin  && <DetailsModal  bin={detailsBin}  onClose={() => setDetailsBin(null)} />}
      {dispatchBin && <DispatchModal bin={dispatchBin} onClose={() => setDispatchBin(null)} />}
    </div>
  );
};

export default BinMonitoring;