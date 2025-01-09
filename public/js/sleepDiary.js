export const sleepDiary = {
  sleepEntries: [],
  token: null,

  getBaseUrl() {
    return window.location.origin;
  },

  async init() {
    try {
      console.log('Initializing sleep diary...');
      await this.getValidTokenAndLoadEntries();
    } catch (error) {
      console.error('Error initializing sleep diary:', error);
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('Authentication failed, redirecting to login...');
        this.redirectToLogin();
      }
    }
  },

  async getValidTokenAndLoadEntries() {
    try {
      console.log('Getting valid token...');
      await this.getValidToken();
      console.log('Token obtained successfully');
      
      console.log('Loading sleep entries...');
      await this.loadEntries();
      console.log('Sleep entries loaded successfully');
    } catch (error) {
      console.error('Error in getValidTokenAndLoadEntries:', error);
      throw error;
    }
  },

  async getValidToken() {
    try {
      this.token = localStorage.getItem('token');
      if (!this.token) {
        console.log('No token found, attempting to refresh...');
        return await this.refreshToken();
      }

      const response = await fetch(`${this.getBaseUrl()}/api/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired, attempting to refresh...');
          return await this.refreshToken();
        } else {
          throw new Error('Failed to verify token');
        }
      }

      return this.token;
    } catch (error) {
      console.error('Error getting valid token:', error);
      this.clearAuthData();
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.getBaseUrl()}/api/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      this.token = data.token;
      return this.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearAuthData();
      throw error;
    }
  },

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  },

  redirectToLogin() {
    window.location.href = '/login.html';
  },

  async loadEntries() {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load sleep entries: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.sleepEntries = data.sleepEntries || [];
      console.log('Sleep entries loaded:', this.sleepEntries);
    } catch (error) {
      console.error('Error loading sleep entries:', error);
      if (error.message.includes('401')) {
        console.log('Token expired during request, attempting to refresh and retry...');
        await this.getValidTokenAndLoadEntries();
      } else {
        throw error;
      }
    }
  },

  async addEntry(entry) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(entry),
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.sleepEntries.push(data.entry);
        console.log('Sleep entry added:', data.entry);
      } else if (response.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await this.getValidTokenAndLoadEntries();
        return this.addEntry(entry);
      } else {
        throw new Error(`Failed to add sleep entry: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding sleep entry:', error);
      throw error;
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

    const weeklyAvgDuration = lastWeekEntries.length > 0
      ? lastWeekEntries.reduce((sum, entry) => sum + entry.duration, 0) / lastWeekEntries.length
      : 0;

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
      if (!stats) {
        return ['No hay suficientes datos para generar consejos personalizados.'];
      }

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

      const response = await fetch(`${this.getBaseUrl()}/api/ollama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ prompt }),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired, refreshing and retrying...');
          await this.getValidTokenAndLoadEntries();
          return this.generatePersonalizedTips(entry);
        }
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



