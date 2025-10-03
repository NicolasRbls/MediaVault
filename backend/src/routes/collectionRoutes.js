const express = require('express');
const router = express.Router();
const {
    getAllCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addMediaToCollection, // I will add this to the controller
    removeMediaFromCollection // I will add this to the controller
} = require('../controllers/collectionController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
    .get(getAllCollections)
    .post(createCollection);

router.route('/:id')
    .get(getCollectionById)
    .put(updateCollection)
    .delete(deleteCollection);

// Routes for managing media within a collection
router.route('/:id/media')
    .post(addMediaToCollection);

router.route('/:id/media/:mediaId')
    .delete(removeMediaFromCollection);

module.exports = router;
