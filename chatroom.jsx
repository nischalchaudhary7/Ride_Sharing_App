import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ride, setRide] = useState(null);
  const [userName, setUserName] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const chatEndRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    const allConfirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const last = allConfirmed[allConfirmed.length - 1];
    setRide(last);

    const role = localStorage.getItem("userRole");
    const name = role === "driver" ? last?.driverName : last?.passengerName;
    setUserName(name);

    const allMsgs = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(allMsgs.filter((msg) => msg.rideId === last?.requestId));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setDriverLocation(loc);
        });
      }
    }, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ride && driverLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: ride.pickupAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") setDirections(result);
        }
      );

      const distanceService = new window.google.maps.DistanceMatrixService();
      distanceService.getDistanceMatrix(
        {
          origins: [driverLocation],
          destinations: [ride.pickupAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess",
          },
        },
        (response, status) => {
          if (status === "OK") {
            const element = response.rows[0].elements[0];
            setDistanceInfo({
              distance: element.distance.text,
              duration: element.duration_in_traffic.text,
            });
          }
        }
      );
    }
  }, [ride, driverLocation]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !ride) return;

    const newMessage = {
      rideId: ride.requestId,
      sender: userName,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    const all = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const updated = [...all, newMessage];
    localStorage.setItem("chatMessages", JSON.stringify(updated));
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  if (!isLoaded || !ride) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">💬 Chat Room</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat Box */}
        <div className="h-96 overflow-y-auto border p-4 bg-gray-50 rounded">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === userName ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === userName ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                <div className="text-xs font-semibold">
                  [{msg.timestamp}] {msg.sender}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Map and Distance Info */}
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">🚗 Driver Route</h2>
          <GoogleMap
            center={driverLocation || { lat: 32.7767, lng: -96.797 }}
            zoom={12}
            mapContainerStyle={containerStyle}
          >
            {driverLocation && <Marker position={driverLocation} />}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          {distanceInfo && (
            <div className="mt-2">
              <p><strong>Distance:</strong> {distanceInfo.distance}</p>
              <p><strong>Estimated Time (with traffic):</strong> {distanceInfo.duration}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow border px-4 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
