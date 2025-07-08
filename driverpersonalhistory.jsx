import { useEffect, useState } from "react";

const DriverPersonalHistory = () => {
  const [rides, setRides] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const currentDriver = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentDriver || !currentDriver.email) return;

    const allRides = JSON.parse(localStorage.getItem("confirmedRides")) || [];
    const driverRides = allRides.filter(
      (ride) => ride.driverEmail === currentDriver.email
    );
    setRides(driverRides);

    const allFeedbacks = JSON.parse(localStorage.getItem("rideFeedback")) || [];
    const driverFeedbacks = allFeedbacks.filter(
      (fb) => fb.by === "driver" && fb.userEmail === currentDriver.email
    );
    setFeedbacks(driverFeedbacks);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">🧾 My Ride History</h1>

      {rides.length === 0 ? (
        <p className="text-center text-gray-500">You have not completed any rides yet.</p>
      ) : (
        rides.map((ride, index) => {
          const feedback = feedbacks.find((fb) => fb.rideId === ride.requestId);
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
                  <h3 className="font-semibold">⭐ Feedback You Gave</h3>
                  <p><strong>Rating:</strong> {feedback.rating} Stars</p>
                  <p><strong>Comment:</strong> {feedback.comment || "No comment"}</p>
                </div>
              ) : (
                <p className="text-gray-500 mt-3">No feedback submitted for this ride.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DriverPersonalHistory;
