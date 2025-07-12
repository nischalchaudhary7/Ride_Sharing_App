// src/admin/adminpassengers.jsx
import { useEffect, useState } from "react";

const AdminPassengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const filtered = users.filter((user) => user.role === "passenger");
    setPassengers(filtered);
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredPassengers = passengers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.email.toLowerCase().includes(searchTerm) ||
    p.phone.includes(searchTerm)
  );

  const handleBlockToggle = (index) => {
    const updated = [...passengers];
    updated[index].isBlocked = !updated[index].isBlocked;
    setPassengers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditedData({ ...passengers[index] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    const updated = [...passengers];
    updated[editingIndex] = editedData;
    setPassengers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    setEditingIndex(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 Passenger Management</h1>

      <input
        type="text"
        placeholder="Search by name, email, or phone"
        className="p-2 border rounded w-full max-w-md mb-4"
        onChange={handleSearch}
      />

      {filteredPassengers.length === 0 ? (
        <p className="text-gray-500">No passengers found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPassengers.map((passenger, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow bg-white space-y-2"
            >
              {editingIndex === index ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleEditChange}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="number"
                    name="age"
                    value={editedData.age}
                    onChange={handleEditChange}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleEditChange}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleEditChange}
                    className="p-2 border rounded w-full"
                  />
                  <button
                    onClick={saveChanges}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    💾 Save
                  </button>
                </div>
              ) : (
                <>
                  <p><strong>Name:</strong> {passenger.name}</p>
                  <p><strong>Age:</strong> {passenger.age}</p>
                  <p><strong>Email:</strong> {passenger.email}</p>
                  <p><strong>Phone:</strong> {passenger.phone}</p>
                  <p>
                    <strong>Status:</strong> {passenger.isBlocked ? (
                      <span className="text-red-600">Blocked</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </p>
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() => startEdit(index)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleBlockToggle(index)}
                      className={`${
                        passenger.isBlocked ? "bg-yellow-500" : "bg-red-600"
                      } text-white px-3 py-1 rounded`}
                    >
                      {passenger.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPassengers;
