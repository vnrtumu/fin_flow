const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { successResponse } = require('@finflow/utils');

// Mock user DB lookup for Phase 1 testing
const mockUser = {
  id: 1,
  email: 'user@finflow.com',
  password_hash: bcrypt.hashSync('password123', 10),
  role: 'user'
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (email !== mockUser.email) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, mockUser.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT (Normally we'd use process.env.JWT_ACCESS_PRIVATE_KEY_B64)
    // Using a simple secret here for demonstration before adding the RS256 flow.
    const token = jwt.sign(
      { userId: mockUser.id, role: mockUser.role },
      'development_secret_key_placeholder',
      { expiresIn: '15m' }
    );

    return successResponse(res, { token });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  return successResponse(res, null, 'Refresh endpoint not yet fully implemented');
};

const logout = async (req, res, next) => {
  return successResponse(res, null, 'Logout successful');
};

module.exports = {
  login,
  refresh,
  logout
};
