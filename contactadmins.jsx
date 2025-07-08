// ✅ Fully updated contactadmins.jsx with correct key saving
import { useState, useEffect } from "react";

const ContactAdmins = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    type: "",
    time: "",
    pickup: "",
    destination: "",
    description: "",
    issue: "",
    resolution: "",
    photo: null,
    location: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
    }));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      type: tab,
      time: "",
      pickup: "",
      destination: "",
      description: "",
      issue: "",
      resolution: "",
      photo: null,
      location: null,
    }));

    if (tab === "Emergency") {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(files[0]) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const key =
      formData.type.toLowerCase() === "emergency"
        ? "emergencies"
        : formData.type.toLowerCase() === "report"
        ? "reports"
        : "disputes";

    const newEntry = { ...formData, status: "Pending" };
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...existing, newEntry]));
    alert(`${formData.type} submitted successfully.`);
    setActiveTab(null);
  };

  const renderFields = () => {
    if (activeTab === "Emergency") {
      return (
        <>
          <select name="issue" onChange={handleChange} className="border w-full p-2 rounded mb-3">
            <option>Select Emergency Type</option>
            <option>Accident</option>
            <option>Harassment</option>
            <option>Theft</option>
            <option>Threat</option>
            <option>Pull Over</option>
            <option>Feeling Unsafe</option>
            <option>Health Emergency</option>
            <option>Driver Mismatch</option>
          </select>
          <textarea
            name="description"
            placeholder="Additional details (optional)"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
          />
          <p className="mb-2 text-sm text-gray-600">
            📍 Location: {formData.location?.lat}, {formData.location?.lng}
          </p>
        </>
      );
    } else if (activeTab === "Report") {
      return (
        <>
          <input name="time" type="datetime-local" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <input name="pickup" placeholder="Pickup Location" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <input name="destination" placeholder="Destination Location" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />

          <select name="issue" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
            <option>Select Report Reason</option>
            <option>Driver not as described</option>
            <option>Unprofessional behavior</option>
            <option>Vehicle not clean</option>
            <option>Payment/fare issues</option>
            <option>Others</option>
          </select>

          <textarea name="description" placeholder="Additional details (optional)" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleChange} className="mb-3" />
        </>
      );
    } else if (activeTab === "Dispute") {
      return (
        <>
          <input name="time" type="datetime-local" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <input name="pickup" placeholder="Pickup Location" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <input name="destination" placeholder="Destination Location" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />

          <select name="issue" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
            <option>Select Dispute Reason</option>
            <option>Fare Dispute</option>
            <option>Rider/Driver Behavior</option>
            <option>Ride Mismatch</option>
            <option>Late Arrival</option>
          </select>

          <textarea name="description" placeholder="Explain the issue..." className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
          <textarea name="resolution" placeholder="What resolution do you expect?" className="w-full p-2 mb-3 border rounded" onChange={handleChange} />
        </>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-4 border rounded shadow">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-4">📞 Contact Admins</h2>

      <div className="flex space-x-4 justify-center mb-6">
        {["Emergency", "Report", "Dispute"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="space-y-3">
          <input name="name" value={formData.name} disabled className="w-full p-2 border rounded bg-gray-100" />
          <input name="phone" value={formData.phone} disabled className="w-full p-2 border rounded bg-gray-100" />
          <input name="gender" value={formData.gender} disabled className="w-full p-2 border rounded bg-gray-100" />

          {renderFields()}

          <button onClick={handleSubmit} className="w-full p-2 bg-green-600 text-white rounded">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactAdmins;

