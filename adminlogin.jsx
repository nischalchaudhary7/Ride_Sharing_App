import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Password strength validation
  const isPasswordStrong = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const handleLogin = () => {
    // Check password strength
    if (!isPasswordStrong(password)) {
      setError("❌ Password must be at least 8 characters and include uppercase, lowercase, a number, and a special symbol.");
      return;
    }

    // Check login credentials
    if (username === "admin" && password === "Admin@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/adminpanel");
    } else {
      setError("❌ Invalid admin credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">🔐 Admin Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <p className="text-xs text-gray-500 mb-3">
        🔒 Password must be at least 8 characters, include uppercase, lowercase, a number, and a symbol.
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
