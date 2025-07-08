// src/pages/role.jsx
import { useNavigate } from "react-router-dom";

const Role = () => {
  const navigate = useNavigate();

  const selectRole = (role) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return navigate("/login");

    // ✅ Add role to currentUser object
    user.role = role;

    // ✅ Optional: add default driver approval flag
    if (role === "driver" && !user.driverApproved) {
      user.driverApproved = false;
    }

    // ✅ Save updated user to localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    // ✅ Redirect to correct page
    if (role === "passenger") {
      navigate("/passengersidebar/passengerdashboard");
    } else if (role === "driver") {
      navigate(user.driverApproved ? "/driversidebar/driverdashboard" : "/driverapplication");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white text-center">
      <h2 className="text-2xl mb-4">Are you a passenger or a driver?</h2>
      <div className="space-x-4">
        <button
          onClick={() => selectRole("passenger")}
          className="bg-lime-400 text-black px-6 py-2 rounded font-semibold"
        >
          Passenger
        </button>
        <button
          onClick={() => selectRole("driver")}
          className="bg-gray-700 px-6 py-2 rounded font-semibold"
        >
          Driver
        </button>
      </div>
    </div>
  );
};

export default Role;




