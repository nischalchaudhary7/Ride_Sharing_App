// src/components/protectedroute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, requireApproval = false }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" />;
  }

  // 🚧 Redirect if user role doesn't match
  if (role && currentUser.role !== role) {
    const redirectPath =
      currentUser.role === "driver"
        ? "/driversidebar/driverdashboard"
        : "/passengersidebar/passengerdashboard";
    return <Navigate to={redirectPath} />;
  }

  // 🔒 Check driver approval if required
  if (requireApproval && currentUser.role === "driver" && !currentUser.driverApproved) {
    return <Navigate to="/driverapprovalpending" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



