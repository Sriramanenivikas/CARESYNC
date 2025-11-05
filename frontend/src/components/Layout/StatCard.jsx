import React from 'react';

const StatCard = ({ title, value, icon, bgColor = 'bg-primary-600', iconBgColor = 'bg-primary-700', textColor = 'text-white' }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`${iconBgColor} p-4 rounded-full`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
