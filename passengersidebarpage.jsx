// 🚕 Updated PassengerSidebarPage
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSearchLocation,
  FaUser,
  FaEnvelopeOpenText,
  FaSignOutAlt,
  FaBell,
  FaCheck,
  FaHistory,
} from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";

const PassengerSidebarPage = () => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "passengerdashboard" },
    { label: "Browse Rides", icon: <FaSearchLocation />, path: "passengersearchride" },
    { label: "Offers", icon: <MdOutlineLocalOffer />, path: "viewoffers" },
    { label: "Confirmed Ride", icon: <FaCheck />, path: "confirmedride" },
    { label: "Profile", icon: <FaUser />, path: "passengerprofile" },
    { label: "Ride History", icon: <FaHistory />, path: "passengerpersonalhistory" },
    { label: "Contact Admin", icon: <FaEnvelopeOpenText />, path: "contactadmins" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
        <nav className="mt-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setActive(item.label)}
              className={`flex items-center px-4 py-3 hover:bg-blue-100 ${
                location.pathname.includes(item.path) ? "bg-blue-100 font-bold" : ""
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PassengerSidebarPage;


