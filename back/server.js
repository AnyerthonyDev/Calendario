const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sql, poolPromise } = require('./dataBase');
const app = express();

app.use(cors({origin: process.env.FRONT_SERVER}))

app.use(express.json());




// Endpoint para obtener eventos en un rango de fechas
app.get('/events/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('StartDate', sql.Date, startDate)
      .input('EndDate', sql.Date, endDate)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('GetEventsInRange'); // Nombre del stored procedure

    const status = result.output.status;
    const response = result.output.resultado;

    const respuesta = { status: status, resultado: response, resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Endpoint para obtener eventos en una fecha específica
app.get('/events/date', async (req, res) => {
  try {
    const { date } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Date', sql.Date, date)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('GetEventsOnDate'); // Nombre del stored procedure

    const status = result.output.status;
    const response = result.output.resultado;

    const respuesta = { status: status, resultado: response, resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Endpoint para obtener todos los eventos desde la vista
app.get('/events/all', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM vTURNOS_TELEMEDICINA'); // Nombre de la vista
    const respuesta = {resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

app.get('/medicos/all', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT A.id,nombre + ' ' + ISNULL(apellido,'') nombre  FROM OWNER_QUEUE A INNER JOIN OWNER_QUEUE_ESPECIALIDADES B ON A.id=B.id_owner_queue WHERE B.id_especialidad = 158"); // Nombre de la vista
    const respuesta = {resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

app.get('/turnos/all', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT id,nombre turno FROM TURNOS WHERE status = 1"); // Nombre de la vista
    const respuesta = {resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});




app.post('/events/moveEvent', async (req, res) => {
  try {
    const { id, date } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID', sql.Int, id)
      .input('NewDate', sql.Date, date)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('usp_Calendario_MoveEvent'); // Name of the stored procedure to update the event date

    const status = result.output.status;
    const response = result.output.resultado;

    res.json({ status, resultado: response });
  } catch (err) {
    console.error('Error moving event:', err);
    res.status(500).send('Error: ' + err);
  }
});

app.post('/events/addEvent', async (req, res) => {
  try {
    const { nombre,turno, date } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('medico', sql.Int, nombre)
      .input('turno', sql.Int, turno)
      .input('fecha', sql.Date, date)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('usp_Calendario_AddEvent'); // Name of the stored procedure to update the event date

    const status = result.output.status;
    const response = result.output.resultado;

    res.json({ status, resultado: response });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).send('Error: ' + err);
  }
});

app.post('/events/editEvent', async (req, res) => {
  try {
    const { id,nombre,turno, date } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('medico', sql.Int, nombre)
      .input('turno', sql.Int, turno)
      .input('fecha', sql.Date, date)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('usp_Calendario_EditEvent'); // Name of the stored procedure to update the event date

    const status = result.output.status;
    const response = result.output.resultado;

    res.json({ status, resultado: response });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).send('Error: ' + err);
  }
});

// Endpoint de prueba de configuración
app.get('', async (req, res) => {
  try {
    res.json({ resultado: 'todo bien' });
  } catch (error) {
    res.json({ resultado: 'todo mal' });
  }
});

app.listen(1234, () => {
  console.log('Server is running on port 1234');
});


app.post('/events/deleteEvent', async (req, res) => {
  try {
    const {id} = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID', sql.Int, id)
      .output('status', sql.Int)
      .output('resultado', sql.VarChar)
      .execute('usp_Calendario_DeleteEvent'); // Name of the stored procedure to update the event date

    const status = result.output.status;
    const response = result.output.resultado;

    res.json({ status, resultado: response });
  } catch (err) {
    console.error('Error moving event:', err);
    res.status(500).send('Error: ' + err);
  }
});


//Endpoint para tener todos los consultorios
app.get('/consultorios', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM CONSULTORIOS'); // Nombre de la vista
    const respuesta = {resultados: result.recordset };
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});


