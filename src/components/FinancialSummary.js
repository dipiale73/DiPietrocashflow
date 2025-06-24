import React from 'react';

const FinancialSummary = ({ summaryData, totalExpensesAmount, balance }) => {
  const totalSales = summaryData.find(item => item.isSales)?.amount || 0;

  return (
    <div className="mb-6">
      {/* Sección de Ventas y Mercadería */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {summaryData.filter(item => item.title === 'Ventas Mensuales').map((item, index) => {
          const formattedAmount = `$${item.amount.toLocaleString()}`;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-semibold mt-1">{formattedAmount}</p>
              <p className={`text-sm mt-2 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                {/* Mantener el cambio porcentual si es relevante, o ponerlo en 0 si no */}
                {item.change} {item.positive ? '⬆' : '⬇'}
              </p>
            </div>
          );
        })}
        {/* Mostrar Compra Mercadería junto a Ventas */}
        {summaryData.filter(item => item.title === 'Compra Mercadería').map((item, index) => {
          const formattedAmount = `$${item.amount.toLocaleString()}`;
          // Porcentaje de mercadería sobre ventas, si es necesario, o 0
          const percentage = totalSales > 0 ? ((item.amount / totalSales) * 100).toFixed(2) : '0.00';
          return (
            <div key={item.title} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-semibold mt-1">{formattedAmount}</p>
              <p className={`text-sm mt-2 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                {item.change} {item.positive ? '⬆' : '⬇'}
              </p>
              {percentage && (
                <p className="text-xs text-gray-400 mt-1">{percentage}% de Ventas</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4"> {/* Ajustar el grid para los gastos */}
        {summaryData.filter(item => item.category === 'expense' && item.title !== 'Compra Mercadería').map((item, index) => {
          const formattedAmount = `$${item.amount.toLocaleString()}`;
          // Poner el porcentaje de cada gasto individual en 0.00%
          const percentage = '0.00'; 
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-semibold mt-1">{formattedAmount}</p>
              <p className={`text-sm mt-2 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                {item.change} {item.positive ? '⬆' : '⬇'}
              </p>
              {percentage && (
                <p className="text-xs text-gray-400 mt-1">{percentage}% de Ventas</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Tarjeta de Balance y Porcentaje Total de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm">Balance</h3>
          <p className="text-2xl font-semibold mt-1">${balance.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalSales > 0 ? ((balance / totalSales) * 100).toFixed(2) : '0.00'}%
            {balance >= 0 ? ' ⬆' : ' ⬇'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm">Total Gastos sobre Ventas</h3>
          <p className="text-2xl font-semibold mt-1">
            {totalSales > 0 ? ((totalExpensesAmount / totalSales) * 100).toFixed(2) : '0.00'}%
          </p>
          <p className="text-sm text-gray-400 mt-2">Suma de todos los gastos</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;