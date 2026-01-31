import { useState, useEffect } from "react";
import { X, Pencil, Save, Trash2, Mail, Shield, CalendarClock, UserCheck } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { userService } from "../../../services/userService";
import { formatDateSafe } from "../../../utils/DateUtil";
import StatusBadge from "../Shared/StatusBadge";

const RiderModal = ({ rider, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
    status: "active",
  });

  useEffect(() => {
    if (rider) {
      setFormData({
        phone_number: rider.phone_number || "",
        city: rider.city || "",
        state: rider.state || "",
        status: rider.status?.toLowerCase() || "active",
      });
    }
  }, [rider]);

  const handleUpdate = async () => {
    try {
      const payload = {
        first_name: rider.first_name,
        last_name: rider.last_name,
        email: rider.email,
        phone_number: formData.phone_number,
        city: formData.city,
        state: formData.state,
        role: rider.role?.toUpperCase(),
      };

      await userService.updateUser(rider.id, payload);
      
      if (formData.status !== rider.status?.toLowerCase()) {
        await userService.updateUserStatus(rider.id, formData.status.toUpperCase());
      }

      toast.success("Rider updated successfully", { transition: Bounce, theme: "dark" });
      setIsEditing(false);
      onRefresh?.();
    } catch (e) {
      toast.error(e.message || "Error updating rider", { transition: Bounce, theme: "dark" });
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    const confirmed = await new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5 text-center">
            <p className="font-medium">Delete this rider permanently?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { closeToast(); resolve(true); }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold">Delete</button>
              <button onClick={() => { closeToast(); resolve(false); }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15">Cancel</button>
            </div>
          </div>
        ),
        { position: "top-center", autoClose: false, theme: "dark", closeButton: false, transition: Bounce }
      );
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await userService.deleteUser(rider.id);
      toast.success("Rider deleted successfully", { transition: Bounce, theme: "dark" });
      onRefresh?.();
      onClose();
    } catch (e) {
      toast.error(e.message || "Error deleting rider", { transition: Bounce, theme: "dark" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!rider) return null;

  const initials = `${(rider.first_name?.[0] || "").toUpperCase()}${(rider.last_name?.[0] || "").toUpperCase()}`;

  const editableFields = [
    { key: "phone_number", label: "Phone Number" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
  ];

  const staticFields = [
    { label: "Email", value: rider.email, icon: <Mail className="w-4 h-4 text-white/40" /> },
    { label: "Role", value: rider.role, icon: <Shield className="w-4 h-4 text-white/40" />, isBadge: true },
    { label: "Created", value: formatDateSafe(rider.created_at, { variant: "datetime", timeZone: "Asia/Kolkata" }), icon: <CalendarClock className="w-4 h-4 text-white/40" /> },
    { label: "Updated", value: formatDateSafe(rider.updated_at, { variant: "datetime", timeZone: "Asia/Kolkata" }), icon: <CalendarClock className="w-4 h-4 text-white/40" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onClose}>
      <div className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] p-8 rounded-t-2xl border-b border-white/10">
          <button onClick={onClose} disabled={isDeleting}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pr-14">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-white/80 text-black flex items-center justify-center text-4xl font-bold shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {rider.first_name} {rider.last_name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                  <StatusBadge status={rider.is_email_verified ? "VERIFIED" : "UNVERIFIED"} size="sm" />
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white text-black border border-white">
                    {rider.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 shadow hover:shadow-lg transition disabled:opacity-40">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} disabled={isDeleting}
                    className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 shadow hover:shadow-lg transition disabled:opacity-40">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setIsEditing(false)} disabled={isDeleting}
                    className="h-11 px-6 rounded-xl bg-white/10 text-white text-sm font-medium flex items-center gap-2 border border-white/15 hover:bg-white/15 transition disabled:opacity-40">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              )}
              {!isEditing && (
                <button onClick={handleDelete} disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-medium flex items-center gap-2 shadow hover:bg-red-700 transition disabled:opacity-40">
                  <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Status Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-wider text-white/40 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Status
              </p>
              {isEditing ? (
                <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>
              ) : (
                <StatusBadge status={formData.status} />
              )}
            </div>

            <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-wider text-white/40 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5" /> Email Verified
              </p>
              <StatusBadge status={rider.is_email_verified ? "VERIFIED" : "UNVERIFIED"} />
            </div>
          </div>

          {/* Fields */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Editable */}
            <div className="space-y-6">
              {editableFields.map((field) => (
                <div key={field.key} className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5">
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">{field.label}</p>
                  {isEditing ? (
                    <input value={formData[field.key]} onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15" />
                  ) : (
                    <div className="text-white/90 text-sm font-medium">{formData[field.key] || "—"}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Static */}
            <div className="space-y-6">
              {staticFields.map((field, i) => (
                <div key={i} className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5">
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
                    {field.icon} {field.label}
                  </p>
                  {field.isBadge ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black border border-white">
                      {field.value}
                    </span>
                  ) : (
                    <div className="text-white/90 text-sm font-medium break-words">{field.value || "—"}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderModal;