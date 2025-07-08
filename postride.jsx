import { useEffect, useRef, useState } from "react"; 
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  DistanceMatrixService,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
};

const PostRide = () => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [datetime, setDatetime] = useState("");
  const [fare, setFare] = useState("");
  const [seats, setSeats] = useState("");
  const [rideType, setRideType] = useState("instant");
  const [center, setCenter] = useState({ lat: 32.7767, lng: -96.797 });
  const [directions, setDirections] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);

  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

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
        setPickupLocation(loc);
        setCenter(loc);
      },
      (err) => console.warn("Geolocation denied", err)
    );
  }, []);

  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation,
          destination: destinationLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          }
        }
      );
    }
  }, [pickupLocation, destinationLocation]);

  const handlePickupPlace = () => {
    const place = pickupRef.current.getPlace();
    if (place?.geometry) {
      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPickupAddress(place.formatted_address);
      setPickupLocation(loc);
    }
  };

  const handleDestinationPlace = () => {
    const place = destinationRef.current.getPlace();
    if (place?.geometry) {
      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setDestinationAddress(place.formatted_address);
      setDestinationLocation(loc);
    }
  };

  const handlePostRide = () => {
    if (!pickupAddress || !destinationAddress || !fare || !seats) {
      alert("Please fill in all fields");
      return;
    }

    const driverName = localStorage.getItem("userName") || "Anonymous";

    const ride = {
      id: Date.now(),
      driverName,
      pickupAddress,
      destinationAddress,
      pickupCoords: pickupLocation,
      destinationCoords: destinationLocation,
      datetime: rideType === "scheduled" ? datetime : new Date().toISOString(),
      fare,
      seats,
      type: rideType,
    };

    const existing = JSON.parse(localStorage.getItem("postedRides")) || [];
    localStorage.setItem("postedRides", JSON.stringify([...existing, ride]));

    alert("✅ Ride posted successfully!");

    setPickupAddress("");
    setDestinationAddress("");
    setPickupLocation(null);
    setDestinationLocation(null);
    setDatetime("");
    setFare("");
    setSeats("");
    setRideType("instant");
    setDirections(null);
    setDistanceInfo(null);
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-8 text-center text-purple-700">➕ Post a New Ride</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
        <div>
          <label className="block font-semibold text-pink-700 mb-1">📍 From:</label>
          <Autocomplete onLoad={(a) => (pickupRef.current = a)} onPlaceChanged={handlePickupPlace}>
            <input
              className="w-full border p-2 rounded"
              placeholder="e.g., Downtown Dallas"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </Autocomplete>
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-2">🗺️ Pickup Location:</label>
          <GoogleMap
            center={pickupLocation || center}
            zoom={12}
            mapContainerStyle={containerStyle}
            onClick={(e) => setPickupLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {pickupLocation && <Marker position={pickupLocation} />}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
        <div>
          <label className="block font-semibold text-pink-700 mb-1">📍 To:</label>
          <Autocomplete onLoad={(a) => (destinationRef.current = a)} onPlaceChanged={handleDestinationPlace}>
            <input
              className="w-full border p-2 rounded"
              placeholder="e.g., Fort Worth"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </Autocomplete>
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-2">🗺️ Destination Location:</label>
          <GoogleMap
            center={destinationLocation || center}
            zoom={12}
            mapContainerStyle={containerStyle}
            onClick={(e) => setDestinationLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {destinationLocation && <Marker position={destinationLocation} />}
            {directions && <DirectionsRenderer directions={directions} />}
            {pickupLocation && destinationLocation && (
              <DistanceMatrixService
                options={{
                  origins: [pickupLocation],
                  destinations: [destinationLocation],
                  travelMode: "DRIVING",
                  drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: "pessimistic",
                  },
                  unitSystem: window.google.maps.UnitSystem.IMPERIAL,
                }}
                callback={(res) => {
                  if (res?.rows[0]?.elements[0]?.status === "OK") {
                    setDistanceInfo(res.rows[0].elements[0]);
                  }
                }}
              />
            )}
          </GoogleMap>
          {distanceInfo && (
            <div className="mt-2 text-sm text-gray-700">
              <p><strong>🛣️ Distance:</strong> {distanceInfo.distance.text}</p>
              <p><strong>🕒 Estimated Time:</strong> {distanceInfo.duration_in_traffic?.text || distanceInfo.duration.text}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">🚗 Ride Type:</label>
        <select
          className="border p-2 rounded w-full"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
        >
          <option value="instant">Instant Ride</option>
          <option value="scheduled">Schedule for Later</option>
        </select>
      </div>

      {rideType === "scheduled" && (
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-1">⏰ Date & Time:</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-semibold text-green-700 mb-1">💲 Fare (USD):</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="e.g., 20"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-indigo-700 mb-1">🪑 Seats Available:</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="e.g., 2"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handlePostRide}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        ✅ Post Ride
      </button>
    </div>
  );
};

export default PostRide;


