import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverApplication = () => {
  const [driver, setDriver] = useState({
    id: Date.now(), // unique ID
    name: "",
    age: "",
    gender: "",
    licenseId: "",
    phone: "",
    experience: "",
    vehicleModel: "",
    vehiclePlate: "",
    driverPhoto: null,
    licensePhoto: null,
    carFrontPhoto: null,
    carBackPhoto: null,
    insurancePhoto: null,
    approved: false,
    blocked: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setDriver((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setDriver((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (Number(driver.age) < 18) {
      alert("❌ You must be at least 18 years old to apply as a driver.");
      return;
    }

    const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    localStorage.setItem("drivers", JSON.stringify([...drivers, driver]));

    alert("✅ Application submitted! Please wait for admin approval.");
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">🚗 Driver Application</h1>

      <div className="space-y-3">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="gender" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="licenseId" placeholder="Driver License ID" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="experience" placeholder="Driving Experience" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="vehicleModel" placeholder="Vehicle Model" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="vehiclePlate" placeholder="Vehicle Plate Number" onChange={handleChange} className="w-full p-2 border rounded" />

        <label>Driver Photo</label>
        <input type="file" name="driverPhoto" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

        <label>License Photo</label>
        <input type="file" name="licensePhoto" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

        <label>Car Front Photo</label>
        <input type="file" name="carFrontPhoto" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

        <label>Car Back Photo</label>
        <input type="file" name="carBackPhoto" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

        <label>Insurance Card Photo</label>
        <input type="file" name="insurancePhoto" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />

        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default DriverApplication;


