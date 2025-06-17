import React from 'react';

const FinancialCharts = ({ monthlyData, monthlyExpenseData, currentMonthExpenses }) => {
  // Asegurarse de que los datos sean arrays válidos, incluso si están vacíos
  const dataForLineChart = monthlyData || [];
  const dataForExpenseChart = monthlyExpenseData || [];

  const getMaxYValue = (data, keys) => {
    let maxVal = 0;
    data.forEach(item => {
      keys.forEach(key => {
        // Asegurarse de que el valor sea un número antes de comparar
        maxVal = Math.max(maxVal, typeof item[key] === 'number' ? item[key] : 0);
      });
    });
    return maxVal === 0 ? 100 : maxVal * 1.1; // Evitar división por cero si todos los valores son 0
  };

  const maxYLineChart = getMaxYValue(dataForLineChart, ['sales', 'merchandise', 'expenses', 'salaries', 'balance']);
  const maxYExpenseChart = getMaxYValue(dataForExpenseChart, ['admin', 'services', 'vehicular', 'representation', 'directTaxes', 'salaries', 'merchandise']);

  const incomeVsExpensesData = dataForLineChart.map(data => ({
    month: data.month,
    income: data.sales,
    expenses: data.expenses,
  }));

  const maxIncomeExpenseY = getMaxYValue(incomeVsExpensesData, ['income', 'expenses']);

  // Datos para el gráfico circular de gastos
  // Asegurarse de que currentMonthExpenses sea un objeto válido y no nulo/indefinido
  const pieChartData = Object.keys(currentMonthExpenses || {}).map(category => ({
    name: category,
    value: currentMonthExpenses[category],
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const totalCurrentMonthExpenses = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const getPieChartPath = (data) => {
    let total = 0;
    data.forEach(item => total += item.value);

    if (total === 0) return []; // No dibujar si no hay datos

    let startAngle = 0;
    let paths = [];

    data.forEach(item => {
      const sliceAngle = (item.value / total) * 360;
      const endAngle = startAngle + sliceAngle;

      const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
      const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
      const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
      const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const pathData = [
        `M 50 50`,
        `L ${startX} ${startY}`,
        `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');

      paths.push({ path: pathData, color: item.color, name: item.name, percentage: ((item.value / total) * 100).toFixed(1) });
      startAngle = endAngle;
    });
    return paths;
  };

  const piePaths = getPieChartPath(pieChartData.filter(item => item.value > 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gráfico de Barras de Ingresos vs Gastos */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-2">Ingresos vs Gastos Mensuales</h3>
        <div className="relative h-64 w-full">
          {/* Eje Y */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2 text-xs text-gray-500">
            <span>${maxIncomeExpenseY.toLocaleString()}</span>
            <span>${(maxIncomeExpenseY / 2).toLocaleString()}</span>
            <span>$0</span>
          </div>
          {/* Área del gráfico */}
          <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end">
            {/* Líneas de la cuadrícula horizontal */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
            </div>

            {/* Barras del gráfico */}
            <div className="flex justify-around w-full h-full items-end pb-6">
              {incomeVsExpensesData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center h-full justify-end w-1/6 px-1">
                  <div className="flex items-end w-full h-full">
                    <div
                      className="bg-green-500 w-1/2 rounded-t-sm mr-0.5"
                      style={{ height: `${(data.income / maxIncomeExpenseY) * 100}%` }}
                    ></div>
                    <div
                      className="bg-red-500 w-1/2 rounded-t-sm ml-0.5"
                      style={{ height: `${(data.expenses / maxIncomeExpenseY) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Ingresos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Gastos
          </div>
        </div>
      </div>
      
      {/* Gráfico Circular de Distribución de Gastos */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-2">Distribución de Gastos ({totalCurrentMonthExpenses.toLocaleString()} Total)</h3>
        <div className="flex flex-col items-center justify-center h-64">
          {totalCurrentMonthExpenses > 0 ? (
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {piePaths.map((segment, index) => (
                  <path key={index} d={segment.path} fill={segment.color} />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">
                {/* Puedes poner un texto central si quieres */}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay gastos para mostrar en este mes.</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm max-h-24 overflow-y-auto">
            {piePaths.map((segment, index) => (
              <div key={index} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
                {segment.name} ({segment.percentage}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Líneas Comparativo Principal */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-full">
        <h3 className="text-lg font-medium mb-4">Comparativa Mensual (Ventas, Mercadería, Gastos, Sueldos, Balance)</h3>
        <div className="relative h-80 w-full">
          {/* Eje Y */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2 text-xs text-gray-500">
            <span>${maxYLineChart.toLocaleString()}</span>
            <span>${(maxYLineChart / 2).toLocaleString()}</span>
            <span>$0</span>
          </div>
          {/* Área del gráfico */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            {/* Líneas de la cuadrícula horizontal */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
            </div>

            {/* Línea del Punto de Equilibrio (Balance Cero) */}
            <div className="absolute left-0 right-0 border-b-2 border-dashed border-gray-400"
                 style={{ bottom: `${(0 / maxYLineChart) * 100}%` }}>
              <span className="absolute -left-8 -top-3 text-xs text-gray-600">P.E.</span>
            </div>

            {/* Puntos y líneas del gráfico */}
            <div className="absolute inset-0 flex justify-around items-end pb-6">
              {dataForLineChart.map((data, index) => {
                const salesHeight = (data.sales / maxYLineChart) * 100;
                const merchandiseHeight = (data.merchandise / maxYLineChart) * 100;
                const expensesHeight = (data.expenses / maxYLineChart) * 100;
                const salariesHeight = (data.salaries / maxYLineChart) * 100;
                const balanceHeight = (data.balance / maxYLineChart) * 100;

                const prevData = dataForLineChart[index - 1];

                return (
                  <div key={data.month} className="relative flex-1 h-full flex flex-col justify-end items-center">
                    {/* Líneas de conexión */}
                    {prevData && (
                      <>
                        {/* Ventas */}
                        <div
                          className="absolute border-t-2 border-blue-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.sales / maxYLineChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((salesHeight - (prevData.sales / maxYLineChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Mercadería */}
                        <div
                          className="absolute border-t-2 border-purple-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.merchandise / maxYLineChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((merchandiseHeight - (prevData.merchandise / maxYLineChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Gastos */}
                        <div
                          className="absolute border-t-2 border-red-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.expenses / maxYLineChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((expensesHeight - (prevData.expenses / maxYLineChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Sueldos */}
                        <div
                          className="absolute border-t-2 border-orange-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.salaries / maxYLineChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((salariesHeight - (prevData.salaries / maxYLineChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Balance */}
                        <div
                          className="absolute border-t-2 border-green-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.balance / maxYLineChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((balanceHeight - (prevData.balance / maxYLineChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                      </>
                    )}

                    {/* Puntos */}
                    <div className="absolute w-3 h-3 rounded-full bg-blue-500" style={{ bottom: `${salesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-purple-500" style={{ bottom: `${merchandiseHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-red-500" style={{ bottom: `${expensesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-orange-500" style={{ bottom: `${salariesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-green-500" style={{ bottom: `${balanceHeight}%` }}></div>

                    <span className="absolute -bottom-5 text-xs text-gray-600">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Ventas
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span> Mercadería
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Gastos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span> Sueldos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Balance
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 border-b-2 border-dashed border-gray-400 mr-2"></span> Punto de Equilibrio
          </div>
        </div>
      </div>

      {/* Gráfico de Líneas para Gastos Detallados */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-full">
        <h3 className="text-lg font-medium mb-4">Comparativa Mensual de Gastos Detallados</h3>
        <div className="relative h-80 w-full">
          {/* Eje Y */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2 text-xs text-gray-500">
            <span>${maxYExpenseChart.toLocaleString()}</span>
            <span>${(maxYExpenseChart / 2).toLocaleString()}</span>
            <span>$0</span>
          </div>
          {/* Área del gráfico */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            {/* Líneas de la cuadrícula horizontal */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
              <div className="border-b border-gray-200 flex-grow"></div>
            </div>

            {/* Puntos y líneas del gráfico */}
            <div className="absolute inset-0 flex justify-around items-end pb-6">
              {dataForExpenseChart.map((data, index) => {
                const adminHeight = (data.admin / maxYExpenseChart) * 100;
                const servicesHeight = (data.services / maxYExpenseChart) * 100;
                const vehicularHeight = (data.vehicular / maxYExpenseChart) * 100;
                const representationHeight = (data.representation / maxYExpenseChart) * 100;
                const directTaxesHeight = (data.directTaxes / maxYExpenseChart) * 100;
                const salariesHeight = (data.salaries / maxYExpenseChart) * 100;
                const merchandiseHeight = (data.merchandise / maxYExpenseChart) * 100;

                const prevData = dataForExpenseChart[index - 1];

                return (
                  <div key={data.month} className="relative flex-1 h-full flex flex-col justify-end items-center">
                    {/* Líneas de conexión */}
                    {prevData && (
                      <>
                        {/* Administrativos */}
                        <div
                          className="absolute border-t-2 border-cyan-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.admin / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((adminHeight - (prevData.admin / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Servicios */}
                        <div
                          className="absolute border-t-2 border-lime-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.services / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((servicesHeight - (prevData.services / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Vehiculares */}
                        <div
                          className="absolute border-t-2 border-fuchsia-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.vehicular / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((vehicularHeight - (prevData.vehicular / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Representación */}
                        <div
                          className="absolute border-t-2 border-rose-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.representation / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((representationHeight - (prevData.representation / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Impuestos Directos */}
                        <div
                          className="absolute border-t-2 border-teal-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.directTaxes / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((directTaxesHeight - (prevData.directTaxes / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Sueldos */}
                        <div
                          className="absolute border-t-2 border-yellow-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.salaries / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((salariesHeight - (prevData.salaries / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                        {/* Mercadería */}
                        <div
                          className="absolute border-t-2 border-indigo-500"
                          style={{
                            width: '100%',
                            left: '-50%',
                            bottom: `${(prevData.merchandise / maxYExpenseChart) * 100}%`,
                            transformOrigin: 'left',
                            transform: `rotate(${Math.atan2((merchandiseHeight - (prevData.merchandise / maxYExpenseChart) * 100), 100) * (180 / Math.PI)}deg)`,
                            height: '2px',
                          }}
                        ></div>
                      </>
                    )}

                    {/* Puntos */}
                    <div className="absolute w-3 h-3 rounded-full bg-cyan-500" style={{ bottom: `${adminHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-lime-500" style={{ bottom: `${servicesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-fuchsia-500" style={{ bottom: `${vehicularHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-rose-500" style={{ bottom: `${representationHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-teal-500" style={{ bottom: `${directTaxesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-yellow-500" style={{ bottom: `${salariesHeight}%` }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-indigo-500" style={{ bottom: `${merchandiseHeight}%` }}></div>

                    <span className="absolute -bottom-5 text-xs text-gray-600">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></span> Administrativos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-lime-500 mr-2"></span> Servicios
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-fuchsia-500 mr-2"></span> Vehiculares
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span> Representación
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span> Impuestos Directos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Sueldos
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span> Mercadería
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;