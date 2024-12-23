import { auth } from './auth.js';

export const sleepDiary = {
  sleepEntries: [],
  token: null,

  async init() {
    try {
      this.token = await auth.getValidToken();
      await this.loadEntries();
    } catch (error) {
      console.error('Error initializing sleep diary:', error);
    }
  },

  async loadEntries() {
    try {
      const response = await fetch('http://localhost:3000/api/data', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        this.sleepEntries = data.sleepEntries || [];
        console.log('Sleep entries loaded:', this.sleepEntries);
      } else {
        throw new Error(`Failed to load sleep entries: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading sleep entries:', error);
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      if (error.message.includes('401')) {
        // Token might have expired during the request, try to refresh and retry
        try {
          this.token = await auth.refreshToken();
          await this.loadEntries(); // Retry loading entries with new token
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    }
  },

  async addEntry(entry) {
    try {
      const response = await fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(entry)
      });
      if (response.ok) {
        this.sleepEntries.push(entry);
        console.log('Sleep entry added:', entry);
      } else {
        throw new Error('Failed to add sleep entry');
      }
    } catch (error) {
      console.error('Error adding sleep entry:', error);
      if (error.message.includes('401')) {
        // Token might have expired during the request, try to refresh and retry
        try {
          this.token = await auth.refreshToken();
          await this.addEntry(entry); // Retry adding entry with new token
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    }
  },

  calculateStatistics() {
        if (this.sleepEntries.length === 0) return null;

        const totalDuration = this.sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
        const totalQuality = this.sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
        const avgDuration = totalDuration / this.sleepEntries.length;
        const avgQuality = totalQuality / this.sleepEntries.length;

        const lastWeekEntries = this.sleepEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
        });

        const weeklyAvgDuration = lastWeekEntries.reduce((sum, entry) => sum + entry.duration, 0) / lastWeekEntries.length || 0;

        return {
            avgDuration: avgDuration.toFixed(2),
            avgQuality: avgQuality.toFixed(2),
            totalEntries: this.sleepEntries.length,
            weeklyAvgDuration: weeklyAvgDuration.toFixed(2)
        };
    },

    async generatePersonalizedTips(entry) {
        try {
            const stats = this.calculateStatistics();
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

            const response = await fetch('/api/ollama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta de Ollama para consejos:', data);

            if (data && data.response) {
                return data.response.split('\n').filter(tip => tip.trim() !== '');
            } else {
                throw new Error('Respuesta vacía del servidor');
            }
        } catch (error) {
            console.error('Error al generar consejos personalizados:', error);
            return [
                'Hubo un error al generar consejos personalizados.',
                'Por favor, intenta nuevamente más tarde.',
            ];
        }
    },
};
