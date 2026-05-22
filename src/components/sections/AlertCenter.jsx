import { useState } from "react";
import { C } from "../../constants/theme";
import { SectionLabel } from "../ui";
import { TRUCKS } from "../../constants/data";

const ICON_MAP  = { fire: "🔥", overfill: "📊", maintenance: "🔧", route: "🗺️" };
const COLOR_MAP = { critical: "#dc2626", warning: "#d97706", info: "#1e6fc4" };
const BG_MAP    = { critical: "#fee2e2", warning: "#fef3c7", info: "#e8f1fb" };

// ── Action Modal ──────────────────────────────────────────────────────────────
const ActionModal = ({ alert, onClose, onComplete }) => {
  const [step, setStep]               = useState("menu");   // menu | calling | dispatching | done
  const [callee, setCallee]           = useState(null);     // "keselamatan" | "bomba"
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [callerNote, setCallerNote]   = useState("");

  const isFire     = alert.type === "fire";
  const isOverfill = alert.type === "overfill";
  const isMaint    = alert.type === "maintenance";
  const isRoute    = alert.type === "route";

  const availTrucks = TRUCKS.filter(t => t.status !== "Collecting");

  const handleDone = () => { onComplete(alert.id); onClose(); };

  // ── colour helpers ──
  const severityColor = COLOR_MAP[alert.severity];
  const severityBg    = BG_MAP[alert.severity];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,45,94,0.5)",
        backdropFilter: "blur(5px)", zIndex: 1100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface, borderRadius: 20, width: "100%", maxWidth: 520,
          boxShadow: "0 28px 80px rgba(15,45,94,0.25)",
          border: `1.5px solid ${C.border}`, overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(135deg,${C.navy},#1a3a6b)`,
          padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, margin: "0 0 3px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Acknowledged — Take Action
            </p>
            <h2 style={{ color: "#fff", margin: 0, fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800 }}>
              {ICON_MAP[alert.type]} {alert.bin || "System Alert"} · {alert.zone || "System"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", margin: "3px 0 0", fontSize: 12 }}>{alert.msg}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: "22px 26px" }}>

          {/* ════════ DONE STATE ════════ */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <h3 style={{ color: C.accentGreen, fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Action Completed!</h3>
              {isFire && <p style={{ color: C.textSub, fontSize: 14, margin: "0 0 4px" }}>{callee === "bomba" ? "Bomba (Fire Brigade)" : "Unit Keselamatan UUM"} has been notified and is en route to <strong style={{ color: C.navy }}>{alert.zone}</strong>.</p>}
              {isOverfill && <p style={{ color: C.textSub, fontSize: 14, margin: "0 0 4px" }}><strong style={{ color: C.navy }}>{selectedTruck?.id}</strong> ({selectedTruck?.driver}) dispatched to <strong style={{ color: C.navy }}>{alert.zone}</strong>. ETA: {selectedTruck?.eta !== "—" ? selectedTruck?.eta : "15 min"}.</p>}
              {isMaint && <p style={{ color: C.textSub, fontSize: 14, margin: "0 0 4px" }}>Maintenance work order created and assigned to Facilities team for <strong style={{ color: C.navy }}>{alert.bin}</strong>.</p>}
              {isRoute && <p style={{ color: C.textSub, fontSize: 14, margin: "0 0 4px" }}>Route optimisation acknowledged and logged.</p>}
              <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 24px" }}>Alert has been marked as resolved.</p>
              <button onClick={handleDone} style={{ padding: "11px 40px", background: C.navy, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                Done
              </button>
            </div>
          )}

          {/* ════════ FIRE — CALL KESELAMATAN ════════ */}
          {step === "menu" && isFire && (
            <>
              <div style={{ background: "#fff7ed", border: "1px solid #f9731644", borderLeft: "4px solid #f97316", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>🚨</span>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13, lineHeight: 1.5 }}>
                  Temperature <strong style={{ color: "#dc2626" }}>74°C</strong> detected at <strong>{alert.zone}</strong>. Possible combustion risk — do not manually handle. Contact Unit Keselamatan immediately.
                </p>
              </div>

              <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Choose Action</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { icon: "📞", label: "Call Unit Keselamatan UUM", sub: "Ext: 3999 · Available 24/7", action: () => { setCallee("keselamatan"); setStep("calling"); }, color: "#dc2626", bg: "#fee2e2" },
                  { icon: "🚒", label: "Alert Bomba (Fire Brigade)", sub: "Call: 994 · Emergency services", action: () => { setCallee("bomba"); setStep("calling"); }, color: "#d97706", bg: "#fef3c7" },
                  { icon: "🚫", label: "Isolate Bin — Restrict Area", sub: "Flag zone as no-entry, notify nearby users", action: () => setStep("done"), color: "#6d28d9", bg: "#f5f3ff" },
                ].map((opt, i) => (
                  <div key={i} onClick={opt.action} style={{
                    border: `2px solid ${opt.color}33`, background: opt.bg,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 26 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: opt.color, fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{opt.sub}</div>
                    </div>
                    <span style={{ color: opt.color, fontSize: 16 }}>›</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose} style={{ width: "100%", padding: "10px 0", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Cancel</button>
            </>
          )}

          {/* ════════ FIRE — CALLING SCREEN ════════ */}
          {step === "calling" && isFire && (() => {
            const isBomba = callee === "bomba";
            const name    = isBomba ? "Bomba (Fire Brigade)" : "Unit Keselamatan UUM";
            const contact = isBomba ? "994 · Emergency line" : "Ext: 3999 · Operator on duty";
            const emoji   = isBomba ? "🚒" : "📞";
            const accent  = isBomba ? "#d97706" : "#dc2626";
            const accentBg= isBomba ? "#fef3c7" : "#fee2e2";
            const confirmLabel = isBomba ? "✓ Confirm — Bomba Alerted" : "✓ Confirm — Keselamatan Notified";
            return (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{emoji}</div>
                <h3 style={{ color: C.navy, fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>
                  {isBomba ? "Alerting" : "Calling"} {name}
                </h3>
                <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 20px" }}>
                  <strong>{contact}</strong>
                </p>

                <div style={{ background: accentBg, border: `1px solid ${accent}33`, borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "left" }}>
                  <p style={{ color: accent, fontWeight: 700, fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Incident Brief</p>
                  <p style={{ color: C.textSub, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    <strong>Bin:</strong> {alert.bin}<br/>
                    <strong>Location:</strong> {alert.zone}<br/>
                    <strong>Temp:</strong> 74°C — Possible fire / combustion<br/>
                    <strong>Time:</strong> {alert.time}
                  </p>
                </div>

                <div style={{ marginBottom: 20, textAlign: "left" }}>
                  <label style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Add Note (optional)</label>
                  <textarea
                    value={callerNote}
                    onChange={e => setCallerNote(e.target.value)}
                    placeholder={isBomba ? "E.g. Smoke visible, fire spreading, evacuation needed..." : "E.g. Smoke visible, bin lid open, students nearby..."}
                    rows={3}
                    style={{ width: "100%", borderRadius: 10, border: `1px solid ${C.border}`, padding: "10px 12px", fontSize: 13, color: C.text, background: C.surfaceAlt, resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("menu")} style={{ flex: 1, padding: "11px 0", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Back</button>
                  <button onClick={() => setStep("done")} style={{ flex: 2, padding: "11px 0", background: accent, border: "none", color: "#fff", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                    {confirmLabel}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ════════ OVERFILL — DISPATCH TRUCK ════════ */}
          {step === "menu" && isOverfill && (
            <>
              <div style={{ background: "#fee2e2", border: "1px solid #dc262633", borderLeft: "4px solid #dc2626", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>🗑️</span>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13 }}>
                  <strong>{alert.bin}</strong> at {alert.zone} is critically full. Dispatch a collection truck now.
                </p>
              </div>

              <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Select Available Truck</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {availTrucks.map(truck => {
                  const isSelected  = selectedTruck?.id === truck.id;
                  const statusColor = truck.status === "En Route" ? C.blue : C.textMuted;
                  return (
                    <div key={truck.id} onClick={() => setSelectedTruck(isSelected ? null : truck)} style={{
                      border: `2px solid ${isSelected ? C.blue : C.border}`,
                      background: isSelected ? "#e8f1fb" : C.surfaceAlt,
                      borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 22 }}>🚛</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: C.navy, fontWeight: 700, fontSize: 14, fontFamily: "'Sora',sans-serif" }}>{truck.id}</span>
                          <span style={{ background: statusColor + "18", color: statusColor, border: `1px solid ${statusColor}33`, padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{truck.status}</span>
                        </div>
                        <div style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>
                          {truck.driver} · {truck.route} · ETA: {truck.eta !== "—" ? truck.eta : "Ready"}
                        </div>
                      </div>
                      {isSelected && <span style={{ color: C.blue, fontSize: 18 }}>✓</span>}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "11px 0", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                <button
                  onClick={() => selectedTruck && setStep("done")}
                  style={{ flex: 2, padding: "11px 0", background: selectedTruck ? C.navy : C.borderLight, border: "none", color: selectedTruck ? "#fff" : C.textMuted, borderRadius: 10, cursor: selectedTruck ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}
                >
                  🚛 Confirm Dispatch
                </button>
              </div>
            </>
          )}

          {/* ════════ MAINTENANCE — WORK ORDER ════════ */}
          {step === "menu" && isMaint && (
            <>
              <div style={{ background: "#e8f1fb", border: "1px solid #1e6fc433", borderLeft: "4px solid #1e6fc4", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>🔧</span>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13 }}>Sensor calibration overdue for <strong>{alert.bin}</strong>. Create a work order for the Facilities team.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { icon: "📋", label: "Create Work Order", sub: "Assign to Facilities & Maintenance Division", color: C.blue, bg: "#e8f1fb" },
                  { icon: "📅", label: "Schedule Sensor Calibration", sub: "Book technician visit within 48 hours", color: "#16a34a", bg: "#dcfce7" },
                ].map((opt, i) => (
                  <div key={i} onClick={() => setStep("done")} style={{
                    border: `2px solid ${opt.color}33`, background: opt.bg,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <span style={{ fontSize: 24 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: opt.color, fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{opt.sub}</div>
                    </div>
                    <span style={{ color: opt.color, fontSize: 16 }}>›</span>
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{ width: "100%", padding: "10px 0", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Cancel</button>
            </>
          )}

          {/* ════════ ROUTE — INFO ONLY ════════ */}
          {step === "menu" && isRoute && (
            <>
              <div style={{ background: "#e8f1fb", border: "1px solid #1e6fc433", borderLeft: "4px solid #1e6fc4", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🗺️</span>
                <p style={{ margin: 0, color: C.textSub, fontSize: 13, lineHeight: 1.5 }}>{alert.msg}</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "11px 0", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Dismiss</button>
                <button onClick={() => setStep("done")} style={{ flex: 2, padding: "11px 0", background: C.navy, border: "none", color: "#fff", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✓ Acknowledge & Log</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// ── AlertCenter ───────────────────────────────────────────────────────────────
const AlertCenter = ({ alerts, setAlerts }) => {
  const [actionAlert, setActionAlert] = useState(null);

  const ack = id => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ack: true } : a));
    const alert = alerts.find(a => a.id === id);
    if (alert) setActionAlert(alert);
  };

  const dismiss = id => setAlerts(prev => prev.filter(a => a.id !== id));

  const completeAction = id =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ack: true, resolved: true } : a));

  const unread = alerts.filter(a => !a.ack).length;

  return (
    <div>
      <SectionLabel title="Alert & Notification Centre" subtitle="Review and manage system incidents in real time" />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Unacknowledged", val: unread,                                               color: "#dc2626", bg: "#fee2e2", icon: "🔔" },
          { label: "Critical Issues", val: alerts.filter(a => a.severity === "critical").length, color: "#d97706", bg: "#fef3c7", icon: "⚠️" },
          { label: "Resolved Today",  val: 9,                                                    color: "#16a34a", bg: "#dcfce7", icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{s.val}</div>
              <div style={{ color: C.textSub, fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {alerts.map(alert => {
          const bc = COLOR_MAP[alert.severity];
          return (
            <div key={alert.id} style={{
              background:   alert.ack ? C.surfaceAlt : BG_MAP[alert.severity],
              border:       `1px solid ${alert.ack ? C.border : bc + "44"}`,
              borderLeft:   `4px solid ${alert.ack ? C.border : bc}`,
              borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              opacity: alert.ack ? 0.6 : 1, transition: "all 0.3s",
            }}>
              <span style={{ fontSize: 22 }}>{ICON_MAP[alert.type]}</span>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ background: bc + "22", color: bc, border: `1px solid ${bc}44`, padding: "2px 9px", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                    {alert.severity}
                  </span>
                  {alert.bin  && <span style={{ color: C.blue, fontWeight: 700, fontSize: 12, fontFamily: "'Sora',sans-serif" }}>{alert.bin}</span>}
                  {alert.zone && <span style={{ color: C.textMuted, fontSize: 12 }}>· {alert.zone}</span>}
                  {alert.resolved && <span style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #16a34a33", padding: "2px 9px", borderRadius: 99, fontSize: 10, fontWeight: 800 }}>✓ RESOLVED</span>}
                </div>
                <p style={{ color: alert.ack ? C.textMuted : C.text, margin: 0, fontSize: 14, fontWeight: 500 }}>{alert.msg}</p>
                <p style={{ color: C.textMuted, margin: "4px 0 0", fontSize: 11 }}>🕐 {alert.time}</p>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!alert.ack && (
                  <button
                    onClick={() => ack(alert.id)}
                    style={{ padding: "7px 14px", background: "#16a34a", border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                  >
                    ✓ Acknowledge
                  </button>
                )}
                {alert.ack && !alert.resolved && (
                  <button
                    onClick={() => setActionAlert(alert)}
                    style={{ padding: "7px 14px", background: C.navy, border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                  >
                    ⚡ Take Action
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
            <p style={{ color: "#16a34a", fontSize: 18, fontWeight: 800 }}>All Clear</p>
            <p style={{ color: C.textMuted, fontSize: 14 }}>No active alerts — system operating normally.</p>
          </div>
        )}
      </div>

      {actionAlert && (
        <ActionModal
          alert={actionAlert}
          onClose={() => setActionAlert(null)}
          onComplete={completeAction}
        />
      )}
    </div>
  );
};

export default AlertCenter;