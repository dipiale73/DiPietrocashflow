import React, { useState, useEffect } from 'react';
import FinancesHeader from './components/FinancesHeader';
import FinancialSummary from './components/FinancialSummary';
import TransactionTable from './components/TransactionTable';
import NewTransactionForm from './components/NewTransactionForm';
import MonthTabs from './components/MonthTabs';
import YearTabs from './components/YearTabs';
import ReportsView from './components/ReportsView';
import { transactions as initialTransactions } from './mock/transactions';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [activeMonth, setActiveMonth] = useState('Junio');
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  // Asegurarse de que initialTransactions sea un array, incluso si el mock está vacío o es undefined
  const [allTransactions, setAllTransactions] = useState(initialTransactions || []);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filterTransactions = (month, year) => {
    const monthIndex = months.indexOf(month);
    
    // Asegurarse de que allTransactions sea un array antes de filtrar
    const filtered = (allTransactions || []).filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === year;
    });
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    filterTransactions(activeMonth, activeYear);
  }, [activeMonth, activeYear, allTransactions]);

  const handleMonthSelect = (month) => {
    setActiveMonth(month);
  };

  const handleYearSelect = (year) => {
    setActiveYear(year);
  };

  const handleNewMovementClick = () => {
    setShowForm(true);
  };

  const handleReportsClick = () => {
    setActiveView('reports');
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleAddTransaction = (newTransaction) => {
    // Asegurarse de que allTransactions sea un array antes de calcular el nuevo ID
    const newId = (allTransactions || []).length > 0 ? Math.max(...(allTransactions || []).map(t => t.id)) + 1 : 1;
    const transactionWithId = { ...newTransaction, id: newId, amount: parseFloat(newTransaction.amount) };
    setAllTransactions(prevTransactions => [...(prevTransactions || []), transactionWithId]);
    handleCloseForm();
  };

  const calculateSummaryData = () => {
    // Asegurarse de que filteredTransactions sea un array antes de usarlo
    const currentFilteredTransactions = filteredTransactions || [];

    const sales = currentFilteredTransactions
      .filter(t => t.type === 'income' && t.category === 'Ventas Mensuales')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = {
      Administrativos: 0,
      Servicios: 0,
      Vehiculares: 0,
      Representación: 0,
      'Impuestos Directos': 0,
      'Compra Mercadería': 0,
      Sueldos: 0,
      'Aportes Sociales': 0,
      'Otros Gastos': 0,
    };

    currentFilteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (expenses.hasOwnProperty(t.category)) {
          expenses[t.category] += t.amount;
        } else {
          // Si la categoría no existe, se suma a 'Otros Gastos'
          expenses['Otros Gastos'] += t.amount;
        }
      });

    const totalExpensesAmount = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    const balance = sales - totalExpensesAmount;

    return { sales, expenses, totalExpensesAmount, balance };
  };

  const { sales, expenses, totalExpensesAmount, balance } = calculateSummaryData();

  const summaryDataProps = [
    { title: 'Ventas Mensuales', amount: sales, change: '+12%', positive: true, isSales: true, category: 'income' },
    { title: 'Compra Mercadería', amount: expenses['Compra Mercadería'], change: '+15%', positive: false, category: 'expense' },
    { title: 'Gastos Administrativos', amount: expenses['Administrativos'], change: '+3%', positive: false, category: 'expense' },
    { title: 'Gastos Servicios', amount: expenses['Servicios'], change: '+7%', positive: false, category: 'expense' },
    { title: 'Gastos Vehiculares', amount: expenses['Vehiculares'], change: '+10%', positive: false, category: 'expense' },
    { title: 'Gastos Representación', amount: expenses['Representación'], change: '+5%', positive: false, category: 'expense' },
    { title: 'Impuestos Directos', amount: expenses['Impuestos Directos'], change: '+8%', positive: false, category: 'expense' },
    { title: 'Sueldos', amount: expenses['Sueldos'], change: '+6%', positive: false, category: 'expense' },
    { title: 'Aportes Sociales', amount: expenses['Aportes Sociales'], change: '+4%', positive: false, category: 'expense' },
  ];

  const prepareChartData = () => {
    const chartMonthlyData = months.map(monthName => {
      const monthIndex = months.indexOf(monthName);
      const monthTransactions = (allTransactions || []).filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === activeYear;
      });

      const monthSales = monthTransactions
        .filter(t => t.type === 'income' && t.category === 'Ventas Mensuales')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpensesTotal = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthSalaries = monthTransactions
        .filter(t => t.type === 'expense' && t.category === 'Sueldos')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthMerchandise = monthTransactions
        .filter(t => t.type === 'expense' && t.category === 'Compra Mercadería')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthBalance = monthSales - monthExpensesTotal;

      return {
        month: monthName.substring(0, 3),
        sales: monthSales,
        merchandise: monthMerchandise,
        expenses: monthExpensesTotal,
        salaries: monthSalaries,
        balance: monthBalance,
      };
    });

    const chartMonthlyExpenseData = months.map(monthName => {
      const monthIndex = months.indexOf(monthName);
      const monthTransactions = (allTransactions || []).filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === activeYear;
      });

      const expensesByCategory = {
        Administrativos: 0, Servicios: 0, Vehiculares: 0, Representación: 0, 'Impuestos Directos': 0, Sueldos: 0, 'Compra Mercadería': 0
      };

      monthTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          if (expensesByCategory.hasOwnProperty(t.category)) {
            expensesByCategory[t.category] += t.amount;
          }
        });

      return {
        month: monthName.substring(0, 3),
        admin: expensesByCategory.Administrativos,
        services: expensesByCategory.Servicios,
        vehicular: expensesByCategory.Vehiculares,
        representation: expensesByCategory.Representación,
        directTaxes: expensesByCategory['Impuestos Directos'],
        salaries: expensesByCategory.Sueldos,
        merchandise: expensesByCategory['Compra Mercadería'],
      };
    });

    const currentMonthExpensesForPie = {};
    (filteredTransactions || [])
      .filter(t => t.type === 'expense')
      .forEach(t => {
        currentMonthExpensesForPie[t.category] = (currentMonthExpensesForPie[t.category] || 0) + t.amount;
      });

    return { chartMonthlyData, chartMonthlyExpenseData, currentMonthExpensesForPie };
  };

  const { chartMonthlyData, chartMonthlyExpenseData, currentMonthExpensesForPie } = prepareChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancesHeader 
        onNewMovementClick={handleNewMovementClick} 
        onReportsClick={handleReportsClick} 
      />
      
      <main className="container mx-auto px-4 py-6">
        <YearTabs activeYear={activeYear} onSelectYear={handleYearSelect} />
        <MonthTabs activeMonth={activeMonth} onSelectMonth={handleMonthSelect} />
        
        {activeView === 'dashboard' ? (
          <>
            <FinancialSummary summaryData={summaryDataProps} totalExpensesAmount={totalExpensesAmount} balance={balance} />
            
            <div className="mt-6 flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Movimientos Recientes ({activeMonth} {activeYear})</h2>
              <button 
                onClick={handleNewMovementClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Nuevo Movimiento
              </button>
            </div>
            
            <TransactionTable transactions={filteredTransactions} />
            
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md">
                  <NewTransactionForm onClose={handleCloseForm} onAddTransaction={handleAddTransaction} />
                  <button 
                    onClick={handleCloseForm}
                    className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <ReportsView 
            monthlyData={chartMonthlyData} 
            monthlyExpenseData={chartMonthlyExpenseData} 
            currentMonthExpenses={currentMonthExpensesForPie} 
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
// DONE