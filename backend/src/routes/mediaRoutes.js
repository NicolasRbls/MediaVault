const express = require('express');
const router = express.Router();
const {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
} = require('../controllers/mediaController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Import nested routes
const mediaTagRoutes = require('./mediaTagRoutes');
const ratingRoutes = require('./ratingRoutes');
const progressRoutes = require('./progressRoutes');

// All media routes are protected
router.use(authMiddleware);

// Use nested routes for tags associated with a media item
router.use('/:id/tags', mediaTagRoutes);
router.use('/:id/ratings', ratingRoutes);
router.use('/:id/progress', progressRoutes);

router.route('/')
    .get(getAllMedia)
    .post(upload.single('cover_image'), createMedia);

router.route('/:id')
    .get(getMediaById)
    .put(upload.single('cover_image'), updateMedia)
    .delete(deleteMedia);

module.exports = router;
