const config = {
    apiUrl: 'http://localhost:1234',
  };
export default config;
  
export function castFecha(fechaString) {
    // Convertir el texto a un objeto Date
    let fechaLocal = new Date(fechaString);

    // Obtener la diferencia horaria en minutos y convertirla a milisegundos
    let diferenciaHoraria = fechaLocal.getTimezoneOffset() * 60000;
    if (diferenciaHoraria > 0) {
      // Si la diferencia es negativa, es que el tiempo es UTC+X, sino UTC-X
      diferenciaHoraria = -diferenciaHoraria;
    }
    // Restar la diferencia horaria para ajustar a UTC
    let fechaUTC = new Date(fechaLocal.getTime() - diferenciaHoraria);

return fechaUTC;

}