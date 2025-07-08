// 🚗 Updated DriverSidebarPage
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelopeOpenText,
  FaSignOutAlt,
  FaBell,
  FaCheck,
  FaHistory,
} from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";

const DriverSidebarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [isActive, setIsActive] = useState(user?.driverActive || false);

  useEffect(() => {
    if (user) {
      const updatedUser = { ...user, driverActive: isActive };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  }, [isActive]);

  const toggleActiveStatus = () => {
    setIsActive((prev) => !prev);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "driverdashboard" },
    { label: "Requests", icon: <MdOutlineLocalOffer />, path: "driverrequest" },
    { label: "Post Ride", icon: <FaMapMarkerAlt />, path: "postride" },
    { label: "Confirmed Ride", icon: <FaCheck />, path: "confirmedride" },
    { label: "Profile", icon: <FaUser />, path: "driverprofile" },
    { label: "Ride History", icon: <FaHistory />, path: "driverpersonalhistory" },
    { label: "Contact Admin", icon: <FaEnvelopeOpenText />, path: "contactadmins" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-center items-center py-4 border-b">
            <button
              onClick={toggleActiveStatus}
              className={`px-4 py-2 rounded font-semibold shadow ${
                isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {isActive ? "Active 🟢" : "Inactive 🔴"}
            </button>
          </div>

          <nav className="mt-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
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
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DriverSidebarPage;


