import { Bike, Car, CarFront, CarTaxiFront } from "lucide-react";

/**
 * Get vehicle icon component based on vehicle type
 * @param {string} type - Vehicle type (bike, auto, sedan, suv)
 * @returns {Component} Lucide icon component
 */
export const getVehicleIcon = (type) => {
  // Custom Auto Rickshaw Emoji Component
  const AutoEmoji = ({ size = 20, className = "" }) => (
    <span
      role="img"
      aria-label="auto"
      style={{ fontSize: size, lineHeight: 1 }}
      className={className}
    >
      🛺
    </span>
  );

  const iconMap = {
    sedan: CarFront,
    suv: CarTaxiFront,
    bike: Bike,
    auto: AutoEmoji,
    default: Car,
  };

  const normalizedType = type?.toLowerCase();
  return iconMap[normalizedType] || iconMap.default;
};

/**
 * Get vehicle type display name
 * @param {string} type - Vehicle type
 * @returns {string} Display name
 */
export const getVehicleTypeName = (type) => {
  const nameMap = {
    bike: "Bike",
    auto: "Auto Rickshaw",
    sedan: "Sedan",
    suv: "SUV",
  };

  return nameMap[type?.toLowerCase()] || "Vehicle";
};

/**
 * Get vehicle type color for UI
 * @param {string} type - Vehicle type
 * @returns {string} Tailwind color class
 */
export const getVehicleTypeColor = (type) => {
  const colorMap = {
    bike: "from-blue-500 to-blue-600",
    auto: "from-yellow-500 to-orange-600",
    sedan: "from-gray-500 to-gray-600",
    suv: "from-purple-500 to-purple-600",
  };

  return colorMap[type?.toLowerCase()] || "from-gray-500 to-gray-600";
};

export default {
  getVehicleIcon,
  getVehicleTypeName,
  getVehicleTypeColor,
};