import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ManageRiders from "../components/Admin_Modules/Rider_Board/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/Driver_Board/ManageDrivers";
import ManageVehicles from "../components/Admin_Modules/Vehicle_Board/ManageVehicles";

const ADMIN_NAV_ITEMS = [
  { id: "riders", label: "Rider Board" },
  { id: "drivers", label: "Driver Board" },
  { id: "vehicles", label: "Vehicle Approvals" },
  { id: "fareBoard", label: "Fare Board" },
  { id: "transactions", label: "Transactions" },
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("riders");

  const renderSection = () => {
    switch (activeSection) {
      case "riders":
        return <ManageRiders />;
      case "drivers":
        return <ManageDrivers />;
      case "vehicles":
        return <ManageVehicles />;
      case "fareBoard":
        return (
          <div className="flex items-center justify-center h-full text-white/60">
            <p>Fare Board Coming Soon</p>
          </div>
        );
      case "transactions":
        return (
          <div className="flex items-center justify-center h-full text-white/60">
            <p>Transactions Coming Soon</p>
          </div>
        );
      default:
        return <ManageRiders />;
    }
  };

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={ADMIN_NAV_ITEMS}
    >
      {renderSection()}
    </Sidebar>
  );
};

export default AdminPage;