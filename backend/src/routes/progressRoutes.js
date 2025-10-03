const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getProgress,
    updateProgress
} = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
    .get(getProgress)
    .post(updateProgress);

module.exports = router;
