import { useState, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { driverService } from "../../../services/driverService";

const Verification = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    dlNumber: "",
    dlExpiryDate: "",
  });

  const [errors, setErrors] = useState({});

  /**
   * Fetch driver verification data
   */
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const data = await driverService.getMyProfile();
        setDriverData(data);

        // Populate form with existing data
        setFormData({
          aadhaarNumber: data.aadhaarNumber || "",
          dlNumber: data.dlNumber || "",
          dlExpiryDate: data.dlExpiryDate || "",
        });
      } catch (error) {
        if (
          error.message.includes("404") ||
          error.message.includes("not found")
        ) {
          // No profile exists yet - show form
          setDriverData(null);
        } else {
          console.error("Error fetching driver data:", error);
          toast.error(error.message || "Failed to load driver data", {
            theme: "dark",
            transition: Bounce,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    // Aadhaar validation
    if (!formData.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar must be exactly 12 digits";
    }

    // DL validation
    if (!formData.dlNumber.trim()) {
      newErrors.dlNumber = "Driving license number is required";
    }

    // DL expiry validation
    if (!formData.dlExpiryDate) {
      newErrors.dlExpiryDate = "License expiry date is required";
    } else {
      const expiryDate = new Date(formData.dlExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        newErrors.dlExpiryDate = "License has expired";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit or update verification
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        aadhaarNumber: formData.aadhaarNumber,
        dlNumber: formData.dlNumber,
        dlExpiryDate: formData.dlExpiryDate,
      };

      let data;
      if (driverData) {
        // Update existing profile
        data = await driverService.updateProfile(payload);
      } else {
        // Create new profile
        data = await driverService.createProfile(payload);
      }

      setDriverData(data);

      toast.success(
        driverData
          ? "Verification details updated!"
          : "Verification submitted! Admin will review soon.",
        { theme: "dark", transition: Bounce }
      );
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error(error.message || "Failed to submit verification", {
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        icon: Clock,
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        label: "Pending Review",
      },
      UNDER_REVIEW: {
        icon: AlertCircle,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        label: "Under Review",
      },
      APPROVED: {
        icon: CheckCircle,
        color: "bg-green-500/20 text-green-300 border-green-500/30",
        label: "Verified ✓",
      },
      REJECTED: {
        icon: XCircle,
        color: "bg-red-500/20 text-red-300 border-red-500/30",
        label: "Rejected",
      },
    };

    const style = statusMap[status] || {
      icon: AlertCircle,
      color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      label: "Not Submitted",
    };

    const Icon = style.icon;

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.color}`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{style.label}</span>
      </div>
    );
  };

  console.log("Driver Data:", driverData);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Driver Verification
          </h1>
          <p className="text-gray-400 mt-1">
            Submit your documents to get approved as a driver.
          </p>
        </div>
        {driverData && getStatusBadge(driverData.verificationStatus)}
      </div>

      {/* Rejection reason */}
      {driverData?.verificationStatus === "REJECTED" && (
        <div className="mb-6 bg-red-500/10 p-4 rounded-lg border border-red-500/30 text-red-300">
          <div className="flex items-start gap-2">
            <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="block mb-1">Verification Rejected</strong>
              <p className="text-sm">
                Please check your details and resubmit with correct information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message for approved */}
      {driverData?.verificationStatus === "APPROVED" && (
        <div className="mb-6 bg-green-500/10 p-4 rounded-lg border border-green-500/30 text-green-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="block mb-1">Verification Approved!</strong>
              <p className="text-sm">
                Your profile has been verified. You can now accept ride
                requests.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aadhaar Number */}
          <InputField
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012"
            maxLength="12"
            disabled={saving}
            required
            error={errors.aadhaarNumber}
          />

          {/* Driving License Number */}
          <InputField
            label="Driving License Number"
            name="dlNumber"
            value={formData.dlNumber}
            onChange={handleChange}
            placeholder="MH01 20230012345"
            disabled={saving}
            required
            error={errors.dlNumber}
          />

          {/* License Expiry Date */}
          <InputField
            label="License Expiry Date"
            name="dlExpiryDate"
            type="date"
            value={formData.dlExpiryDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            disabled={saving}
            required
            error={errors.dlExpiryDate}
          />

          {/* Info box */}
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 text-blue-300 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block mb-1">
                  Document Upload Coming Soon
                </strong>
                <p className="text-xs">
                  Your details will be verified by an admin. Make sure all
                  information is accurate.
                </p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {driverData ? "Update & Resubmit" : "Submit for Verification"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Input field component
const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">
      {label}
      {props.required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      {...props}
      className={`w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        error
          ? "border-red-500 focus:ring-red-500/20"
          : "border-white/10 focus:ring-white/20"
      }`}
    />
    {error && <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
  </div>
);

export default Verification;
