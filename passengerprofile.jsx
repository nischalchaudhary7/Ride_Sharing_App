import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PassengerProfile = () => {
  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });
  const [rides, setRides] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setPassenger({
        name: currentUser.name || "",
        age: currentUser.age || "",
        gender: currentUser.gender || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      });

      const allRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
      const userRides = allRides.filter(
        (ride) =>
          ride.passengerName === currentUser.name &&
          ride.passengerGender === currentUser.gender &&
          ride.passengerAge === currentUser.age
      );
      setRides(userRides);

      const allFeedback = JSON.parse(localStorage.getItem("rideFeedback")) || [];
      setFeedbacks(allFeedback.filter((fb) => fb.by === "passenger"));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSave = () => {
    const updatedUser = {
      ...JSON.parse(localStorage.getItem("currentUser")),
      name: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      phone: passenger.phone,
    };

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        return alert("❌ Passwords do not match.");
      }
      if (!validatePassword(newPassword)) {
        return alert(
          "❌ Password must be at least 8 characters and include a capital letter, number, and symbol."
        );
      }
      updatedUser.password = newPassword;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setEditing(false);
    setNewPassword("");
    setConfirmPassword("");
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">🧍 Passenger Profile</h1>

      <div className="space-y-3">
        <input type="text" name="name" value={passenger.name} onChange={handleChange} disabled={!editing} className="w-full p-2 border rounded" placeholder="Full Name" />
        <input type="number" name="age" value={passenger.age} onChange={handleChange} disabled={!editing} className="w-full p-2 border rounded" placeholder="Age" />
        <select name="gender" value={passenger.gender} onChange={handleChange} disabled={!editing} className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="tel" name="phone" value={passenger.phone} onChange={handleChange} disabled={!editing} className="w-full p-2 border rounded" placeholder="Phone Number" />
        <input type="email" name="email" value={passenger.email} disabled className="w-full p-2 border rounded bg-gray-100" placeholder="Email (Cannot Edit)" />

        {editing && (
          <>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" />
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ✏️ Edit Profile
          </button>
        ) : (
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            💾 Save Changes
          </button>
        )}
      </div>

      {/* Ride History Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">🧾 Your Ride History</h2>
        {rides.length === 0 ? (
          <p className="text-center text-gray-500">No ride history available.</p>
        ) : (
          rides.map((ride, index) => {
            const feedback = feedbacks.find((fb) => fb.rideId === ride.requestId);
            return (
              <div key={index} className="border rounded p-4 mb-4 shadow bg-white">
                <p><strong>Ride ID:</strong> #{ride.requestId}</p>
                <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
                <p><strong>Destination:</strong> {ride.destinationAddress}</p>
                <p><strong>Driver:</strong> {ride.driverName}</p>
                <p><strong>Date:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>
                <p><strong>💰 Fare:</strong> ${ride.driverFare || "N/A"}</p>
                {feedback ? (
                  <div className="mt-3 p-3 bg-green-50 rounded">
                    <h3 className="font-semibold">⭐ Feedback You Gave:</h3>
                    <p><strong>Rating:</strong> {feedback.rating} Stars</p>
                    <p><strong>Comment:</strong> {feedback.comment || "No comment"}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-3">You haven’t submitted feedback for this ride yet.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PassengerProfile;

