import React, { useState } from 'react';
import FinancialCharts from './FinancialCharts';

const ReportsView = ({ monthlyData, monthlyExpenseData, currentMonthExpenses, onBackToDashboard }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reportes Financieros</h2>
      
      <div className="flex justify-center items-center space-x-4 mb-6">
        <label htmlFor="startDate" className="text-gray-700">Desde:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="endDate" className="text-gray-700">Hasta:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <FinancialCharts 
            monthlyData={monthlyData} 
            monthlyExpenseData={monthlyExpenseData} 
            currentMonthExpenses={currentMonthExpenses} 
          />
        </div>
      </div>
      <div className="text-center mt-8 flex justify-center space-x-4">
        <button 
          onClick={onBackToDashboard}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-md"
        >
          Volver al Dashboard
        </button>
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium shadow-md"
        >
          Imprimir Reportes
        </button>
      </div>
    </div>
  );
};

export default ReportsView;