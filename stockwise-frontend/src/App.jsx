import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Inventory from "./pages/Inventory";
import Onboarding from "./pages/Onboarding";
import HouseholdSelector from "./pages/HouseholdSelector";
import ActivityLog from "./pages/ActivityLog";
import Alerts from "./pages/Alerts";


/* 🔐 Protected Route */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

/* 🌍 Public Route */
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/*Onboarding}*/}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
        }
        />

        {/*HouseholdSelector*/}
        <Route
         path="/households"
         element={
            <ProtectedRoute>
              <HouseholdSelector />
            </ProtectedRoute>
          }
        />



        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/*Inventory*/}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Inventory />
              </AppLayout>
            </ProtectedRoute>
          }
         />
         
         {/* Activity Log */}
        <Route
          path="/activity"
          element={
             <ProtectedRoute>
                <AppLayout>
                <ActivityLog />
                </AppLayout>
            </ProtectedRoute>
            }
        />
        {/* Alerts*/}
        <Route
          path="/alerts"
          element={
             <ProtectedRoute>
                <AppLayout>
                <Alerts />
                </AppLayout>
            </ProtectedRoute>
            }
        />


      </Routes>
    </BrowserRouter>
  );
}
