import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PassengerSearchRide = () => {
  const [postedRides, setPostedRides] = useState([]);
  const navigate = useNavigate();

  // Load posted rides on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("postedRides")) || [];
    setPostedRides(stored);
  }, []);

  const handleAccept = (ride) => {
    // Get passenger info
    const passengerName = localStorage.getItem("userName") || "John Doe";
    const passengerGender = localStorage.getItem("userGender") || "N/A";
    const passengerAge = localStorage.getItem("userAge") || "N/A";
    const passengerId = localStorage.getItem("userId") || "TX-PASS-0000";

    // Build confirmed ride object
    const confirmedRide = {
      requestId: ride.id || Date.now(),
      acceptedAt: new Date().toISOString(),
      driverName: ride.driverName || "Anonymous",
      driverGender: ride.driverGender || "N/A",
      driverAge: ride.driverAge || "N/A",
      driverId: ride.driverId || "TX-DR-0000",
      driverFare: ride.fare || "N/A",
      passengerName,
      passengerGender,
      passengerAge,
      passengerId,
      pickupAddress: ride.pickupAddress,
      destinationAddress: ride.destinationAddress,
    };

    // Save to confirmedRides
    const allConfirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    localStorage.setItem("confirmedRides", JSON.stringify([...allConfirmed, confirmedRide]));

    // Remove ride from postedRides
    const allPosted = JSON.parse(localStorage.getItem("postedRides")) || [];
    const updatedPosted = allPosted.filter((r) => r.id !== ride.id);
    localStorage.setItem("postedRides", JSON.stringify(updatedPosted));

    // Live update UI
    setPostedRides((prev) => prev.filter((r) => r.id !== ride.id));

    // Redirect to confirmation
    navigate("/passengersidebar/confirmedride");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🚗 Available Rides From Drivers</h1>

      {postedRides.length === 0 ? (
        <p className="text-gray-500 text-center">No drivers have posted rides yet.</p>
      ) : (
        postedRides.map((ride, index) => (
          <div key={index} className="border p-4 rounded shadow mb-4 bg-white">
            <p><strong>Driver:</strong> {ride.driverName || "Anonymous"}</p>
            <p><strong>From:</strong> {ride.pickupAddress}</p>
            <p><strong>To:</strong> {ride.destinationAddress}</p>
            <p><strong>Fare:</strong> ${ride.fare}</p>
            <p>
              <strong>Departure Time:</strong>{" "}
              {ride.datetime ? new Date(ride.datetime).toLocaleString() : "N/A"}
            </p>

            <button
              onClick={() => handleAccept(ride)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✅ Accept This Ride
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PassengerSearchRide;



