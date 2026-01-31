import { useState } from "react";
import { getVehicleIcon } from "./Vehicles";
import { formatDateSafe } from "../../../utils/DateUtil";
import { 
  X, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { vehicleService, adminVehicleService } from "../../../services/vehicleService";
import { toast, Bounce } from "react-toastify";

const VehicleDetailModal = ({ vehicle, onClose, onRefresh, isAdmin = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  console.log('🎭 VehicleDetailModal render:', {
    isAdmin,
    vehicleId: vehicle?.id,
    status: vehicle?.verification_status,
  });

  if (!vehicle) return null;

  const Icon = getVehicleIcon(vehicle.vehicle_type);
  const status = vehicle.verification_status || 'PENDING';
  
  // ✅ Support both field naming conventions
  const registrationNumber = vehicle.rc_number || vehicle.registration_number || vehicle.registrationNumber || 'N/A';

  /**
   * Confirm deletion
   */
  const confirmDelete = () =>
    new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5 text-center">
            <p className="font-medium text-white/80">
              Delete this vehicle permanently?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  closeToast();
                  resolve(true);
                }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  closeToast();
                  resolve(false);
                }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          theme: "dark",
          closeOnClick: false,
          draggable: false,
          hideProgressBar: true,
          closeButton: false,
          transition: Bounce,
        }
      );
    });

  /**
   * Handle vehicle deletion (Driver only)
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    const confirmed = await confirmDelete();

    if (!confirmed) {
      setIsDeleting(false);
      return;
    }

    try {
      await vehicleService.deleteVehicle(vehicle.id);

      toast.success("Vehicle deleted successfully", {
        theme: "dark",
        transition: Bounce,
      });

      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error(error.message || "Failed to delete vehicle", {
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * ✅ Admin approve vehicle
   */
  const handleApprove = async () => {
    if (isProcessing) return;

    console.log('🟢 Approve clicked for vehicle:', vehicle.id);

    const confirmed = window.confirm(
      `Approve vehicle ${registrationNumber}?`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      console.log('📤 Calling adminVehicleService.verifyVehicle with APPROVE');
      await adminVehicleService.verifyVehicle(vehicle.id, 'APPROVE', null);
      
      toast.success('✅ Vehicle approved successfully!', {
        theme: 'dark',
        transition: Bounce,
      });

      onRefresh && onRefresh();
      onClose();
    } catch (error) {
      console.error('❌ Error approving vehicle:', error);
      toast.error(error.message || 'Failed to approve vehicle', {
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * ✅ Admin reject vehicle
   */
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason', { theme: 'dark' });
      return;
    }

    console.log('🔴 Reject clicked for vehicle:', vehicle.id, 'Reason:', rejectionReason);

    setIsProcessing(true);
    try {
      console.log('📤 Calling adminVehicleService.verifyVehicle with REJECT');
      await adminVehicleService.verifyVehicle(vehicle.id, 'REJECT', rejectionReason);
      
      toast.success('❌ Vehicle rejected', {
        theme: 'dark',
        transition: Bounce,
      });

      onRefresh && onRefresh();
      setShowRejectModal(false);
      onClose();
    } catch (error) {
      console.error('❌ Error rejecting vehicle:', error);
      toast.error(error.message || 'Failed to reject vehicle', {
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * ✅ Admin mark under review
   */
  const handleUnderReview = async () => {
    if (isProcessing) return;

    console.log('🟡 Under Review clicked for vehicle:', vehicle.id);

    const confirmed = window.confirm(
      `Mark vehicle ${registrationNumber} as Under Review?`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      console.log('📤 Calling adminVehicleService.verifyVehicle with UNDER_REVIEW');
      await adminVehicleService.verifyVehicle(vehicle.id, 'UNDER_REVIEW', null);
      
      toast.info('🔍 Vehicle marked as Under Review', {
        theme: 'dark',
        transition: Bounce,
      });

      onRefresh && onRefresh();
      onClose();
    } catch (error) {
      console.error('❌ Error updating vehicle status:', error);
      toast.error(error.message || 'Failed to update vehicle status', {
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get verification status badge
  const getStatusBadge = (s) => {
    const statusMap = {
      APPROVED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
      UNDER_REVIEW: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      PENDING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
          statusMap[s] || statusMap.PENDING
        }`}
      >
        {s || "PENDING"}
      </span>
    );
  };

  console.log('🎯 Render decision:', {
    isAdmin,
    status,
    showAdminActions: isAdmin && status !== 'APPROVED',
  });

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => {
          e.stopPropagation();
          if (!isDeleting && !isProcessing) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] p-6 rounded-t-2xl border-b border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#1f1f1f] border border-white/10 flex items-center justify-center">
                  {Icon && <Icon size={28} className="text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold capitalize tracking-wide text-white/90">
                    {vehicle.vehicle_type} Details
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    {registrationNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Delete Button (Driver only) */}
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting || isProcessing}
                    className="h-11 w-11 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-400 flex items-center justify-center border border-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                {/* Close Button */}
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  disabled={isDeleting || isProcessing}
                  className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-10">
            {/* Verification Status */}
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-white/70 uppercase mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Verification Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <VerifyCard
                  label="Registration Certificate"
                  ok={vehicle.is_rc_verified}
                />
                <VerifyCard
                  label="Pollution Under Control"
                  ok={vehicle.is_puc_verified}
                />
                <VerifyCard
                  label="Vehicle Insurance"
                  ok={vehicle.is_insurance_verified}
                />
              </div>

              {/* Overall Status */}
              <div className="mt-4 flex items-center justify-between p-4 bg-[#181818] rounded-xl border border-white/10">
                <span className="text-sm text-white/60">Overall Status:</span>
                {getStatusBadge(status)}
              </div>

              {/* Rejection Reason */}
              {status === "REJECTED" && vehicle.rejection_reason && (
                <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                  <p className="text-xs font-semibold text-red-300 uppercase mb-1">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-200">{vehicle.rejection_reason}</p>
                </div>
              )}
            </div>

            {/* ✅ ADMIN ACTIONS SECTION */}
            {isAdmin && status !== 'APPROVED' && (
              <div className="pt-6 border-t border-white/10 bg-[#181818] rounded-xl p-6">
                <h3 className="text-sm font-semibold tracking-wide text-white/70 uppercase mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Admin Actions
                </h3>
                <p className="text-xs text-white/50 mb-4">
                  Review vehicle documents and approve, reject, or mark for further review.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      console.log('✅ Approve button clicked');
                      handleApprove();
                    }}
                    disabled={isProcessing || isDeleting}
                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </button>

                  <button
                    onClick={() => {
                      console.log('🔍 Under Review button clicked');
                      handleUnderReview();
                    }}
                    disabled={isProcessing || isDeleting}
                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Under Review'}
                  </button>

                  <button
                    onClick={() => {
                      console.log('❌ Reject button clicked');
                      setShowRejectModal(true);
                    }}
                    disabled={isProcessing || isDeleting}
                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <XCircle className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InfoPanel title="Vehicle Information">
                <InfoRow label="Vehicle Type" value={vehicle.vehicle_type} cap />
                <InfoRow label="Manufacturer" value={vehicle.manufacturer || "—"} />
                <InfoRow label="Model" value={vehicle.model || "—"} />
                <InfoRow label="Year" value={vehicle.year || "—"} />
                <InfoRow label="Color" value={vehicle.color || "—"} cap />
                <InfoRow mono label="Registration Number" value={registrationNumber} />
              </InfoPanel>

              <InfoPanel title="Documents & Expiry">
                <InfoRow mono label="PUC Number" value={vehicle.puc_number || "—"} />
                <InfoRow
                  label="PUC Expiry"
                  value={formatDateSafe(vehicle.puc_expiry, { variant: 'date' })}
                />
                <InfoRow
                  mono
                  label="Insurance Number"
                  value={vehicle.insurance_policy_number || vehicle.insurance_number || "—"}
                />
                <InfoRow
                  label="Insurance Expiry"
                  value={formatDateSafe(vehicle.insurance_expiry, { variant: 'date' })}
                />
                <InfoRow
                  label="RC Expiry"
                  value={formatDateSafe(vehicle.rc_expiry, { variant: 'date' })}
                />
              </InfoPanel>
            </div>

            {/* Timestamps */}
            <InfoPanel title="Record Information">
              <InfoRow
                label="Created At"
                value={formatDateSafe(vehicle.created_at, {
                  variant: 'datetime',
                  timeZone: 'Asia/Kolkata',
                  locale: 'en-IN',
                })}
              />
              <InfoRow
                label="Last Updated"
                value={formatDateSafe(vehicle.updated_at, {
                  variant: 'datetime',
                  timeZone: 'Asia/Kolkata',
                  locale: 'en-IN',
                })}
              />
            </InfoPanel>
          </div>
        </div>
      </div>

      {/* ✅ Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reject Vehicle</h3>
                <p className="text-sm text-white/50">Provide a reason for rejection</p>
              </div>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., Invalid documents, expired insurance)"
              className="w-full h-32 p-4 rounded-xl bg-[#1d1d1d] text-white text-sm border border-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
              disabled={isProcessing}
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper Components
const VerifyCard = ({ label, ok }) => (
  <div
    className={`p-4 rounded-xl border text-center space-y-3 transition relative overflow-hidden ${
      ok
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-red-400/30 bg-red-500/10"
    }`}
  >
    <div
      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-sm font-semibold ${
        ok ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {ok ? "✓" : "✕"}
    </div>
    <h4 className="text-[11px] font-medium tracking-wide text-white/70 uppercase leading-snug px-1">
      {label}
    </h4>
    <p
      className={`text-[11px] font-semibold tracking-wide ${
        ok ? "text-emerald-300" : "text-red-300"
      }`}
    >
      {ok ? "Verified" : "Not Verified"}
    </p>
  </div>
);

const InfoPanel = ({ title, children }) => (
  <div className="bg-[#181818] rounded-xl p-5 border border-white/10">
    <h3 className="text-xs font-semibold tracking-wide text-white/60 uppercase mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, mono, cap }) => (
  <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-none last:pb-0">
    <span className="text-[11px] tracking-wide text-white/40 uppercase">
      {label}
    </span>
    <span
      className={`text-[12px] font-medium text-white/90 ${
        mono ? "font-mono" : ""
      } ${cap ? "capitalize" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default VehicleDetailModal;