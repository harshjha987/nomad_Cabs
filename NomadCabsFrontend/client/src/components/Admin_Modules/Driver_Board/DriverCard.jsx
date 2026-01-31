import StatusBadge from "../Shared/StatusBadge";

const DriverCard = ({ driver, onClick }) => {
  const initials = driver.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "D";

  const docs = [
    { label: "DL", value: driver.driver_license, verified: driver.is_driver_license_verified },
    { label: "Aadhaar", value: driver.aadhar_card, verified: driver.is_aadhaar_verified },
  ];

  return (
    <div
      onClick={() => onClick(driver)}
      className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-white to-white/70 text-black font-semibold flex items-center justify-center text-sm shadow-sm group-hover:shadow-md transition">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white/90 group-hover:text-white truncate tracking-tight">
              {driver.full_name}
            </h3>
            <StatusBadge status={driver.verification_status} size="sm" />
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2 text-xs">
          {docs.map((doc) => (
            <div key={doc.label} className="flex items-center gap-2">
              <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
                {doc.label}
              </span>
              <span className="text-white/80 font-medium truncate flex-1">
                {doc.value || "—"}
              </span>
              <StatusBadge 
                status={doc.verified ? "VERIFIED" : "UNVERIFIED"} 
                size="sm" 
                showIcon={false}
              />
            </div>
          ))}
        </div>

        {/* Contact */}
        {(driver.email || driver.phone_number) && (
          <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
            {driver.email && (
              <div className="flex items-center gap-2">
                <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">Email</span>
                <span className="text-white/80 truncate flex-1">{driver.email}</span>
              </div>
            )}
            {driver.phone_number && (
              <div className="flex items-center gap-2">
                <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">Phone</span>
                <span className="text-white/80">{driver.phone_number}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-white to-white/0 group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default DriverCard;