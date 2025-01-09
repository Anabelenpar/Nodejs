const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = {
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
};

module.exports = auth;


  