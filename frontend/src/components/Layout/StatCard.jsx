import React from 'react';

const StatCard = ({ title, value, icon, bgColor = 'bg-white dark:bg-gray-900', iconBgColor = 'bg-gradient-to-br from-emerald-500 to-green-600', textColor = 'text-gray-900 dark:text-gray-100' }) => {
  return (
    <div className={`${bgColor} rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-800 transform hover:-translate-y-2 hover:scale-[1.01] backdrop-blur-xl relative overflow-hidden group`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1 pr-4">
          <p className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">{title}</p>
          <h3 className={`text-5xl font-black ${textColor} tracking-tight`}>{value}</h3>
        </div>
        <div className={`${iconBgColor} p-6 rounded-3xl shadow-2xl transform group-hover:scale-110 transition-all duration-500`}>
          <span className="text-4xl text-white">{icon}</span>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default StatCard;
