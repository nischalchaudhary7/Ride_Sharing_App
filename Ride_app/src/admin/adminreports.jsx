// ✅ Updated: adminreports.jsx
import { useEffect, useState } from "react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(all);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filtered = reports.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.toLowerCase().includes(search.toLowerCase()) ||
      r.pickup?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">📣 Admin Reports</h1>
      <input
        placeholder="🔍 Search by name, phone, pickup, destination"
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={handleSearch}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No reports found.</p>
      ) : (
        filtered.map((r, i) => (
          <div key={i} className="border p-4 mb-4 rounded shadow bg-white">
            <p><strong>Name:</strong> {r.name}</p>
            <p><strong>Phone:</strong> {r.phone}</p>
            <p><strong>Gender:</strong> {r.gender}</p>
            <p><strong>Time:</strong> {new Date(r.time).toLocaleString()}</p>
            <p><strong>Pickup:</strong> {r.pickup}</p>
            <p><strong>Destination:</strong> {r.destination}</p>
            <p><strong>Reason:</strong> {r.issue}</p>
            <p><strong>Additional Info:</strong> {r.description}</p>
            {r.photo && <img src={r.photo} alt="Report" className="w-32 h-32 object-cover rounded mt-2" />}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReports;
