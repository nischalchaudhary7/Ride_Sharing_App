import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // check login status on component load
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  // react to login/logout changes across pages
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ECU Ride Sharing</h1>
      <div>
        <Link className="mx-2 hover:underline" to="/">Home</Link>

        {!isLoggedIn ? (
          <>
            <Link className="mx-2 hover:underline" to="/login">Login</Link>
            <Link className="mx-2 hover:underline" to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link className="mx-2 hover:underline" to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="mx-2 hover:underline text-red-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
