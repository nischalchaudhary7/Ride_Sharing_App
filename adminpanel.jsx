import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminSidebar from "../admin/adminsidebar";
import AdminDashboard from "../admin/admindashboard";
import AdminDrivers from "../admin/admindrivers";
import AdminPassengers from "../admin/adminpassengers";
import AdminDriverHistory from "../admin/admindriverhistory";
import AdminPassengerHistory from "../admin/adminpassengerhistory";
import AdminEmergencies from "../admin/adminemergencies";
import AdminReports from "../admin/adminreports";
import AdminDisputes from "../admin/admindisputes";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/adminlogin" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/adminlogin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Drivers":
        return <AdminDrivers />;
      case "Passengers":
        return <AdminPassengers />;
      case "DriverHistory":
        return <AdminDriverHistory />;
      case "PassengerHistory":
        return <AdminPassengerHistory />;
      case "Emergencies":
        return <AdminEmergencies />;
      case "Reports":
        return <AdminReports />;
      case "Disputes":
        return <AdminDisputes />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-grow p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;



