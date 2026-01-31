import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { adminDriverService } from "../../../services/driverService";
import SearchFilter from "../Shared/SearchFilter";
import Pagination from "../Shared/Pagination";
import DriverCard from "./DriverCard";
import DriverModal from "./DriverModal";

const FILTER_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phoneNumber" },
  { label: "First Name", value: "firstName" },
  { label: "Last Name", value: "lastName" },
];

const ManageDrivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [filterType, setFilterType] = useState("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 0) => {
    try {
      setLoading(true);
      const response = await adminDriverService.getAllDriversPaginated(page, 20);
      
      const transformed = response.content.map((d) => ({
        id: d.id,
        user_id: d.userId,
        full_name: `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Unknown Driver",
        email: d.email || "N/A",
        phone_number: d.phoneNumber || "",
        aadhaarNumber: d.aadhaarNumber,
        dlNumber: d.dlNumber,
        driver_license: d.dlNumber,
        driver_license_expiry: d.dlExpiryDate,
        aadhar_card: d.aadhaarNumber,
        is_aadhaar_verified: d.verificationStatus === "APPROVED",
        is_driver_license_verified: d.verificationStatus === "APPROVED",
        verification_status: d.verificationStatus,
        city: d.city || "",
        state: d.state || "",
      }));

      setAllDrivers(transformed);
      setDrivers(transformed);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
    } catch (error) {
      toast.error("Failed to fetch drivers", { theme: "dark", transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setDrivers(allDrivers);
      return;
    }
    setDrivers(allDrivers.filter((d) => (d[filterType] || "").toString().toLowerCase().includes(term)));
  }, [searchTerm, filterType, allDrivers]);

  useEffect(() => {
    if (selectedDriver) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "");
    }
  }, [selectedDriver]);

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Driver Management</h1>
        <p className="text-white/50 mt-3 text-sm md:text-base">Manage and monitor all registered drivers</p>
      </div>

      <SearchFilter
        filterType={filterType}
        onFilterChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={FILTER_OPTIONS}
        placeholder={`Search by ${FILTER_OPTIONS.find((o) => o.value === filterType)?.label}`}
      />

      <div className="mt-6 mb-4 flex items-center justify-between text-sm text-white">
        <span>{loading ? "Loading..." : `Showing ${drivers.length} of ${totalElements} driver${totalElements !== 1 ? "s" : ""}`}</span>
        <span>Page {currentPage + 1} of {totalPages}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white" />
        </div>
      ) : drivers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-white/60 text-lg">No drivers found</p>
            <p className="text-white/40 text-sm mt-2">{searchTerm ? "Try adjusting your search" : "No drivers registered yet"}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {drivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} onClick={setSelectedDriver} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {selectedDriver && (
        <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} onRefresh={() => fetchData(currentPage)} />
      )}
    </div>
  );
};

export default ManageDrivers;