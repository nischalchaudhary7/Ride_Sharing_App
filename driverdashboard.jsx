import { useEffect, useState } from "react";

const DriverDashboard = () => {
  const [lastRide, setLastRide] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // Get all confirmed rides
    const confirmedRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    if (confirmedRides.length > 0) {
      setLastRide(confirmedRides[confirmedRides.length - 1]);
    }
  }, []);

  const handleSubmitFeedback = () => {
    const feedback = {
      rideId: lastRide.requestId,
      passengerName: lastRide.passengerName,
      rating,
      comment,
      submittedAt: new Date().toISOString(),
      by: "driver",
    };

    const existing = JSON.parse(localStorage.getItem("rideFeedback")) || [];
    localStorage.setItem("rideFeedback", JSON.stringify([...existing, feedback]));
    setFeedbackSubmitted(true);
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🚗 Driver Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, driver! You’re approved to start getting ride requests.</p>

      {lastRide && (
        <div className="max-w-xl mx-auto border p-4 rounded shadow bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">🧍 Last Ride Passenger:</h2>
          <p><strong>Name:</strong> {lastRide.passengerName}</p>
          <p><strong>Gender:</strong> {lastRide.passengerGender}</p>
          <p><strong>Age:</strong> {lastRide.passengerAge}</p>
          <p><strong>Pickup:</strong> {lastRide.pickupAddress}</p>
          <p><strong>Destination:</strong> {lastRide.destinationAddress}</p>

          {!feedbackSubmitted ? (
            <>
              <h3 className="mt-4 text-lg font-semibold text-blue-600">How would you rate this passenger?</h3>

              <div className="flex justify-center space-x-2 my-2">
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
                onClick={handleSubmitFeedback}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Submit Feedback
              </button>
            </>
          ) : (
            <div className="text-green-600 font-semibold mt-4">✅ Feedback submitted!</div>
          )}
        </div>
      )}

      {!lastRide && (
        <div className="mt-8 text-gray-500">No ride completed yet.</div>
      )}
    </div>
  );
};

export default DriverDashboard;

  