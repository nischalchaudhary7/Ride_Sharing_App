// src/pages/admin/DriverRideHistory.jsx
import { useEffect, useState } from "react";

const DriverRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const confirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    setRides(confirmed);
  }, []);

  const handleDelete = (rideId) => {
    const confirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const updated = confirmed.filter((r) => r.requestId !== rideId);
    localStorage.setItem("confirmedRides", JSON.stringify(updated));
    setRides(updated);
    alert(`🗑️ Ride #${rideId} deleted successfully.`);
  };

  const filteredRides = rides.filter((ride) => {
    const keyword = search.toLowerCase();
    return (
      ride.driverName?.toLowerCase().includes(keyword) ||
      ride.driverEmail?.toLowerCase().includes(keyword) ||
      ride.driverPhone?.toLowerCase().includes(keyword) ||
      ride.requestId?.toString().includes(keyword)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 Driver Ride History (Admin)</h1>

      <input
        type="text"
        placeholder="Search by name, email, phone, or Ride ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {filteredRides.length === 0 ? (
        <p className="text-gray-500 text-center">No rides found.</p>
      ) : (
        filteredRides.map((ride, index) => (
          <div key={index} className="border p-4 rounded shadow mb-4 bg-white">
            <p><strong>Ride ID:</strong> #{ride.requestId}</p>
            <p><strong>Driver:</strong> {ride.driverName} ({ride.driverEmail})</p>
            <p><strong>Passenger:</strong> {ride.passengerName}</p>
            <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
            <p><strong>Destination:</strong> {ride.destinationAddress}</p>
            <p><strong>Fare:</strong> ${ride.driverFare}</p>
            <p><strong>Date:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>

            {ride.driverRating && (
              <div className="mt-2 bg-blue-50 p-2 rounded">
                <p><strong>⭐ Driver Feedback:</strong> {ride.driverRating} Stars</p>
                <p><strong>Comment:</strong> {ride.driverComment || "No comment"}</p>
              </div>
            )}

            <button
              onClick={() => handleDelete(ride.requestId)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑️ Delete Ride
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverRideHistory;