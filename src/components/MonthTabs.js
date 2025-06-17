import React from 'react';

const MonthTabs = ({ activeMonth, onSelectMonth }) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => onSelectMonth(month)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${activeMonth === month
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthTabs;