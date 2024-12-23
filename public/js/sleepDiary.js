// Importa la funcionalidad de autenticación desde el archivo 'auth.js'
import { auth } from './auth.js';

// Definimos un objeto 'sleepDiary' que contiene varias funcionalidades para gestionar las entradas de sueño
export const sleepDiary = {
  // Este es el array donde se almacenarán las entradas de sueño
  sleepEntries: [],
  // Este es el token que se usará para autenticar las peticiones
  token: null,

  // Función para inicializar el diario de sueño
  async init() {
    try {
      // Intentamos obtener un token válido (esto es como una llave para acceder a los datos)
      this.token = await auth.getValidToken();
      // Después cargamos las entradas de sueño (los registros previos)
      await this.loadEntries();
    } catch (error) {
      // Si hay un error, lo mostramos en la consola
      console.error('Error initializing sleep diary:', error);
    }
  },

  // Función para cargar las entradas de sueño desde un servidor
  async loadEntries() {
    try {
      // Hacemos una solicitud al servidor para obtener las entradas de sueño
      const response = await fetch('http://localhost:3000/api/data', {
        headers: {
          'Authorization': `Bearer ${this.token}` // Enviamos el token para autenticar la solicitud
        }
      });

      // Si la respuesta es correcta, procesamos los datos
      if (response.ok) {
        const data = await response.json(); // Convertimos los datos a formato JSON
        this.sleepEntries = data.sleepEntries || []; // Guardamos las entradas de sueño en el array
        console.log('Sleep entries loaded:', this.sleepEntries);
      } else {
        // Si la respuesta no es correcta, mostramos un mensaje de error
        throw new Error(`Failed to load sleep entries: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Si ocurre algún error, lo mostramos en la consola
      console.error('Error loading sleep entries:', error);
      const errorBody = await response.text(); // Capturamos el cuerpo del error para más detalles
      console.error('Error response body:', errorBody);
      // Si el error es por un token inválido (401), intentamos renovarlo y cargar las entradas de nuevo
      if (error.message.includes('401')) {
        try {
          // Intentamos renovar el token
          this.token = await auth.refreshToken();
          // Volvemos a intentar cargar las entradas con el nuevo token
          await this.loadEntries();
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    }
  },

  // Función para agregar una nueva entrada de sueño
  async addEntry(entry) {
    try {
      // Hacemos una solicitud POST para agregar una nueva entrada de sueño al servidor
      const response = await fetch('http://localhost:3000/api/data', {
        method: 'POST', // Es una solicitud para crear algo nuevo
        headers: {
          'Content-Type': 'application/json', // Decimos que los datos estarán en formato JSON
          'Authorization': `Bearer ${this.token}` // Enviamos el token para autenticar la solicitud
        },
        body: JSON.stringify(entry) // Convertimos la entrada a formato JSON para enviarlo
      });

      // Si la solicitud es exitosa, agregamos la entrada a nuestro array de entradas de sueño
      if (response.ok) {
        this.sleepEntries.push(entry);
        console.log('Sleep entry added:', entry);
      } else {
        // Si algo falla, mostramos un mensaje de error
        throw new Error('Failed to add sleep entry');
      }
    } catch (error) {
      // Si ocurre un error, lo mostramos en la consola
      console.error('Error adding sleep entry:', error);
      // Si el error es por un token inválido (401), intentamos renovarlo y volver a agregar la entrada
      if (error.message.includes('401')) {
        try {
          // Intentamos renovar el token
          this.token = await auth.refreshToken();
          // Volvemos a intentar agregar la entrada con el nuevo token
          await this.addEntry(entry);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    }
  },

  // Función para calcular estadísticas de sueño
  calculateStatistics() {
    // Si no hay entradas de sueño, devolvemos null
    if (this.sleepEntries.length === 0) return null;

    // Calculamos la duración total del sueño sumando todas las entradas
    const totalDuration = this.sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
    // Calculamos la calidad total del sueño sumando todas las calificaciones
    const totalQuality = this.sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
    // Calculamos el promedio de la duración y calidad del sueño
    const avgDuration = totalDuration / this.sleepEntries.length;
    const avgQuality = totalQuality / this.sleepEntries.length;

    // Filtramos las entradas de los últimos 7 días
    const lastWeekEntries = this.sleepEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    // Calculamos la duración promedio de sueño de la última semana
    const weeklyAvgDuration = lastWeekEntries.reduce((sum, entry) => sum + entry.duration, 0) / lastWeekEntries.length || 0;

    // Devolvemos un objeto con todas las estadísticas calculadas
    return {
      avgDuration: avgDuration.toFixed(2), // Promedio de la duración
      avgQuality: avgQuality.toFixed(2), // Promedio de la calidad
      totalEntries: this.sleepEntries.length, // Total de entradas de sueño
      weeklyAvgDuration: weeklyAvgDuration.toFixed(2) // Promedio semanal de duración
    };
  },

  // Función para generar consejos personalizados sobre el sueño
  async generatePersonalizedTips(entry) {
    try {
      // Calculamos las estadísticas actuales de sueño
      const stats = this.calculateStatistics();
      // Creamos un mensaje con los datos actuales de sueño y las estadísticas generales
      const prompt = `
        Basado en los siguientes datos de sueño y estadísticas, genera consejos personalizados para mejorar la calidad del sueño:
        
        Entrada actual:
        - Fecha: ${entry.date}
        - Duración: ${entry.duration} horas
        - Calidad: ${entry.quality}/5
        
        Estadísticas generales:
        - Duración promedio: ${stats.avgDuration} horas
        - Calidad promedio: ${stats.avgQuality}/5
        - Total de entradas: ${stats.totalEntries}
        - Promedio semanal: ${stats.weeklyAvgDuration} horas
        
        Por favor, proporciona 3 consejos específicos y personalizados basados en estos datos.
      `;

      // Enviamos los datos al servidor para obtener los consejos personalizados
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }), // Enviamos el mensaje como datos JSON
      });

      // Si la respuesta no es correcta, mostramos un error
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
      }

      // Procesamos la respuesta del servidor para obtener los consejos
      const data = await response.json();
      console.log('Respuesta de Ollama para consejos:', data);

      // Si la respuesta es válida, devolvemos los consejos
      if (data && data.response) {
        return data.response.split('\n').filter(tip => tip.trim() !== '');
      } else {
        throw new Error('Respuesta vacía del servidor');
      }
    } catch (error) {
      // Si ocurre un error, mostramos un mensaje y devolvemos consejos predeterminados
      console.error('Error al generar consejos personalizados:', error);
      return [
        'Hubo un error al generar consejos personalizados.',
        'Por favor, intenta nuevamente más tarde.',
      ];
    }
  },
};
