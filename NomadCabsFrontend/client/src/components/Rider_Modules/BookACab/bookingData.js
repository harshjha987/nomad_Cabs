export const vehicleTypes = [
  {
    type: "bike",
    name: "Bike",
    description: "Quick & economical",
    capacity: "1",
    icon: "🏍️",
    baseFare: 20,
    perKm: 8,
  },
  {
    type: "auto",
    name: "Auto Rickshaw",
    description: "Affordable short trips",
    capacity: "3",
    icon: "🛺",
    baseFare: 30,
    perKm: 12,
  },
  {
    type: "sedan",
    name: "Sedan",
    description: "Premium comfort",
    capacity: "4",
    icon: "🚙",
    baseFare: 50,
    perKm: 15,
  },
  {
    type: "suv",
    name: "SUV",
    description: "Spacious family ride",
    capacity: "6-7",
    icon: "🚐",
    baseFare: 70,
    perKm: 20,
  },
];

export const paymentMethods = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "wallet", label: "Wallet" },
];

export const calculateFare = (distanceKm, vehicleType) => {
  const v = vehicleTypes.find((v) => v.type === vehicleType);
  if (!v) return null;

  const base = v.baseFare;
  const distanceFare = distanceKm * v.perKm;
  const platformFee = Math.round((base + distanceFare) * 0.05);
  const total = base + distanceFare + platformFee;

  return {
    distanceKm,
    baseFare: base,
    distanceFare,
    platformFee,
    total,
  };
};

export const getMockCoordinates = async (address) => {
  if (!address || address.trim().length < 3) {
    throw new Error("Address must be at least 3 characters long");
  }

  const LAT_MIN = 18.85;
  const LAT_MAX = 19.3;
  const LNG_MIN = 72.75;
  const LNG_MAX = 73.05;

  const lat = LAT_MIN + Math.random() * (LAT_MAX - LAT_MIN);
  const lng = LNG_MIN + Math.random() * (LNG_MAX - LNG_MIN);

  return {
    lat: parseFloat(lat.toFixed(4)),
    lng: parseFloat(lng.toFixed(4)),
  };
};
