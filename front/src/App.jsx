import React from 'react';
import Calendar from './Calendar';
import './Calendar.css'; // Asegúrate de importar el CSS

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Calendario de Medicos</h1>
      <Calendar />
    </div>
  );
}

export default App;