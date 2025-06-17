import React from 'react';

const YearTabs = ({ activeYear, onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Últimos 5 años

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${activeYear === year
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default YearTabs;