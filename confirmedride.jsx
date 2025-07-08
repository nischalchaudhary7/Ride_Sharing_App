import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ConfirmedRide = () => {
  const [ride, setRide] = useState(null);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allConfirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const last = allConfirmed[allConfirmed.length - 1];
    setRide(last);
  }, []);

  const handleFeedbackSubmit = () => {
    const feedback = {
      rideId: ride.requestId,
      by: "passenger",
      rating,
      comment,
      submittedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("rideFeedback")) || [];
    localStorage.setItem("rideFeedback", JSON.stringify([...existing, feedback]));
    setFeedbackSubmitted(true);

    // ✅ Remove ride from driver requests
    const allRequests = JSON.parse(localStorage.getItem("rideRequests")) || [];
    const updatedRequests = allRequests.filter(r => r.requestId !== ride.requestId);
    localStorage.setItem("rideRequests", JSON.stringify(updatedRequests));
  };

  const handleCancelRide = () => {
    const reason = prompt("❌ Why are you cancelling this ride?");
    if (!reason) return;

    const cancelled = {
      rideId: ride.requestId,
      cancelledBy: ride.currentUser,
      reason,
      timestamp: new Date().toISOString()
    };

    const allCancelled = JSON.parse(localStorage.getItem("cancelledRides")) || [];
    allCancelled.push(cancelled);
    localStorage.setItem("cancelledRides", JSON.stringify(allCancelled));

    const confirmed = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const updated = confirmed.filter(r => r.requestId !== ride.requestId);
    localStorage.setItem("confirmedRides", JSON.stringify(updated));

    const otherPartyEmail = ride.currentUser === "driver" ? ride.passengerEmail : ride.driverEmail;
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      to: otherPartyEmail,
      message: `🚫 Your ride was cancelled by the ${ride.currentUser}. Reason: ${reason}`,
      rideId: ride.requestId,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // ✅ Remove ride from driver requests
    const allRequests = JSON.parse(localStorage.getItem("rideRequests")) || [];
    const updatedRequests = allRequests.filter(r => r.requestId !== ride.requestId);
    localStorage.setItem("rideRequests", JSON.stringify(updatedRequests));

    alert("❌ Ride cancelled successfully.");
    navigate(ride.currentUser === "driver" ? "/driverdashboard" : "/passengerdashboard");
  };

  if (!ride) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">No confirmed ride found.</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
        ✅ Ride Confirmed!
      </h1>

      <div className="border p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">🚗 Driver Info</h2>
        <p><strong>Name:</strong> {ride.driverName}</p>
        <p><strong>Gender:</strong> {ride.driverGender}</p>
        <p><strong>Age:</strong> {ride.driverAge}</p>
        <p><strong>ID:</strong> {ride.driverId}</p>

        <h2 className="text-xl font-semibold mt-4">🧍 Passenger Info</h2>
        <p><strong>Name:</strong> {ride.passengerName}</p>
        <p><strong>Gender:</strong> {ride.passengerGender}</p>
        <p><strong>Age:</strong> {ride.passengerAge}</p>

        <h2 className="text-xl font-semibold mt-4">📍 Ride Info</h2>
        <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
        <p><strong>Destination:</strong> {ride.destinationAddress}</p>
        <p><strong>Accepted At:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>

        <p className="text-lg font-semibold text-blue-700 mt-2">
          💰 Final Fare: ${ride.driverFare || "N/A"}
        </p>

        <p className="font-bold text-green-700 mt-4">🎯 Ride ID: #{ride.requestId}</p>

        <Link
          to="/chatroom"
          className="block text-center mt-4 text-blue-600 underline font-semibold hover:text-blue-800"
        >
          💬 Open Chatroom with Your Driver
        </Link>

        {!rideCompleted && (
          <>
            <button
              onClick={() => setRideCompleted(true)}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
            >
              ✅ Mark Ride as Completed
            </button>

            {/* Cancel Ride Button only visible before ride is completed */}
            <button
              onClick={handleCancelRide}
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ❌ Cancel Ride
            </button>
          </>
        )}
      </div>

      {rideCompleted && !feedbackSubmitted && (
        <div className="mt-8 border p-4 rounded shadow bg-gray-50">
          <h2 className="text-xl font-bold mb-2 text-center text-blue-700">
            🙏 Thank you! How would you rate your driver?
          </h2>

          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Leave a comment (optional)"
            className="w-full p-2 border rounded mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleFeedbackSubmit}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Submit Feedback
          </button>
        </div>
      )}

      {feedbackSubmitted && (
        <div className="mt-6 text-green-600 font-semibold text-center">
          ✅ Feedback submitted! Thank you!
        </div>
      )}
    </div>
  );
};

export default ConfirmedRide;







