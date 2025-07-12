import React, { useState, useEffect } from 'react';

const AdminEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('emergencies');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
          setEmergencies(parsed);
        } else {
          setEmergencies([]);
        }
      } catch {
        setEmergencies([]);
      }
    }
  }, []);

  const markAsResolved = (index) => {
    const updated = [...emergencies];
    updated[index].status = 'Resolved';
    setEmergencies(updated);
    localStorage.setItem('emergencies', JSON.stringify(updated));
  };

  const activeReports = emergencies.filter(em => !em.status || em.status.toLowerCase() === 'pending');
  const archivedReports = emergencies.filter(em => em.status && em.status.toLowerCase() === 'resolved');

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">🚨 Emergency Reports</h1>

      {/* Active Reports */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Active Reports</h2>
        {activeReports.length === 0 ? (
          <p className="text-gray-600">No active emergency reports.</p>
        ) : (
          activeReports.map((em, idx) => (
            <div key={idx} className="bg-white shadow rounded-lg p-5 mb-5">
              <p><strong>Name:</strong> {em.name}</p>
              <p><strong>Phone:</strong> {em.phone}</p>
              <p><strong>Gender:</strong> {em.gender}</p>
              <p><strong>Emergency Type:</strong> {em.issue}</p>
              <p><strong>More Info:</strong> {em.description}</p>
              <p>
                <strong>Location:</strong>{" "}
                {em.location?.lat && em.location?.lng ? (
                  <a
                    href={`https://maps.google.com?q=${em.location.lat},${em.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Map
                  </a>
                ) : "N/A"}
              </p>
              <p><strong>Status:</strong> {em.status || "Pending"}</p>
              <button
                onClick={() => markAsResolved(idx)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
              >
                Mark as Resolved
              </button>
            </div>
          ))
        )}
      </section>

      {/* Archived Reports */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Archived Reports</h2>
        {archivedReports.length === 0 ? (
          <p className="text-gray-600">No archived (resolved) reports.</p>
        ) : (
          archivedReports.map((em, idx) => (
            <div key={idx} className="bg-gray-100 border border-gray-300 rounded-lg p-5 mb-5">
              <p><strong>Name:</strong> {em.name}</p>
              <p><strong>Phone:</strong> {em.phone}</p>
              <p><strong>Gender:</strong> {em.gender}</p>
              <p><strong>Emergency Type:</strong> {em.issue}</p>
              <p><strong>More Info:</strong> {em.description}</p>
              <p>
                <strong>Location:</strong>{" "}
                {em.location?.lat && em.location?.lng ? (
                  <a
                    href={`https://maps.google.com?q=${em.location.lat},${em.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Map
                  </a>
                ) : "N/A"}
              </p>
              <p><strong>Status:</strong> {em.status}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AdminEmergencies;


