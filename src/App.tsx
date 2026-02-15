import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";

import AdminRooms from "./pages/admin/AdminRooms";
import UserRooms from "./pages/user/UserRooms";

import AdminBookings from "./pages/admin/AdminBookings";
import UserBookings from "./pages/user/UserBookings";

import AdminHistory from "./pages/admin/AdminHistory";
import UserHistory from "./pages/user/UserHistory";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminRooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/history"
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminHistory />
          </ProtectedRoute>
        }
      />

      {/* ================= USER ================= */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRole="User">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/rooms"
        element={
          <ProtectedRoute allowedRole="User">
            <UserRooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute allowedRole="User">
            <UserBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/history"
        element={
          <ProtectedRoute allowedRole="User">
            <UserHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
