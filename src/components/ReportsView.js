import React from 'react';
import FinancialCharts from './FinancialCharts';

const ReportsView = ({ monthlyData, monthlyExpenseData, currentMonthExpenses, onBackToDashboard }) => {
  const handlePrint = () => {
    window.print(); // Función nativa del navegador para imprimir
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reportes Financieros</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Gráfico de Barras de Ingresos vs Gastos */}
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
// DONE