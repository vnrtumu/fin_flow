const express = require('express');
const { register, getProfile } = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', register);
router.get('/me', getProfile);

module.exports = router;
