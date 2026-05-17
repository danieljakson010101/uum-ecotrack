import { useState, useEffect } from "react";

// Layout
import Sidebar from "./components/layout/Sidebar";
import Header  from "./components/layout/Header";
import Footer  from "./components/layout/Footer";

// Sections
import Overview          from "./components/sections/Overview";
import BinMonitoring     from "./components/sections/BinMonitoring";
import RouteOptimisation from "./components/sections/RouteOptimisation";
import Analytics         from "./components/sections/Analytics";
import AlertCenter       from "./components/sections/AlertCenter";

// Data
import { ALERTS_INIT } from "./constants/data";
import { C }           from "./constants/theme";

export default function App() {
  const [section, setSection] = useState("overview");
  const [alerts,  setAlerts]  = useState(ALERTS_INIT);
  const [time,    setTime]    = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unread = alerts.filter(a => !a.ack).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Noto+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.text}; font-family: 'Noto Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        button { font-family: inherit; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          section={section}
          setSection={setSection}
          unreadAlerts={unread}
          time={time}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Header
            time={time}
            unreadAlerts={unread}
            onViewAlerts={() => setSection("alerts")}
          />

          <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            {section === "overview"  && <Overview  alerts={alerts} onViewAlerts={() => setSection("alerts")} />}
            {section === "bins"      && <BinMonitoring />}
            {section === "routes"    && <RouteOptimisation />}
            {section === "analytics" && <Analytics />}
            {section === "alerts"    && <AlertCenter alerts={alerts} setAlerts={setAlerts} />}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}