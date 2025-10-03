const express = require('express');
const router = express.Router();
const {
    getAllTags,
    createTag,
    updateTag,
    deleteTag
} = require('../controllers/tagController');
const authMiddleware = require('../middleware/auth');

// All tag routes are protected
router.use(authMiddleware);

router.route('/')
    .get(getAllTags)
    .post(createTag);

router.route('/:id')
    .put(updateTag)
    .delete(deleteTag);

module.exports = router;
