import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  APPROVED: { icon: CheckCircle, color: "bg-emerald-900/40 text-emerald-300 border-emerald-700", label: "Approved" },
  REJECTED: { icon: XCircle, color: "bg-red-900/40 text-red-300 border-red-700", label: "Rejected" },
  UNDER_REVIEW: { icon: AlertCircle, color: "bg-blue-900/40 text-blue-300 border-blue-700", label: "Under Review" },
  PENDING: { icon: Clock, color: "bg-amber-900/40 text-amber-300 border-amber-700", label: "Pending" },
  ACTIVE: { icon: CheckCircle, color: "bg-emerald-900/40 text-emerald-300 border-emerald-700", label: "Active" },
  SUSPENDED: { icon: XCircle, color: "bg-amber-900/40 text-amber-300 border-amber-700", label: "Suspended" },
  DELETED: { icon: XCircle, color: "bg-red-900/40 text-red-300 border-red-700", label: "Deleted" },
  VERIFIED: { icon: CheckCircle, color: "bg-emerald-900/40 text-emerald-300 border-emerald-700", label: "Verified" },
  UNVERIFIED: { icon: XCircle, color: "bg-red-900/40 text-red-300 border-red-700", label: "Unverified" },
};

const StatusBadge = ({ status, showIcon = true, size = "md" }) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "px-2 py-1 text-[10px]",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.color} ${sizeClasses[size]}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;