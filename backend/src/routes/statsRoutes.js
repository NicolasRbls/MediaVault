const express = require('express');
const router = express.Router();
const {
    getOverviewStats
} = require('../controllers/statsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/overview')
    .get(getOverviewStats);

module.exports = router;
