import VehicleCards from "../../Common/Vehicles/VehicleCards";

const VehicleView = ({ driverId, onBack }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      <div className="p-8">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-white">Driver Vehicles</h3>
          <button
            onClick={onBack}
            className="h-11 px-6 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/15 text-sm font-medium transition flex items-center gap-2"
          >
            ← Back to Details
          </button>
        </div>
        <VehicleCards driverId={driverId} onClose={onBack} />
      </div>
    </div>
  </div>
);

export default VehicleView;