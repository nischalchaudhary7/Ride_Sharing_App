import { useEffect, useState } from "react";

const DriverRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const allRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    setRides(allRides);

    const allFeedback = JSON.parse(localStorage.getItem("rideFeedback")) || [];
    setFeedbacks(allFeedback.filter(fb => fb.by === "driver"));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🚗 Your Ride History (Driver)</h1>

      {rides.length === 0 ? (
        <p className="text-center text-gray-500">You have not completed any rides yet.</p>
      ) : (
        rides.map((ride, index) => {
          const feedback = feedbacks.find(fb => fb.rideId === ride.requestId);
          return (
            <div key={index} className="border rounded p-4 mb-4 shadow bg-white">
              <p><strong>Ride ID:</strong> #{ride.requestId}</p>
              <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
              <p><strong>Destination:</strong> {ride.destinationAddress}</p>
              <p><strong>Passenger:</strong> {ride.passengerName}</p>
              <p><strong>Date:</strong> {new Date(ride.acceptedAt).toLocaleString()}</p>
              <p><strong>Fare:</strong> ${ride.driverFare || "N/A"}</p>

              {feedback ? (
                <div className="mt-4 bg-blue-50 p-3 rounded">
                  <h3 className="font-semibold">⭐ Feedback You Gave:</h3>
                  <p><strong>Rating:</strong> {feedback.rating} Stars</p>
                  <p><strong>Comment:</strong> {feedback.comment || "No comment"}</p>
                </div>
              ) : (
                <p className="text-gray-500 mt-3">You haven’t submitted feedback for this ride yet.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DriverRideHistory;

