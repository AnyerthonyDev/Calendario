import React from 'react';
import Calendar from './Calendar';
import './Calendar.css';
import Login from './login';

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Login />;
  }

  return (
    <div>
      <h1>Calendario de Médicos</h1>
      <Calendar />
    </div>
  );
}

export default App;