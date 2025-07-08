import { useEffect, useState } from "react";

const DriverProfile = () => {
  const [driver, setDriver] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    licenseId: "",
    vehicleModel: "",
    vehiclePlate: "",
    licenseImage: null,
    carFrontImage: null,
    carBackImage: null,
    driverImage: null,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stats, setStats] = useState({ totalRides: 0, averageRating: 0 });
  const [rides, setRides] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedStats = JSON.parse(localStorage.getItem("driverStats")) || {};

    if (currentUser) {
      setDriver({ ...currentUser });
      setStats({
        totalRides: storedStats.totalRides || 0,
        averageRating: storedStats.averageRating || 0,
      });
    }

    const allRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const allFeedback = JSON.parse(localStorage.getItem("rideFeedback")) || [];
    const driverRides = allRides.filter((ride) => ride.driverEmail === currentUser?.email);
    const driverFeedbacks = allFeedback.filter((fb) => fb.by === "driver");

    setRides(driverRides);
    setFeedbacks(driverFeedbacks);
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedDriver = { ...driver, [name]: reader.result };
        setDriver(updatedDriver);
        localStorage.setItem("currentUser", JSON.stringify({ ...updatedDriver, driverApproved: false }));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map((u) =>
          u.email === updatedDriver.email ? { ...u, [name]: reader.result, driverApproved: false } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("driverApproved", "false");
        alert("📤 Uploaded successfully. Awaiting admin re-approval.");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("⚠️ All password fields are required.");
      return;
    }

    const current = JSON.parse(localStorage.getItem("currentUser"));
    if (oldPassword !== current.password) {
      alert("❌ Current password is incorrect.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert("❗ Password must be at least 8 characters long and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character (!@#$%^&*)");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("⚠️ New passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === current.email ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify({ ...current, password: newPassword }));

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    alert("✅ Password updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-700">🚗 Driver Profile</h1>

      <div className="space-y-3">
        <input type="text" value={driver.name} disabled className="w-full p-2 border rounded" placeholder="Full Name" />
        <input type="number" value={driver.age} disabled className="w-full p-2 border rounded" placeholder="Age" />
        <select value={driver.gender} disabled className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="tel" value={driver.phone} disabled className="w-full p-2 border rounded" placeholder="Phone Number" />
        <input type="email" value={driver.email} disabled className="w-full p-2 border rounded bg-gray-100" placeholder="Email (Cannot Edit)" />
        <input type="text" value={driver.licenseId} disabled className="w-full p-2 border rounded" placeholder="Driver License ID" />
        <input type="text" value={driver.vehicleModel} disabled className="w-full p-2 border rounded" placeholder="Vehicle Model" />
        <input type="text" value={driver.vehiclePlate} disabled className="w-full p-2 border rounded" placeholder="Vehicle Plate" />

        <hr className="my-6" />
        <h2 className="text-lg font-semibold">📸 Upload/Update Photos (Triggers Admin Re-approval)</h2>
        <label>Driver Photo</label>
        <input type="file" name="driverImage" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {driver.driverImage && <img src={driver.driverImage} alt="Driver" className="w-32 h-32 object-cover rounded" />}

        <label>License Image</label>
        <input type="file" name="licenseImage" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {driver.licenseImage && <img src={driver.licenseImage} alt="License" className="w-32 h-32 object-cover rounded" />}

        <label>Car Front Image</label>
        <input type="file" name="carFrontImage" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {driver.carFrontImage && <img src={driver.carFrontImage} alt="Car Front" className="w-32 h-32 object-cover rounded" />}

        <label>Car Back Image</label>
        <input type="file" name="carBackImage" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {driver.carBackImage && <img src={driver.carBackImage} alt="Car Back" className="w-32 h-32 object-cover rounded" />}
      </div>

      <hr className="my-6" />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">🔐 Change Password</h2>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current Password" className="w-full p-2 border rounded" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-2 border rounded" />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full p-2 border rounded" />
        <button onClick={handlePasswordChange} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Update Password
        </button>
      </div>

      <hr className="my-6" />

      <div className="text-center">
        <h2 className="text-xl font-bold text-purple-700">📊 Your Ride Stats</h2>
        <p><strong>Total Rides Completed:</strong> {stats.totalRides}</p>
        <p><strong>Average Rating:</strong> ⭐ {stats.averageRating}</p>
      </div>

      <hr className="my-6" />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">🧾 Your Ride History</h2>
        {rides.length === 0 ? (
          <p className="text-center text-gray-500">You have not completed any rides yet.</p>
        ) : (
          rides.map((ride, index) => {
            const feedback = feedbacks.find((fb) => fb.rideId === ride.requestId);
            return (
              <div key={index} className="border rounded p-4 mb-4 shadow bg-white">
                <p><strong>Ride ID:</strong> #{ride.requestId}</p>
                <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
                <p><strong>Destination:</strong> {ride.destinationAddress}</p>
                <p><strong>Passenger:</strong> {ride.passengerName}</p>
                <p><strong>Date:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>
                <p><strong>Fare:</strong> ${ride.driverFare || "N/A"}</p>
                {feedback ? (
                  <div className="mt-4 bg-blue-50 p-3 rounded">
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

export default DriverProfile;

