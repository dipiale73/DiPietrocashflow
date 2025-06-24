import React, { useState, useEffect } from 'react';

const AnnualTotalsView = ({ allTransactions, activeYear }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredAnnualTransactions, setFilteredAnnualTransactions] = useState([]);

  useEffect(() => {
    const transactionsForYear = allTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === activeYear;
    });

    let tempFiltered = transactionsForYear;

    if (startDate) {
      const start = new Date(startDate);
      tempFiltered = tempFiltered.filter(t => new Date(t.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      tempFiltered = tempFiltered.filter(t => new Date(t.date) <= end);
    }
    setFilteredAnnualTransactions(tempFiltered);
  }, [allTransactions, activeYear, startDate, endDate]);

  const calculateAnnualTotals = () => {
    const annualData = {
      sales: 0,
      merchandise: 0,
      admin: 0,
      services: 0,
      vehicular: 0,
      representation: 0,
      directTaxes: 0,
      salaries: 0,
      socialContributions: 0,
      otherExpenses: 0,
      totalExpenses: 0,
      balance: 0,
    };

    filteredAnnualTransactions.forEach(t => {
      if (t.type === 'income' && t.category === 'Ventas Mensuales') {
        annualData.sales += t.amount;
      } else if (t.type === 'expense') {
        switch (t.category) {
          case 'Compra Mercadería':
            annualData.merchandise += t.amount;
            break;
          case 'Administrativos':
            annualData.admin += t.amount;
            break;
          case 'Servicios':
            annualData.services += t.amount;
            break;
          case 'Vehiculares':
            annualData.vehicular += t.amount;
            break;
          case 'Representación':
            annualData.representation += t.amount;
            break;
          case 'Impuestos Directos':
            annualData.directTaxes += t.amount;
            break;
          case 'Sueldos':
            annualData.salaries += t.amount;
            break;
          case 'Aportes Sociales':
            annualData.socialContributions += t.amount;
            break;
          default:
            annualData.otherExpenses += t.amount;
            break;
        }
      }
    });

    annualData.totalExpenses = annualData.admin + annualData.services + annualData.vehicular +
                               annualData.representation + annualData.directTaxes + annualData.salaries +
                               annualData.socialContributions + annualData.otherExpenses;
    
    annualData.balance = annualData.sales - annualData.totalExpenses - annualData.merchandise;

    return annualData;
  };

  const totals = calculateAnnualTotals();

  const displayItems = [
    { label: 'Ventas Anuales', value: totals.sales, type: 'income' },
    { label: 'Compra Mercadería', value: totals.merchandise, type: 'expense' },
    { label: 'Gastos Administrativos', value: totals.admin, type: 'expense' },
    { label: 'Gastos Servicios', value: totals.services, type: 'expense' },
    { label: 'Gastos Vehiculares', value: totals.vehicular, type: 'expense' },
    { label: 'Gastos Representación', value: totals.representation, type: 'expense' },
    { label: 'Impuestos Directos', value: totals.directTaxes, type: 'expense' },
    { label: 'Sueldos', value: totals.salaries, type: 'expense' },
    { label: 'Aportes Sociales', value: totals.socialContributions, type: 'expense' },
    { label: 'Otros Gastos', value: totals.otherExpenses, type: 'expense' },
    { label: 'Total Gastos (sin Mercadería)', value: totals.totalExpenses, type: 'expense' },
    { label: 'Balance Anual', value: totals.balance, type: 'balance' },
  ];

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Totales Anuales {activeYear}</h2>
      
      <div className="flex justify-center items-center space-x-4 mb-6">
        <label htmlFor="annualStartDate" className="text-gray-700">Desde:</label>
        <input
          type="date"
          id="annualStartDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="annualEndDate" className="text-gray-700">Hasta:</label>
        <input
          type="date"
          id="annualEndDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">{item.label}</h3>
            <p className={`text-2xl font-semibold mt-1 ${item.type === 'income' || item.type === 'balance' && item.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnualTotalsView;
// DONE