import { useEffect, useState, useCallback } from "react";
import { formatDateSafe } from "../../../utils/DateUtil";
import VehicleDetailModal from "../../Driver_Modules/Vehicles/VehicleDetailModal";
import { getVehicleIcon } from "../../Driver_Modules/Vehicles/Vehicles";
import { PlusCircle, AlertCircle } from "lucide-react";
import AddVehicleModal from "../../Driver_Modules/Vehicles/AddVehicleModal";
import {
  vehicleService,
  adminVehicleService,
} from "../../../services/vehicleService";
import { driverService } from "../../../services/driverService";

const VehicleCards = ({ driverId = null, onClose, setActiveSection }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [driverProfile, setDriverProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // ✅ Determine if this is admin view or driver's own view
  const isAdminView = !!driverId;

  /**
   * ✅ Fetch driver profile (only for driver's own view)
   */
  const fetchDriverProfile = useCallback(async () => {
    if (isAdminView) {
      setProfileLoading(false);
      return;
    }

    try {
      const profile = await driverService.getMyProfile();
      setDriverProfile(profile);
    } catch (error) {
      if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        setDriverProfile(null);
      } else {
        console.error("Error fetching driver profile:", error);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [isAdminView]);

  /**
   * ✅ Fetch vehicles - smart routing based on view type
   */
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Use correct endpoint based on view type
      const data = isAdminView
        ? await adminVehicleService.getDriverVehicles(driverId)
        : await vehicleService.getMyVehicles();

      // Transform backend response to frontend format
      const transformedVehicles = Array.isArray(data)
        ? data.map((v) => ({
            id: v.id,
            driver_id: v.driverId,
            vehicle_type: v.vehicleType?.toLowerCase(),
            rc_number: v.registrationNumber,
            puc_number: v.pucNumber,
            insurance_policy_number: v.insuranceNumber,
            puc_expiry: v.pucExpiryDate,
            insurance_expiry: v.insuranceExpiryDate,
            rc_expiry: v.rcExpiryDate,
            is_rc_verified: v.verificationStatus === "APPROVED",
            is_puc_verified: v.verificationStatus === "APPROVED",
            is_insurance_verified: v.verificationStatus === "APPROVED",
            created_at: v.createdAt,
            updated_at: v.updatedAt,
            manufacturer: v.manufacturer,
            model: v.model,
            year: v.year,
            color: v.color,
            verification_status: v.verificationStatus,
            rejection_reason: v.rejectionReason,
          }))
        : [];

      setVehicles(transformedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, [driverId, isAdminView]);

  /**
   * ✅ Add new vehicle (only for driver's own view)
   */
  const addVehicle = async (vehicleData) => {
    try {
      await vehicleService.addVehicle(vehicleData);
      setShowCreateModal(false);
      fetchVehicles();
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  useEffect(() => {
    fetchDriverProfile();
  }, [fetchDriverProfile]);

  useEffect(() => {
    if (!profileLoading) {
      fetchVehicles();
    }
  }, [fetchVehicles, profileLoading]);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
            🚗
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Driver Profile Not Found - Show Verification Required */}
      {!isAdminView && !driverProfile && !profileLoading && (
        <div className="bg-[#141414] rounded-2xl p-12 text-center border border-orange-500/30">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-orange-300">
            Verification Required
          </h2>
          <p className="text-white/60 mb-6">
            Please verify your documents before adding vehicles.
          </p>
          <button
            onClick={() => {
              if (setActiveSection) {
                setActiveSection("verification");
              }
            }}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Go to Verification
          </button>
        </div>
      )}

      {/* Show vehicles only if profile exists or is admin view */}
      {(isAdminView || driverProfile) && (
        <>
          {vehicles.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-5">
              <div className="text-6xl">🚗</div>
              <h3 className="text-xl font-semibold text-white">
                No Vehicles Found
              </h3>
              <p className="text-sm text-gray-400 max-w-sm">
                {isAdminView
                  ? "This driver has no vehicles registered."
                  : "No vehicles registered yet. Add one to get started."}
              </p>
              {/* ✅ Only show add button for driver's own view */}
              {!isAdminView && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="h-11 px-8 rounded-xl bg-white text-black font-medium text-sm tracking-wide shadow hover:shadow-lg transition"
                >
                  + Add Vehicle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
              {vehicles.map((vehicle) => {
                const Icon = getVehicleIcon(vehicle?.vehicle_type);
                return (
                  <div
                    key={vehicle.id}
                    className="group bg-[#141414] rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-[#181818] transition cursor-pointer relative overflow-hidden"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />

                    <div className="flex items-start justify-between mb-5 relative">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#1d1d1d] border border-white/10 flex items-center justify-center">
                          {Icon && <Icon size={26} className="text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white capitalize tracking-wide">
                            {vehicle.vehicle_type}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            {vehicle.rc_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {vehicle.is_rc_verified && (
                          <Pill label="RC" color="emerald" />
                        )}
                        {vehicle.is_puc_verified && (
                          <Pill label="PUC" color="blue" />
                        )}
                        {vehicle.is_insurance_verified && (
                          <Pill label="INS" color="purple" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <Row
                        label="PUC Expires"
                        value={formatDateSafe(vehicle.puc_expiry)}
                      />
                      <Row
                        label="Insurance Expires"
                        value={formatDateSafe(vehicle.insurance_expiry)}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 uppercase tracking-wide text-[11px]">
                          Verification
                        </span>
                        <div className="flex gap-1">
                          <Dot ok={vehicle.is_rc_verified} />
                          <Dot ok={vehicle.is_puc_verified} />
                          <Dot ok={vehicle.is_insurance_verified} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-white/10">
                      <button className="w-full flex items-center justify-center gap-2 text-xs font-medium text-white/70 group-hover:text-white transition">
                        <span>View Full Details</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {!isAdminView && (
                <div className="fixed bottom-8 right-8 z-40">
                  <button
                    className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-base
                  hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
                  shadow-lg hover:shadow-xl flex items-center space-x-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCreateModal(true);
                    }}
                  >
                    <PlusCircle
                      className="group-hover:animate-pulse"
                      size={20}
                    />
                    <span>Add Vehicle</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && !isAdminView && (
        <AddVehicleModal
          onClose={() => {
            setShowCreateModal(false);
            fetchVehicles();
          }}
          onSubmit={addVehicle}
        />
      )}

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onRefresh={fetchVehicles}
        />
      )}
    </>
  );
};

// Helper components
const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 text-[11px] uppercase tracking-wide">
      {label}
    </span>
    <span className="text-white/90 text-[11px]">{value}</span>
  </div>
);

const Pill = ({ label, color }) => {
  const map = {
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-medium tracking-wide border ${
        map[color] || ""
      }`}
    >
      {label}
    </span>
  );
};

const Dot = ({ ok }) => (
  <div
    className={`w-3 h-3 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
  />
);

export default VehicleCards;
