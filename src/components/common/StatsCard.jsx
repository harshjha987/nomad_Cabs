import React from 'react';

const StatsCard = ({ label, value, icon: Icon, color, change }) => {
  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        {change && (
          <span className={`text-sm font-medium ${
            change.startsWith('+') ? 'text-green-400' : 'text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;