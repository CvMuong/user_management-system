const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const meRoutes = require('./me.route')

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/me', meRoutes);

module.exports = router;