import { useEffect, useState } from "react";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("driverApplications")) || [];
    setDrivers(stored);
  }, []);

  const handleStatusChange = (index, status) => {
    const updated = [...drivers];
    updated[index].status = status;
    setDrivers(updated);
    localStorage.setItem("driverApplications", JSON.stringify(updated));
  };

  const handleEdit = (index, field, value) => {
    const updated = [...drivers];
    updated[index][field] = value;
    setDrivers(updated);
    localStorage.setItem("driverApplications", JSON.stringify(updated));
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚘 Driver Management</h1>
      <input
        type="text"
        placeholder="Search by name, email, phone, or license ID"
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredDrivers.map((driver, index) => (
        <div
          key={index}
          className="border p-4 rounded mb-4 bg-white shadow space-y-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={driver.name}
              onChange={(e) => handleEdit(index, "name", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="email"
              value={driver.email}
              onChange={(e) => handleEdit(index, "email", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="tel"
              value={driver.phone}
              onChange={(e) => handleEdit(index, "phone", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={driver.licenseId}
              onChange={(e) => handleEdit(index, "licenseId", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={driver.vehicleModel}
              onChange={(e) => handleEdit(index, "vehicleModel", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={driver.vehiclePlate}
              onChange={(e) => handleEdit(index, "vehiclePlate", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {driver.driverPhoto && (
              <img
                src={driver.driverPhoto}
                alt="Driver"
                className="w-full h-32 object-cover border rounded"
              />
            )}
            {driver.licensePhoto && (
              <img
                src={driver.licensePhoto}
                alt="License"
                className="w-full h-32 object-cover border rounded"
              />
            )}
            {driver.carFrontPhoto && (
              <img
                src={driver.carFrontPhoto}
                alt="Car Front"
                className="w-full h-32 object-cover border rounded"
              />
            )}
            {driver.carBackPhoto && (
              <img
                src={driver.carBackPhoto}
                alt="Car Back"
                className="w-full h-32 object-cover border rounded"
              />
            )}
            {driver.insurancePhoto && (
              <img
                src={driver.insurancePhoto}
                alt="Insurance"
                className="w-full h-32 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => handleStatusChange(index, "approved")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleStatusChange(index, "rejected")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ❌ Reject
            </button>
            <button
              onClick={() => handleStatusChange(index, "blocked")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🚫 Block
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Current Status: <strong>{driver.status}</strong>
          </p>
        </div>
      ))}
    </div>
  );
};

export default DriverManagement;