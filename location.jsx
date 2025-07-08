import { useNavigate } from "react-router-dom";

const Location = () => {
  const navigate = useNavigate();

  const handleYes = () => {
    navigate("/role");
  };

  const handleNo = () => {
    alert("This app is currently for DFW only.");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white text-center">
      <h2 className="text-2xl mb-4">📍 Are you in DFW?</h2>
      <div className="space-x-4">
        <button
          onClick={handleYes}
          className="bg-lime-400 text-black px-6 py-2 rounded font-semibold"
        >
          Yes, I'm here
        </button>
        <button
          onClick={handleNo}
          className="bg-gray-700 px-6 py-2 rounded font-semibold"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default Location;

