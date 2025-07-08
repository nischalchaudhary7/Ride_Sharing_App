// src/pages/driverapprovalpending.jsx
import { useNavigate } from "react-router-dom";

const DriverApprovalPending = () => {
  const navigate = useNavigate();

  const handleContactAdmin = () => {
    navigate("/driversidebar/contactadmins");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-gray-50 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-4">🚧 Approval Pending</h1>
        <p className="text-center text-gray-700 mb-6">
          Thank you for signing up as a driver. Your application is under review by the admin.
          You’ll be notified once your profile is approved.
        </p>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-700 text-center">📩 Need Help?</h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            If you have questions or need to report something urgent, you can contact the admin from the support portal.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleContactAdmin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Go to Contact Admins Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApprovalPending;


