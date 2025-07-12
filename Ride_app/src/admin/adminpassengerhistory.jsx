// src/admin/PassengerRideHistoryAdmin.jsx
import { useEffect, useState } from "react";

const PassengerRideHistoryAdmin = () => {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const confirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    setRides(confirmed);
  }, []);

  const handleDelete = (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;
    const updated = rides.filter((r) => r.requestId !== rideId);
    setRides(updated);
    localStorage.setItem("confirmedRides", JSON.stringify(updated));
  };

  const filtered = rides.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.passengerName?.toLowerCase().includes(q) ||
      r.passengerEmail?.toLowerCase().includes(q) ||
      r.pickupAddress?.toLowerCase().includes(q) ||
      r.destinationAddress?.toLowerCase().includes(q) ||
      r.requestId?.toString().includes(q)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🧍 Passenger Ride History (Admin)</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, address, ride ID..."
        className="w-full p-2 border mb-4 rounded"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No rides found.</p>
      ) : (
        filtered.map((ride, index) => (
          <div key={index} className="border p-4 mb-4 rounded bg-white shadow">
            <p><strong>Ride ID:</strong> #{ride.requestId}</p>
            <p><strong>Passenger:</strong> {ride.passengerName} ({ride.passengerGender}, Age {ride.passengerAge})</p>
            <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
            <p><strong>Destination:</strong> {ride.destinationAddress}</p>
            <p><strong>Driver:</strong> {ride.driverName}</p>
            <p><strong>Fare:</strong> ${ride.driverFare}</p>
            <p><strong>Date:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>
            <button
              onClick={() => handleDelete(ride.requestId)}
              className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PassengerRideHistoryAdmin;
