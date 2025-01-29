import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Calendar.css';
import config from '../config';
import {castFecha} from '../config';
//import { title } from 'process';

const Calendar = () => {
  const [events, setEvents] = useState({});
  const [medicos, setMedicos] = useState({});
  const [turnos, setTurnos] = useState({});
  const [recarga, recargar] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventForm, setEventForm] = useState({ nombre: 0, turno: 0 });
  const [currentAction, setCurrentAction] = useState('view'); // 'view', 'add', 'edit'
  const [editingEventId, setEditingEventId] = useState(null);
  const api = config.apiUrl;
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${api}/events/all`);
        const eventsData = response.data.resultados;
        const eventsByDay = {};

        eventsData.forEach(event => {
          const eventDate = castFecha(event.date)
          if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
            const day = eventDate.getDate();
            if (!eventsByDay[day]) {
              eventsByDay[day] = [];
            }
            eventsByDay[day].push(event);

          }
        });

        setEvents(eventsByDay);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchMedicos = async () => {
      try {
        const response = await axios.get(`${api}/medicos/all`);
        const medicosData = response.data.resultados;
        setMedicos(medicosData);
      } catch (error) {
        console.error('Error fetching MEDICOS:', error);
      }
    };
    const fetchTurnos = async () => {
      try {
        const response = await axios.get(`${api}/turnos/all`);
        const medicosData = response.data.resultados;
        setTurnos(medicosData);
      } catch (error) {
        console.error('Error fetching Turnos:', error);
      }
    };

     fetchEvents();
     fetchMedicos();
     fetchTurnos();
  }, [currentMonth, currentYear,recarga]);

  const handleClick = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const days = Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const moveEvent = async (eventId, newDate) => {
    try {
      const response= await axios.post(`${api}/events/moveEvent`, { id: eventId, date: newDate });
      if (response.data.status==0){
        alert(response.data.resultado)
        console.log(response.data.resultado)
      }
      // Actualiza los eventos después de mover uno
      recargar(!recarga)
    } catch (error) {
      alert("Error moviendo la guardia")
      console.error('Error moving event:', error);
    }
  };

  const Event = ({ event }) => {
    const [, drag] = useDrag(() => ({
      type: 'event',
      item: { id: event.id },
    }));

    

    return (
      <div ref={drag} className="event" style={{backgroundColor:event.color}} onClick={() => handleEditEvent(event,false) }>
        {event.nombre_medico}
        <br />
        Turno: {event.turno_turno}
      </div>
    );
  };

  const Day = ({ day, children }) => {
    const [, drop] = useDrop(() => ({
      accept: 'event',
      drop: (item) => moveEvent(item.id, new Date(currentYear, currentMonth, day)),
    }));

    return (
      <div ref={drop} className="day" onClick={() => handleClick(day)}>
        <div className="date">{day}</div>
        <div className="events">{children}</div>
      </div>
    );
  };

const handleEditEvent = (event,muestraModal) => {
  setEventForm({ nombre: event.nombre, turno: event.turno });
  setEditingEventId(event.id);
  setCurrentAction('edit');
  setIsModalOpen(muestraModal)
};

const handleDeleteEvent = async (eventId) => {
  try {
    const response = await axios.post(`${api}/events/deleteEvent`,{id: eventId});
    if (response.data.status==0){
      alert(response.data.resultado)
    }
    // Actualizar los eventos después de eliminar
    // const updatedEvents = {...events};
    // updatedEvents[selectedDay] = updatedEvents[selectedDay].filter(event => event.id !== eventId);
    // setEvents(updatedEvents);
    recargar(!recarga)
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Error al eliminar el evento');
  }
};

const handleSubmitEvent = async (e) => {
  e.preventDefault();
  try {
    if (currentAction === 'add') {
      const response = await axios.post(`${api}/events/addEvent`,{ nombre: eventForm.nombre,turno: eventForm.turno, date: new Date(currentYear, currentMonth, selectedDay) });
      
      if (response.data.status==0){
        alert(response.data.resultado)
      }
      // const newEvent = response.data;
      // setEvents(prev => ({
      //   ...prev,
      //   [selectedDay]: [...(prev[selectedDay] || []), newEvent]
      // }));
      //useEffect();
      recargar(!recarga)
    } else if (currentAction === 'edit') {
      //console.log("id: ,",editingEventId,", nombre: ,",eventForm.nombre,",turno: ",eventForm.turno,", date: ",new Date(currentYear, currentMonth, selectedDay))
      const response = await axios.post(`${api}/events/editEvent`,{id: editingEventId, nombre: eventForm.nombre,turno: eventForm.turno, date: new Date(currentYear, currentMonth, selectedDay)});
      if (response.data.status==0){
        alert(response.data.resultado)
      }
      // setEvents(prev => ({
      //   ...prev,
      //   [selectedDay]: prev[selectedDay].map(event => 
      //     event.id === editingEventId ? {...event, ...eventForm} : event
      //   )
      // }));
      //useEffect();
      recargar(!recarga)
    }
    setIsModalOpen(false)
    setCurrentAction('view');
    setEventForm({ nombre: 0, turno: 0 });
    setEditingEventId(null);
  } catch (error) {
    console.error('Error submitting event:', error);
    alert('Error al guardar el evento');
  }
};
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="month-selector">
            <button onClick={() => changeMonth(-1)} className='month-change'></button>
            <span className='mes'>{months[currentMonth]} {currentYear}</span>
            <button onClick={() => changeMonth(1)} className='month-change'></button>
          </div>
        </div>
        <div className="calendar">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
          {[...Array(firstDayIndex)].map((_, index) => (
            <div key={`empty-${index}`} className="day empty"></div>
          ))}
          {days.map(day => (
            <Day key={day} day={day}>
              {(events[day] || []).map(event => (
                <Event key={event.id} event={event} />
              ))}
            </Day>
          ))}
        </div>
        {isModalOpen && (
          <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => {
                  setIsModalOpen(false);
                  setCurrentAction('view');
                  setEventForm({ nombre: 0, turno: 0 });
                }}>×</span>
                <h2 className='headerModal'>Guardias del día {selectedDay}</h2>
                {currentAction === 'view' && (
                  <>
                    {(events[selectedDay] || []).map(event => (
                      <div key={event.id} className='enventDetails'>
                        <h3>{event.nombre_medico}</h3>
                        <p>{event.turno_turno}</p>
                        <button onClick={() => handleEditEvent(event,true)}>Editar</button>
                        <button onClick={() => handleDeleteEvent(event.id)} type='button'>Eliminar</button>
                      </div>
                    ))}
                    <button className="add-event" onClick={() => setCurrentAction('add')}>Agregar Evento</button>
                  </>
                )}
                {(currentAction === 'add' || currentAction === 'edit') && (
                  <form onSubmit={handleSubmitEvent}>
                    <select
                      value={eventForm.nombre}
                      onChange={(e) => setEventForm({...eventForm, nombre: e.target.value})}
                      required>
                      <option  value={0} disabled>Selecciona el Médico</option>
                        {medicos.map((datos) => <option value={datos.id}>{datos.nombre}</option>)}
                      </select>
                    <select
                      value={eventForm.turno}
                      onChange={(e) => setEventForm({...eventForm, turno: e.target.value})}
                      required>
                        <option value={0} disabled>Turno Asignado</option>
                        {turnos.map((datos) => <option value={datos.id}>{datos.turno}</option>)}
                      </select>
                    <button type="submit">
                      {currentAction === 'add' ? 'Agregar' : 'Guardar cambios'}
                    </button>
                    <button type="button" onClick={() => {
                      setCurrentAction('view');
                      setIsModalOpen(false)
                      setEventForm({ nombre: 0, turno: 0 });
                    }}>Cancelar</button>
                  </form>
                )}
              </div>
            </div>
        )}
      </div>
    </DndProvider>
            );
};

export default Calendar;
