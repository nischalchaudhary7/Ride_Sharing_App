import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">🚗 ECU Ride Sharing Dashboard</h1>
      <p className="text-lg mb-6">Welcome! You’re logged in.</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
