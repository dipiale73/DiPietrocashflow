import React from 'react';

const FinancesHeader = ({ onNewMovementClick, onReportsClick, onAnnualTotalsClick }) => { // Recibir la nueva prop
  // Tu logo en formato SVG
  const MyCompanyLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      {/* Código SVG de tu logo basado en la imagen proporcionada */}
      {/* Este es un intento de replicar el logo de la imagen.
          Es un círculo con una forma abstracta dentro. */}
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <path d="M12 2 C18.627 2 24 7.373 24 14 C24 20.627 18.627 26 12 26 C5.373 26 0 20.627 0 14 C0 7.373 5.373 2 12 2 Z" fill="#000000" opacity="0.1" />
      <path d="M12 4 C17.523 4 22 8.477 22 14 C22 19.523 17.523 24 12 24 C6.477 24 2 19.523 2 14 C2 8.477 6.477 4 12 4 Z" fill="#FFFFFF" />
      <path d="M12 6 C16.418 6 20 9.582 20 14 C20 18.418 16.418 22 12 22 C7.582 22 4 18.418 4 14 C4 9.582 7.582 6 12 6 Z" fill="#000000" opacity="0.1" />
      <path d="M12 8 C14.761 8 17 10.239 17 13 C17 15.761 14.761 18 12 18 C9.239 18 7 15.761 7 13 C7 10.239 9.239 8 12 8 Z" fill="#FFFFFF" />
      <path d="M12 10 C13.657 10 15 11.343 15 13 C15 14.657 13.657 16 12 16 C10.343 16 9 14.657 9 13 C9 11.343 10.343 10 12 10 Z" fill="#000000" opacity="0.1" />
      <path d="M12 11 C12.552 11 13 11.448 13 12 C13 12.552 12.552 13 12 13 C11.448 13 11 12.552 11 12 C11 11.448 11.448 11 12 11 Z" fill="#FFFFFF" />
    </svg>
  );

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MyCompanyLogo /> {/* Aquí se inserta tu logo */}
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
          <button 
            onClick={onAnnualTotalsClick} // Nuevo botón para Totales Anuales
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Totales Anuales
          </button>
        </div>
      </div>
    </header>
  );
}

export default FinancesHeader;
// DONE