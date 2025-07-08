import { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const dummyDrivers = [
  { id: 1, name: "Driver A", lat: 32.78, lng: -96.8 },
  { id: 2, name: "Driver B", lat: 32.77, lng: -96.81 },
  { id: 3, name: "Driver C", lat: 32.75, lng: -96.85 },
];

const mapContainerStyle = {
  height: "250px",
  width: "100%",
};

const PassengerDashboard = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [scheduleType, setScheduleType] = useState("instant");
  const [scheduledTime, setScheduledTime] = useState("");
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [center, setCenter] = useState({ lat: 32.7767, lng: -96.797 });
  const [directions, setDirections] = useState(null);
  const [distanceText, setDistanceText] = useState("");
  const [durationText, setDurationText] = useState("");

  const navigate = useNavigate();
  const pickupAutoRef = useRef(null);
  const destAutoRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPickup(loc);
        setCenter(loc);
      },
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    if (pickup && destination && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      const matrixService = new window.google.maps.DistanceMatrixService();

      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess",
          },
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed due to", status);
          }
        }
      );

      matrixService.getDistanceMatrix(
        {
          origins: [pickup],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess",
          },
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === "OK") {
            const element = response.rows[0].elements[0];
            setDistanceText(element.distance?.text || "");
            setDurationText(element.duration_in_traffic?.text || element.duration?.text || "");
          }
        }
      );
    }
  }, [pickup, destination, isLoaded]);

  const handleSubmit = () => {
    if (!pickup || !destination) return alert("Set both pickup and destination.");
    const ride = {
      id: Date.now(),
      pickup,
      destination,
      pickupAddress,
      destinationAddress,
      scheduleType,
      scheduledTime: scheduleType === "scheduled" ? scheduledTime : null,
      passengerName: "John Doe",
      passengerAge: 25,
      passengerGender: "Male",
      passengerIDCard: "ABC123456",
      estimatedFare,
    };
    const existing = JSON.parse(localStorage.getItem("rideRequests")) || [];
    localStorage.setItem("rideRequests", JSON.stringify([...existing, ride]));
    alert("✅ Ride request submitted!");
    window.location.reload();
  };

  const handlePickupPlaceChange = () => {
    const place = pickupAutoRef.current.getPlace();
    if (place.geometry) {
      setPickupAddress(place.formatted_address);
      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPickup(loc);
      setCenter(loc);
    }
  };

  const handleDestinationPlaceChange = () => {
    const place = destAutoRef.current.getPlace();
    if (place.geometry) {
      setDestinationAddress(place.formatted_address);
      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setDestination(loc);
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">📍 Request a Ride</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Select Pickup Location</h2>
          <Autocomplete onLoad={(ref) => (pickupAutoRef.current = ref)} onPlaceChanged={handlePickupPlaceChange}>
            <input
              type="text"
              placeholder="Enter pickup address"
              className="w-full p-2 mb-2 border rounded"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </Autocomplete>
          <GoogleMap
            center={pickup || center}
            zoom={13}
            mapContainerStyle={mapContainerStyle}
            onClick={(e) => setPickup({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {pickup && <Marker position={pickup} label="P" />}
            {dummyDrivers.map((d) => (
              <Marker key={d.id} position={{ lat: d.lat, lng: d.lng }} label="🚗" />
            ))}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Select Destination</h2>
          <Autocomplete onLoad={(ref) => (destAutoRef.current = ref)} onPlaceChanged={handleDestinationPlaceChange}>
            <input
              type="text"
              placeholder="Enter destination address"
              className="w-full p-2 mb-2 border rounded"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </Autocomplete>
          <GoogleMap
            center={destination || center}
            zoom={13}
            mapContainerStyle={mapContainerStyle}
            onClick={(e) => setDestination({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {destination && <Marker position={destination} label="D" />}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          {distanceText && durationText && (
            <div className="mt-3 text-sm text-gray-700">
              <p><strong>🛣️ Distance:</strong> {distanceText}</p>
              <p><strong>🕒 Estimated Time (with traffic):</strong> {durationText}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded p-4 mb-4">
        <h2 className="font-semibold mb-2">💰 Estimated Fare</h2>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="number"
            className="border p-2 rounded w-28"
            value={estimatedFare === 0 ? "" : estimatedFare}
            onChange={(e) => setEstimatedFare(Number(e.target.value))}
            placeholder="e.g. 20"
          />
          <button onClick={() => setEstimatedFare((p) => p + 1)} className="bg-gray-200 px-3 py-1 rounded">
            + $1
          </button>
          <button onClick={() => setEstimatedFare((p) => p + 5)} className="bg-gray-200 px-3 py-1 rounded">
            + $5
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <label className="font-semibold">Type of Ride:</label>
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="instant">🚨 Instant Ride</option>
          <option value="scheduled">🕒 Schedule for Later</option>
        </select>
        {scheduleType === "scheduled" && (
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="border p-2 rounded"
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Ride Request
        </button>
        <button
          onClick={() => navigate("/passengersidebar/passengersearchride")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          🔍 Browse Available Rides by Drivers
        </button>
      </div>
    </div>
  );
};

export default PassengerDashboard;



