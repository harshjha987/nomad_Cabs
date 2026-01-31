import { X, UploadCloud } from "lucide-react";
import { useState } from "react";
import { getVehicleIcon } from "./Vehicles";

const AddVehicleModal = ({ onClose, onSubmit, driverId }) => {
  const [formData, setFormData] = useState({
    rc_number: "",
    vehicle_type: "",
    manufacturer: "",
    model: "",
    year: "",
    color: "",
    puc_number: "",
    insurance_policy_number: "",
    puc_expiry: "",
    insurance_expiry: "",
    rc_expiry: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.rc_number.trim()) {
      newErrors.rc_number = "Registration number is required";
    }
    if (!formData.vehicle_type) {
      newErrors.vehicle_type = "Vehicle type is required";
    }
    if (!formData.puc_expiry) {
      newErrors.puc_expiry = "PUC expiry date is required";
    }
    if (!formData.insurance_expiry) {
      newErrors.insurance_expiry = "Insurance expiry date is required";
    }

    // Date validations (must be in future)
    const today = new Date().toISOString().split("T")[0];
    
    if (formData.puc_expiry && formData.puc_expiry < today) {
      newErrors.puc_expiry = "PUC expiry date must be in the future";
    }
    if (formData.insurance_expiry && formData.insurance_expiry < today) {
      newErrors.insurance_expiry = "Insurance expiry date must be in the future";
    }
    if (formData.rc_expiry && formData.rc_expiry < today) {
      newErrors.rc_expiry = "RC expiry date must be in the future";
    }

    // Year validation
    if (formData.year) {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (year < 1980 || year > currentYear + 1) {
        newErrors.year = `Year must be between 1980 and ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const Icon = getVehicleIcon(formData.vehicle_type);

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 inline-flex items-center justify-center
              h-12 w-12 rounded-full cursor-pointer bg-white shadow-lg border border-gray-200
              text-gray-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200
              ring-2 ring-transparent ring-offset-white
              transition-all duration-200 ease-out transform hover:scale-110"
          >
            <X />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              {Icon ? <Icon size={32} className="text-white" /> : "🚗"}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Vehicle
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Fill in the details below
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type */}
            <FormField
              label="Vehicle Type"
              name="vehicle_type"
              required
              error={errors.vehicle_type}
            >
              <select
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.vehicle_type ? "border-red-500" : "border-gray-200"
                }`}
                required
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                <option value="auto">Auto</option>
                <option value="bike">Bike</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
              </select>
            </FormField>

            {/* RC Number */}
            <FormField
              label="Registration Number"
              name="rc_number"
              required
              error={errors.rc_number}
            >
              <input
                type="text"
                name="rc_number"
                value={formData.rc_number}
                onChange={handleChange}
                required
                placeholder="e.g., MH01AB1234"
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.rc_number ? "border-red-500" : "border-gray-200"
                }`}
              />
            </FormField>

            {/* Manufacturer */}
            <FormField label="Manufacturer" name="manufacturer">
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g., Honda, Toyota"
                className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </FormField>

            {/* Model */}
            <FormField label="Model" name="model">
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., City, Innova"
                className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </FormField>

            {/* Year */}
            <FormField label="Year" name="year" error={errors.year}>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1980"
                max={new Date().getFullYear() + 1}
                placeholder="e.g., 2022"
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.year ? "border-red-500" : "border-gray-200"
                }`}
              />
            </FormField>

            {/* Color */}
            <FormField label="Color" name="color">
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., White, Black"
                className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </FormField>

            {/* PUC Number */}
            <FormField label="PUC Number" name="puc_number">
              <input
                type="text"
                name="puc_number"
                value={formData.puc_number}
                onChange={handleChange}
                placeholder="e.g., PUC123456"
                className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </FormField>

            {/* PUC Expiry */}
            <FormField
              label="PUC Expiry Date"
              name="puc_expiry"
              required
              error={errors.puc_expiry}
            >
              <input
                type="date"
                name="puc_expiry"
                value={formData.puc_expiry}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.puc_expiry ? "border-red-500" : "border-gray-200"
                }`}
              />
            </FormField>

            {/* Insurance Number */}
            <FormField label="Insurance Policy Number" name="insurance_policy_number">
              <input
                type="text"
                name="insurance_policy_number"
                value={formData.insurance_policy_number}
                onChange={handleChange}
                placeholder="e.g., INS123456"
                className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </FormField>

            {/* Insurance Expiry */}
            <FormField
              label="Insurance Expiry Date"
              name="insurance_expiry"
              required
              error={errors.insurance_expiry}
            >
              <input
                type="date"
                name="insurance_expiry"
                value={formData.insurance_expiry}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.insurance_expiry ? "border-red-500" : "border-gray-200"
                }`}
              />
            </FormField>

            {/* RC Number (duplicate field, you may want to remove) */}
            <FormField label="RC Number" name="rc_number_alt">
              <input
                type="text"
                name="rc_number"
                value={formData.rc_number}
                onChange={handleChange}
                placeholder="Same as Registration Number"
                disabled
                className="w-full p-3 text-base font-medium text-black bg-gray-100 border-2 border-gray-200 rounded-lg cursor-not-allowed"
              />
            </FormField>

            {/* RC Expiry */}
            <FormField label="RC Expiry Date" name="rc_expiry" error={errors.rc_expiry}>
              <input
                type="date"
                name="rc_expiry"
                value={formData.rc_expiry}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-3 text-base font-medium text-black bg-white border-2 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.rc_expiry ? "border-red-500" : "border-gray-200"
                }`}
              />
            </FormField>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Document uploads will be added in the next version.
              For now, please ensure you have RC, PUC, and Insurance documents ready for verification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all"
            >
              <UploadCloud size={18} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component for form fields
const FormField = ({ label, name, required, error, children }) => (
  <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
    )}
  </div>
);

export default AddVehicleModal;