const { successResponse } = require('@finflow/utils');

const register = async (req, res, next) => {
  try {
    // In a real implementation we would validate req.body and save to User model
    return successResponse(res, { email: req.body.email }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // The API Gateway adds user info to the headers or we get it from token
    return successResponse(res, { id: 1, email: 'user@finflow.com', role: 'user' }, 'Profile fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  getProfile
};
