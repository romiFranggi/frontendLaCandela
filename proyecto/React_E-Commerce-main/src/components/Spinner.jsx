// Spinner.js
import React from 'react';
import '../css/spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Spinner;
