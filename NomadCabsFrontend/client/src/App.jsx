import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./auth/pages/AuthPage";
import RiderPage from "./pages/RiderPage";
import DriverPage from "./pages/DriverPage";
import AdminPage from "./pages/AdminPage";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RideTracking from "./components/Rider_Modules/RideTracking";
import DriverRideTracking from "./components/Driver_Modules/DriverRideTracking";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = user.role?.toUpperCase();
  const allowedRoles = roles?.map((r) => r.toUpperCase());

  if (roles && !allowedRoles.includes(userRole)) {
    const homePath = `/${userRole.toLowerCase()}`;
    return <Navigate to={homePath} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/rider"
          element={
            <ProtectedRoute roles={["RIDER"]}>
              <RiderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute roles={["DRIVER"]}>
              <DriverPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Specific Rider Routes */}
        <Route
          path="/rider/ride-tracking"
          element={
            <ProtectedRoute roles={["RIDER"]}>
              <RideTracking />
            </ProtectedRoute>
          }
        />

        {/* Specific Driver Routes */}
        <Route
          path="/driver/ride-tracking"
          element={
            <ProtectedRoute roles={["DRIVER"]}>
              <DriverRideTracking />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
};

export default App;