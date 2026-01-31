import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import VehicleCards from "../components/Common/Vehicles/VehicleCards";
import Live from "../components/Driver_Modules/LiveBooking/Live";
import Verification from "../components/Driver_Modules/Verification/Verification";

const driverNavItems = [
  { id: "liveBookings", label: "Live Bookings" },
  { id: "bookings", label: "My Bookings" },
  { id: "vehicles", label: "Manage Vehicles" },
  { id: "verification", label: "Verification" },
  { id: "account", label: "Manage Account" },
];

const DriverPage = () => {
  const [activeSection, setActiveSection] = useState("liveBookings");

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      {/* ✅ FIX: Pass setActiveSection to Live component */}
      {activeSection === "liveBookings" && (
        <Live setActiveSection={setActiveSection} />
      )}
      {activeSection === "bookings" && <Bookings userRole="driver" />}
      {activeSection === "vehicles" && (
        <VehicleCards setActiveSection={setActiveSection} />
      )}
      {activeSection === "verification" && <Verification />}
      {activeSection === "account" && <ManageAccount />}
    </Sidebar>
  );
};

export default DriverPage;
