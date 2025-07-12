const AdminSidebar = ({ setActiveTab, activeTab }) => {
  const tabs = [
    { name: "Dashboard" },
    { name: "Drivers" },
    { name: "Passengers" },
    { name: "DriverHistory", label: "Driver Ride History" },
    { name: "PassengerHistory", label: "Passenger Ride History" },
    { name: "Emergencies" },
    { name: "Reports" },
    { name: "Disputes" },
  ];

  return (
    <div className="bg-gray-800 text-white w-60 p-5 min-h-screen">
      <h2 className="text-xl font-bold mb-8 flex items-center">
        <span className="mr-2">🛡️</span> Admin Panel
      </h2>

      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`cursor-pointer hover:text-blue-300 ${
              activeTab === tab.name ? "text-blue-400 font-semibold" : ""
            }`}
          >
            {tab.label || tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
