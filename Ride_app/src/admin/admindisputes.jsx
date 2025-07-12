// ✅ Updated: admindisputes.jsx
import { useEffect, useState } from "react";

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [search, setSearch] = useState("");
  const [resolvedDisputes, setResolvedDisputes] = useState(() => {
    return JSON.parse(localStorage.getItem("resolvedDisputes")) || [];
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("disputes")) || [];
    setDisputes(stored);
  }, []);

  const handleResolve = (index) => {
    const updated = [...disputes];
    updated[index].status = "Resolved";
    setDisputes(updated);
    localStorage.setItem("disputes", JSON.stringify(updated));
    setResolvedDisputes((prev) => [...prev, index]);
    localStorage.setItem("resolvedDisputes", JSON.stringify([...resolvedDisputes, index]));
  };

  const filteredDisputes = disputes.filter((d) => {
    const keyword = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(keyword) ||
      d.phone?.toLowerCase().includes(keyword) ||
      d.pickup?.toLowerCase().includes(keyword) ||
      d.destination?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🧾 Admin - Ride Disputes</h1>

      <input
        type="text"
        placeholder="Search by name, phone, pickup, destination"
        className="w-full p-2 border mb-4 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredDisputes.length === 0 ? (
        <p className="text-gray-500">No disputes submitted.</p>
      ) : (
        filteredDisputes.map((d, index) => (
          <div key={index} className="border rounded p-4 mb-4 shadow bg-white">
            <p><strong>Name:</strong> {d.name}</p>
            <p><strong>Phone:</strong> {d.phone}</p>
            <p><strong>Gender:</strong> {d.gender}</p>
            <p><strong>Time:</strong> {d.time}</p>
            <p><strong>Pickup:</strong> {d.pickup}</p>
            <p><strong>Destination:</strong> {d.destination}</p>
            <p><strong>Reason:</strong> {d.issue}</p>
            <p><strong>Details:</strong> {d.description}</p>
            <p><strong>Resolution Requested:</strong> {d.resolution}</p>
            {d.photo && <img src={d.photo} alt="Uploaded" className="w-40 h-40 object-cover mt-2" />}
            <div className="mt-4">
              {resolvedDisputes.includes(index) ? (
                <span className="text-green-600 font-semibold">✅ Resolved</span>
              ) : (
                <button
                  onClick={() => handleResolve(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDisputes;

