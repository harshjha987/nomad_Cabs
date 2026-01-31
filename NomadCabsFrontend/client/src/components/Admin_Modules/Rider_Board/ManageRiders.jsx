import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Shield, ArrowRight } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { userService } from "../../../services/userService";
import SearchFilter from "../Shared/SearchFilter";
import Pagination from "../Shared/Pagination";
import StatusBadge from "../Shared/StatusBadge";
import RiderModal from "./RiderModal";

const FILTER_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Phone Number", value: "phone_number" },
];

const ManageRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [allRiders, setAllRiders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [filterType, setFilterType] = useState("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 8;

  const fetchRiders = async (page = 0) => {
    try {
      setLoading(true);
      const response = await userService.getAllRidersPaginated(page, pageSize);
      
      setAllRiders(response.content);
      setRiders(response.content);
      setTotalPages(response.total_pages);
      setTotalElements(response.total_elements);
      setCurrentPage(response.number);
    } catch (e) {
      toast.error("Failed to fetch riders", { theme: "dark", transition: Bounce });
      setAllRiders([]);
      setRiders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    setRiders(term ? allRiders.filter((r) => (r[filterType] || "").toString().toLowerCase().includes(term)) : allRiders);
  }, [searchTerm, filterType, allRiders]);

  useEffect(() => {
    if (selectedRider) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "");
    }
  }, [selectedRider]);

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Rider Management</h1>
        <p className="text-white/50 text-sm md:text-base">View and manage registered riders</p>
      </div>

      <SearchFilter
        filterType={filterType}
        onFilterChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={FILTER_OPTIONS}
        placeholder={`Search by ${FILTER_OPTIONS.find((f) => f.value === filterType)?.label}`}
      />

      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-white/60">
          {loading ? "Loading..." : `Showing ${riders.length} of ${totalElements} rider${totalElements !== 1 ? "s" : ""}`}
        </div>
        <div className="text-xs text-white/40 tracking-wider uppercase">Page {currentPage + 1} of {totalPages}</div>
      </div>

      <ul className="space-y-4 flex-grow">
        {loading && (
          <li className="flex items-center justify-center h-40">
            <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white" />
          </li>
        )}

        {!loading && riders.length === 0 && (
          <li className="h-40 flex items-center justify-center rounded-2xl bg-[#141414] border border-white/10 text-white/40 text-sm">
            {searchTerm ? "No riders match your search" : "No riders found"}
          </li>
        )}

        {!loading && riders.map((rider) => (
          <li key={rider.id} onClick={() => setSelectedRider(rider)}
            className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-grow">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white to-white/80 text-black font-bold flex items-center justify-center shadow-md group-hover:shadow-lg transition">
                  {(rider.first_name?.[0] || "").toUpperCase()}{(rider.last_name?.[0] || "").toUpperCase()}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight truncate">
                      {rider.first_name} {rider.last_name}
                    </h3>
                    {rider.status && <StatusBadge status={rider.status} size="sm" />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-white/60">
                      <Mail className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium truncate">{rider.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Phone className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium">{rider.phone_number || "N/A"}</span>
                    </div>
                    {rider.city && (
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-medium truncate">{rider.city}{rider.state ? `, ${rider.state}` : ""}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/60">
                      <Shield className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium capitalize">{rider.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition flex-shrink-0" />
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/50 group-hover:w-full transition-all duration-300 rounded-b-2xl" />
          </li>
        ))}
      </ul>

      {totalPages > 1 && !loading && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {selectedRider && (
        <RiderModal 
          rider={selectedRider} 
          onClose={() => setSelectedRider(null)} 
          onRefresh={() => fetchRiders(currentPage)} 
        />
      )}
    </div>
  );
};

export default ManageRiders;