// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedroute';

// Public Pages
import DevPanel from "./pages/devpanel";
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import ChooseRole from './pages/role';
import DriverApplication from './pages/driverapplication';
import LocationCheck from './pages/location';
import Chatroom from './pages/chatroom';
import AdminLogin from './pages/adminlogin';


// Passenger Pages
import PassengerSidebarPage from './pages/passengersidebarpage';
import PassengerDashboard from './pages/passengerdashboard';
import PassengerSearchRide from './pages/passengersearchride';
import ViewOffers from './pages/viewoffers';
import ConfirmedRide from './pages/confirmedride';
import PassengerProfile from './pages/passengerprofile';
import PassengerPersonalHistory from './pages/passengerpersonalhistory';
import ContactAdmins from './pages/contactadmins';

// Driver Pages
import DriverSidebarPage from './pages/driversidebarpage';
import DriverDashboard from './pages/driverdashboard';
import DriverRequest from './pages/driverrequest';
import PostRide from './pages/postride';
import DriverProfile from './pages/driverprofile';
import DriverPersonalHistory from './pages/driverpersonalhistory';
import DriverApprovalPending from "./pages/driverapprovalpending.jsx";


// Admin Panel
import AdminPanel from './pages/adminpanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/devpanel" element={<DevPanel />} />
        <Route path="/location" element={<LocationCheck />} />
        <Route path="/role" element={<ChooseRole />} />
        <Route path="/driverapplication" element={<DriverApplication />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/driverapprovalpending" element={<DriverApprovalPending />} />

        {/* Passenger Routes */}
        <Route element={<ProtectedRoute role="passenger" />}>
          <Route path="/passengersidebar" element={<PassengerSidebarPage />}>
            <Route path="passengerdashboard" element={<PassengerDashboard />} />
            <Route path="passengersearchride" element={<PassengerSearchRide />} />
            <Route path="viewoffers" element={<ViewOffers />} />
            <Route path="confirmedride" element={<ConfirmedRide />} />
            <Route path="passengerprofile" element={<PassengerProfile />} />
            <Route path="passengerpersonalhistory" element={<PassengerPersonalHistory />} />
            <Route path="contactadmins" element={<ContactAdmins />} />
          </Route>
        </Route>

        {/* Driver Routes */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driversidebar" element={<DriverSidebarPage />}>
            <Route path="driverdashboard" element={<DriverDashboard />} />
            <Route path="driverrequest" element={<DriverRequest />} />
            <Route path="postride" element={<PostRide />} />
            <Route path="confirmedride" element={<ConfirmedRide />} />
            <Route path="driverprofile" element={<DriverProfile />} />
            <Route path="driverpersonalhistory" element={<DriverPersonalHistory />} />
            <Route path="contactadmins" element={<ContactAdmins />} />
          </Route>
        </Route>

        {/* Admin Panel */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/adminpanel" element={<AdminPanel />} />
        </Route>

        {/* Fallback dashboard route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;




