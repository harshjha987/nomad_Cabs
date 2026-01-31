import { useState, useEffect } from "react";
import { Car, User, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import VehicleDetailModal from "../../Driver_Modules/Vehicles/VehicleDetailModal";
import { getVehicleIcon, getVehicleTypeColor } from "../../Driver_Modules/Vehicles/Vehicles";
import { adminVehicleService } from "../../../services/vehicleService";
import { formatDateSafe } from "../../../utils/DateUtil";
import StatusBadge from "../Shared/StatusBadge";
import SearchFilter from "../Shared/SearchFilter";
import Pagination from "../Shared/Pagination";

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const ManageVehicles = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [allVehicles, setAllVehicles] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const vehiclesPerPage = 9;

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await adminVehicleService.getVehiclesByStatus(statusFilter, 0, 1000);
      
      let vehicleList = data.content && Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];

      const transformed = vehicleList.map((v) => ({
        id: v.id,
        driver_id: v.driver_id || v.driverId,
        vehicle_type: (v.vehicle_type || v.vehicleType || "").toLowerCase(),
        registration_number: v.registration_number || v.registrationNumber,
        rc_number: v.registration_number || v.registrationNumber || v.rc_number,
        puc_number: v.puc_number || v.pucNumber,
        insurance_policy_number: v.insurance_number || v.insuranceNumber || v.insurance_policy_number,
        insurance_number: v.insurance_number || v.insuranceNumber,
        puc_expiry: v.puc_expiry_date || v.pucExpiryDate || v.puc_expiry,
        insurance_expiry: v.insurance_expiry_date || v.insuranceExpiryDate || v.insurance_expiry,
        rc_expiry: v.rc_expiry_date || v.rcExpiryDate || v.rc_expiry,
        is_rc_verified: v.verification_status === "APPROVED" || v.verificationStatus === "APPROVED",
        is_puc_verified: v.verification_status === "APPROVED" || v.verificationStatus === "APPROVED",
        is_insurance_verified: v.verification_status === "APPROVED" || v.verificationStatus === "APPROVED",
        created_at: v.created_at || v.createdAt,
        updated_at: v.updated_at || v.updatedAt,
        manufacturer: v.manufacturer,
        model: v.model,
        year: v.year,
        color: v.color,
        verification_status: v.verification_status || v.verificationStatus || "PENDING",
        rejection_reason: v.rejection_reason || v.rejectionReason,
      }));
      
      setAllVehicles(transformed);
    } catch (e) {
      toast.error(e.message || "Failed to fetch vehicles", { theme: "dark", transition: Bounce });
      setAllVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [statusFilter]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setVehicles(allVehicles);
    } else {
      setVehicles(
        allVehicles.filter(
          (v) =>
            (v.registration_number || v.rc_number || "").toLowerCase().includes(term) ||
            (v.manufacturer || "").toLowerCase().includes(term) ||
            (v.model || "").toLowerCase().includes(term) ||
            (v.driver_id || "").toLowerCase().includes(term)
        )
      );
    }
    setCurrentPage(1);
  }, [allVehicles, searchTerm]);

  useEffect(() => {
    if (selectedVehicle) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "");
    }
  }, [selectedVehicle]);

  const totalPages = Math.max(1, Math.ceil(vehicles.length / vehiclesPerPage));
  const currentVehicles = vehicles.slice((currentPage - 1) * vehiclesPerPage, currentPage * vehiclesPerPage);

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Vehicle Management</h1>
        <p className="text-white/50 text-sm md:text-base">Review and approve driver vehicles</p>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col min-w-[180px]">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl bg-[#1d1d1d] text-white/90 text-sm px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-grow min-w-[260px]">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by registration, driver ID, make, or model"
                className="w-full h-12 pl-4 pr-4 rounded-xl bg-[#1d1d1d] text-white/90 text-sm border border-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-white/60">
          {loading ? "Loading..." : vehicles.length ? `Found ${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""}` : "No vehicles found"}
        </div>
        <div className="text-xs text-white/40 tracking-wider uppercase">Page {currentPage} of {totalPages}</div>
      </div>

      {/* Grid */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white" />
          </div>
        ) : currentVehicles.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center rounded-2xl bg-[#141414] border border-white/10 text-white/40 text-sm gap-3">
            <Car className="w-12 h-12 text-white/20" />
            <p>No vehicles match your search</p>
            <p className="text-xs text-white/30">Try changing the status filter or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVehicles.map((vehicle) => {
              const Icon = getVehicleIcon(vehicle.vehicle_type);
              const colorClass = getVehicleTypeColor(vehicle.vehicle_type);
              const regNumber = vehicle.registration_number || vehicle.rc_number || "N/A";
              const vehicleType = (vehicle.vehicle_type || "unknown").toUpperCase();

              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all pointer-events-none" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md group-hover:shadow-lg transition`}>
                        {Icon && <Icon size={28} className="text-white" />}
                      </div>
                      <StatusBadge status={vehicle.verification_status} size="sm" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-lg font-semibold text-white tracking-tight">{vehicleType}</h3>
                      <p className="text-sm text-white/70 font-mono">{regNumber}</p>
                      {(vehicle.manufacturer || vehicle.model) && (
                        <p className="text-xs text-white/50">
                          {vehicle.manufacturer} {vehicle.model}
                        </p>
                      )}
                    </div>

                    {/* Driver Info */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-white/40" />
                        <p className="text-xs text-white/40 uppercase tracking-wide">Driver ID</p>
                      </div>
                      <p className="text-sm text-white/80 font-mono truncate">{vehicle.driver_id || "Unknown"}</p>
                    </div>

                    {/* Documents Status */}
                    {vehicle.puc_expiry && (
                      <div className="pt-3 mt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 mb-1">PUC Expiry</p>
                        <p className="text-xs text-white/70">{formatDateSafe(vehicle.puc_expiry, { variant: "date" })}</p>
                      </div>
                    )}

                    {/* View Details */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-white/70 group-hover:text-white transition">
                      <span>View & Approve</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage - 1} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p + 1)} />

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onRefresh={fetchVehicles}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default ManageVehicles;