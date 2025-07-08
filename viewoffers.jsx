import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 3958.8; // Miles

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const ViewOffers = () => {
  const [offers, setOffers] = useState([]);
  const [matchFound, setMatchFound] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem("driverOffers")) || [];
    setOffers(storedOffers);

    // Smart Matching Trigger
    const currentRequest = JSON.parse(localStorage.getItem("currentRideRequest"));
    const postedRides = JSON.parse(localStorage.getItem("postedRides")) || [];

    if (currentRequest && postedRides.length > 0) {
      const now = new Date(currentRequest.datetime);

      const matched = postedRides.find((ride) => {
        const pickupDist = haversineDistance(ride.pickupCoords, currentRequest.pickupCoords);
        const destDist = haversineDistance(ride.destinationCoords, currentRequest.destinationCoords);
        const timeDiff = Math.abs(new Date(ride.datetime) - now) / (1000 * 60); // in minutes

        return (
          pickupDist <= 10 &&
          destDist <= 10 &&
          timeDiff <= 60 &&
          Number(ride.seats) >= 1
        );
      });

      if (matched) {
        setMatchFound(matched);
      }
    }
  }, []);

  const confirmRide = (requestId) => {
    const selectedOffer = offers.find((o) => o.requestId === requestId);
    if (!selectedOffer) return;

    const previousRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    localStorage.setItem("confirmedRides", JSON.stringify([...previousRides, selectedOffer]));

    const updatedOffers = offers.filter((o) => o.requestId !== requestId);
    localStorage.setItem("driverOffers", JSON.stringify(updatedOffers));
    setOffers(updatedOffers);

    alert(`🎉 Ride #${requestId} confirmed!`);
    navigate("/passengersidebar/confirmedride");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🚘 Ride Offers You've Received</h1>

      {matchFound && (
        <div className="p-4 mb-6 border-l-4 border-green-500 bg-green-50">
          <h2 className="text-lg font-bold mb-2 text-green-800">🚗 Driver Match Found!</h2>
          <p><strong>Driver:</strong> {matchFound.driverName}</p>
          <p><strong>Pickup:</strong> {matchFound.pickupAddress}</p>
          <p><strong>Destination:</strong> {matchFound.destinationAddress}</p>
          <p><strong>Time:</strong> {new Date(matchFound.datetime).toLocaleString()}</p>
          <p><strong>Fare:</strong> ${matchFound.fare}</p>
        </div>
      )}

      {offers.length === 0 ? (
        <p className="text-gray-600">No drivers have accepted your ride yet.</p>
      ) : (
        offers.map((offer, index) => (
          <div key={index} className="border p-4 rounded shadow mb-4 bg-white">
            <h2 className="text-lg font-semibold mb-2">Ride Offer #{offer.requestId}</h2>
            <h3 className="font-bold mb-1">👤 Driver Details:</h3>
            <p><strong>Name:</strong> {offer.driverName}</p>
            <p><strong>Gender:</strong> {offer.driverGender}</p>
            <p><strong>Age:</strong> {offer.driverAge}</p>
            <p><strong>ID:</strong> {offer.driverId}</p>

            <h3 className="font-bold mt-4 mb-1">📍 Ride Info:</h3>
            <p><strong>Pickup:</strong> {offer.pickupAddress}</p>
            <p><strong>Destination:</strong> {offer.destinationAddress}</p>
            <p><strong>Accepted At:</strong> {new Date(offer.acceptedAt).toLocaleString()}</p>

            <h3 className="font-bold mt-4 mb-1 text-purple-700">💵 Fare Comparison:</h3>
            <p><strong>Passenger’s Estimated Fare:</strong> ${offer.passengerFare || "N/A"}</p>
            <p><strong>Driver’s Proposed Fare:</strong> ${offer.driverFare || "N/A"}</p>

            <button
              onClick={() => confirmRide(offer.requestId)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✅ Confirm This Ride
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewOffers;








