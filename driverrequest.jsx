import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverRequest = () => {
  const [requests, setRequests] = useState([]);
  const [driverFare, setDriverFare] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("rideRequests")) || [];
    const confirmedRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];

    // Remove already confirmed rides
    const confirmedIds = confirmedRides.map((ride) => ride.requestId);
    const availableRequests = storedRequests.filter(req => !confirmedIds.includes(req.id));

    setRequests(availableRequests);

    // Smart Matching - Notify driver if a request is nearby and they are active
    const isDriverActive = localStorage.getItem("driverActive") === "true";
    const postedRides = JSON.parse(localStorage.getItem("postedRides")) || [];

    if (isDriverActive && postedRides.length > 0) {
      const matched = availableRequests.filter((req) => {
        return postedRides.some((ride) => {
          const timeDiff = Math.abs(new Date(ride.datetime) - new Date(req.scheduledTime || Date.now())) / (1000 * 60); // in minutes
          const pickupDistance = getDistanceInMiles(ride.pickupCoords, req.pickup);
          const destinationDistance = getDistanceInMiles(ride.destinationCoords, req.destination);

          return timeDiff <= 60 && pickupDistance <= 10 && destinationDistance <= 10;
        });
      });

      if (matched.length > 0) {
        alert("🔔 Smart Match Alert: A nearby passenger is requesting a ride!");
      }
    }
  }, []);

  const getDistanceInMiles = (coord1, coord2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleAccept = (request) => {
    const offer = {
      requestId: request.id,
      driverName: "John Doe",
      driverGender: "Male",
      driverAge: 34,
      driverId: "TX-DR-1022",
      acceptedAt: new Date().toISOString(),
      driverFare: driverFare[request.id] || 0,
      pickupAddress: request.pickupAddress,
      destinationAddress: request.destinationAddress,
      passengerName: request.passengerName,
      passengerAge: request.passengerAge,
      passengerGender: request.passengerGender,
      passengerFare: request.estimatedFare || 0,
    };

    const prevOffers = JSON.parse(localStorage.getItem("driverOffers")) || [];
    localStorage.setItem("driverOffers", JSON.stringify([...prevOffers, offer]));

    const allRequests = JSON.parse(localStorage.getItem("rideRequests")) || [];
    const updatedRequests = allRequests.filter((req) => req.id !== request.id);
    localStorage.setItem("rideRequests", JSON.stringify(updatedRequests));

    setRequests(prev => prev.filter((req) => req.id !== request.id));

    alert(`✅ You accepted ride request #${request.id}. Passenger will be notified.`);
    navigate("/driversidebar/driverdashboard");
  };

  const handleFareChange = (id, value) => {
    setDriverFare((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 Incoming Ride Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No ride requests at the moment.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold mb-2">Request #{req.id}</h2>
              <p><strong>Pickup:</strong> {req.pickupAddress}</p>
              <p><strong>Destination:</strong> {req.destinationAddress}</p>
              <p><strong>Passenger Fare Estimate:</strong> ${req.estimatedFare || 0}</p>
              <p>
                <strong>Passenger:</strong> {req.passengerName} ({req.passengerGender}, Age {req.passengerAge})
              </p>

              <div className="mt-2">
                <label className="font-semibold">Set Your Fare ($): </label>
                <input
                  type="number"
                  className="border p-1 rounded w-40"
                  placeholder="Enter fare"
                  value={driverFare[req.id] || ""}
                  onChange={(e) => handleFareChange(req.id, Number(e.target.value))}
                />
              </div>

              <button
                onClick={() => handleAccept(req)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ✅ Accept Ride
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRequest;



