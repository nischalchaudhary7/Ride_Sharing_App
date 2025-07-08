// src/pages/devpanel.jsx
import { useNavigate } from "react-router-dom";

const DevPanel = () => {
  const navigate = useNavigate();

  const simulateLogin = (role) => {
    const user = {
      name: "Test User",
      email: `${role}@example.com`,
      role,
      isDriverApproved: true,
      phone: "1234567890",
      gender: "Other",
    };

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "admin") navigate("/adminpanel");
    else if (role === "passenger") navigate("/passengersidebar/passengerdashboard");
    else if (role === "driver") navigate("/driversidebar/driverdashboard");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-yellow-100 text-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">🚀 Developer Panel</h1>
      <p className="mb-4 text-gray-700">Select a role to simulate login and access its pages directly:</p>
      <div className="space-x-4">
        <button onClick={() => simulateLogin("admin")} className="bg-purple-600 text-white px-4 py-2 rounded">Login as Admin</button>
        <button onClick={() => simulateLogin("passenger")} className="bg-blue-600 text-white px-4 py-2 rounded">Login as Passenger</button>
        <button onClick={() => simulateLogin("driver")} className="bg-green-600 text-white px-4 py-2 rounded">Login as Driver</button>
      </div>
    </div>
  );
};

export default DevPanel;
