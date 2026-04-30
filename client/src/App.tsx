import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/team/Rooms";
import Guests from "./pages/team/Guests";
import Reservations from "./pages/team/Reservations";
import Reports from "./pages/team/Reports";
import AuditLogs from "./pages/team/AuditLogs";
import SystemSettings from "./pages/team/SystemSettings";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const userString = localStorage.getItem("user");
  if (!userString) return <Navigate to="/" replace />;
  
  const user = JSON.parse(userString);
  
  // Normalize role casing to handle legacy values
  const rawRole = user.role || "Receptionist";
  const roleMap: Record<string, string> = {
    'ADMIN': 'Administrator',
    'FINANCE': 'Finance Officer',
    'MANAGER': 'Manager',
    'RECEPTIONIST': 'Receptionist'
  };
  const role = roleMap[rawRole] || rawRole;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/rooms" 
        element={<ProtectedRoute allowedRoles={['Administrator', 'Receptionist', 'Manager']}><Rooms /></ProtectedRoute>} 
      />
      <Route 
        path="/guests" 
        element={<ProtectedRoute allowedRoles={['Administrator', 'Receptionist', 'Manager']}><Guests /></ProtectedRoute>} 
      />
      <Route 
        path="/reservations" 
        element={<ProtectedRoute allowedRoles={['Administrator', 'Receptionist', 'Manager']}><Reservations /></ProtectedRoute>} 
      />
      <Route 
        path="/reports" 
        element={<ProtectedRoute allowedRoles={['Administrator', 'Manager', 'Finance Officer']}><Reports /></ProtectedRoute>} 
      />
      <Route 
        path="/audit-logs" 
        element={<ProtectedRoute allowedRoles={['Administrator', 'Manager', 'Finance Officer']}><AuditLogs /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute allowedRoles={['Administrator']}><SystemSettings /></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;
