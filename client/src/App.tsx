import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Guests from "./pages/team/Guests";
import Reservations from "./pages/team/Reservations";
import Reports from "./pages/team/Reports";
import AuditLogs from "./pages/team/AuditLogs";
import SystemSettings from "./pages/team/SystemSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/guests" element={<Guests />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/settings" element={<SystemSettings />} />
    </Routes>
  );
}

export default App;
