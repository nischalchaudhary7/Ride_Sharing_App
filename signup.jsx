import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const { name, age, gender, email, phone, password, confirmPassword } = formData;

    if (!name || !age || !gender || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setMessage(null);
      return;
    }

    // ✅ Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character (!@#$%^&*)");
      setMessage(null);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage(null);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === email)) {
      setError("User with this email already exists.");
      setMessage(null);
      return;
    }

    const newUser = {
      name,
      age,
      gender,
      email,
      phone,
      password,
      isDriverApproved: false,
      role: "",
      profilePicture: null
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");

    setMessage("Account created successfully!");
    setError(null);
    navigate("/location");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-3 rounded whitespace-pre-wrap">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">{message}</div>}

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        
        <select name="gender" value={formData.gender} onChange={handleChange} className="border w-full p-2 mb-3 rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="border w-full p-2 mb-3 rounded" />

        <button className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;



