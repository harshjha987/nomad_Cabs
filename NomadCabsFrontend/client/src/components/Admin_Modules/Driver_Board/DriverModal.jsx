import { useState, useEffect } from "react";
import { X, Pencil, Save, Trash2, Car } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { adminDriverService } from "../../../services/driverService";
import StatusBadge from "../Shared/StatusBadge";
import VehicleView from "./VehicleView";

const DriverModal = ({ driver, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        phone_number: driver.phone_number || "",
        city: driver.city || "",
        state: driver.state || "",
      });
    }
  }, [driver]);

  const handleVerification = async (action, reason = null) => {
    try {
      setIsSaving(true);
      await adminDriverService.verifyDriver(driver.id, action, reason);
      toast.success(`Driver ${action.toLowerCase()}d successfully`, { theme: "dark", transition: Bounce });
      onRefresh?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update verification", { theme: "dark", transition: Bounce });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    const confirmed = await new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5 text-center">
            <p className="font-medium">Delete this driver permanently?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { closeToast(); resolve(true); }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold">
                Delete
              </button>
              <button onClick={() => { closeToast(); resolve(false); }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15">
                Cancel
              </button>
            </div>
          </div>
        ),
        { position: "top-center", autoClose: false, theme: "dark", closeButton: false, transition: Bounce }
      );
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await adminDriverService.deleteDriver(driver.id);
      toast.success("Driver deleted successfully", { theme: "dark", transition: Bounce });
      onRefresh?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete driver", { theme: "dark", transition: Bounce });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!driver) return null;
  if (showVehicles) return <VehicleView driverId={driver.id} onBack={() => setShowVehicles(false)} />;

  const initials = driver.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "D";

  const editableFields = [
    { label: "Phone", name: "phone_number" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
  ];

  const staticFields = [
    { label: "Email", value: driver.email },
    { label: "User ID", value: driver.user_id },
    { label: "Driver ID", value: driver.id },
  ];

  const docs = [
    { label: "Aadhaar", value: driver.aadhar_card, verified: driver.is_aadhaar_verified },
    { label: "DL Number", value: driver.driver_license, verified: driver.is_driver_license_verified },
    { label: "DL Expiry", value: driver.driver_license_expiry },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={isDeleting || isSaving ? undefined : onClose}>
      <div className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-b from-[#181818] to-[#141414] rounded-t-2xl border-b border-white/10 relative">
          <button onClick={onClose} disabled={isDeleting || isSaving}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15 transition disabled:opacity-40">
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pr-14">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-white/80 text-black flex items-center justify-center text-4xl font-bold shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">{driver.full_name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={driver.verification_status} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {driver.verification_status !== "APPROVED" && (
                <>
                  <button onClick={() => handleVerification("APPROVE")} disabled={isSaving}
                    className="h-11 px-6 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-40">
                    {isSaving ? "Approving..." : "Approve"}
                  </button>
                  <button onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) handleVerification("REJECT", reason);
                  }} disabled={isSaving}
                    className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-40">
                    Reject
                  </button>
                </>
              )}
              <button onClick={() => setShowVehicles(true)} disabled={isDeleting || isSaving}
                className="h-11 px-6 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/15 hover:bg-white/15 transition disabled:opacity-40 flex items-center gap-2">
                <Car className="w-4 h-4" /> Vehicles
              </button>
              <button onClick={handleDelete} disabled={isDeleting || isSaving}
                className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-40 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Verification Status */}
          <div className="grid md:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div key={doc.label} className="bg-[#1b1b1b] border border-white/10 rounded-xl p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">{doc.label}</p>
                <div className="text-white/90 text-sm font-medium mb-2">{doc.value || "—"}</div>
                {doc.verified !== undefined && (
                  <StatusBadge status={doc.verified ? "VERIFIED" : "UNVERIFIED"} size="sm" />
                )}
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {editableFields.map((f) => (
                <div key={f.name} className="bg-[#1b1b1b] border border-white/10 rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">{f.label}</p>
                  <div className="text-white/90 text-sm font-medium">{formData[f.name] || "—"}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {staticFields.map((f) => (
                <div key={f.label} className="bg-[#1b1b1b] border border-white/10 rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">{f.label}</p>
                  <div className="text-white/90 text-sm font-medium break-words">{f.value || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverModal;