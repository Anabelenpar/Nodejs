export const auth = {
    async refreshToken() {
      try {
        const response = await fetch('/api/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login.html';
      }
    },
  
    async getValidToken() {
      let token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      try {
        const response = await fetch('/api/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          if (response.status === 401) {
            token = await this.refreshToken();
          } else {
            throw new Error('Failed to verify token');
          }
        }
  
        return token;
      } catch (error) {
        console.error('Error getting valid token:', error);
        throw error;
      }
    }
  };
  