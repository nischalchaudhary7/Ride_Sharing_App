// ✅ login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const match = users.find((u) => u.email === email && u.password === password);

    if (!match) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(match));

    navigate("/location");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 mb-3 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border w-full p-2 mb-3 rounded" />
        <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">Log In</button>
      </form>
    </div>
  );
};

export default Login;

  