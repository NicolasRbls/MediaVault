const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getRating,
    addOrUpdateRating,
    deleteRating
} = require('../controllers/ratingController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
    .get(getRating)
    .post(addOrUpdateRating)
    .delete(deleteRating);

module.exports = router;
