import React from 'react';

const FinancesHeader = ({ onNewMovementClick, onReportsClick }) => {
  // Se elimina el componente MyCompanyLogo
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Se quita el logo */}
          <h1 className="text-2xl font-bold">Distribuidora Di Pietro SRL</h1> {/* Nombre de la empresa */}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={onNewMovementClick}
            className="px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Nuevo Movimiento
          </button>
          <button 
            onClick={onReportsClick}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reportes
          </button>
        </div>
      </div>
    </header>
  );
}

export default FinancesHeader;
// DONE