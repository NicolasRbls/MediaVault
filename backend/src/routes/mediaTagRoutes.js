const express = require('express');
// We need to merge params to get the :id from the parent router (media)
const router = express.Router({ mergeParams: true }); 

const {
    getMediaTags,
    associateTags
} = require('../controllers/mediaTagController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
    .get(getMediaTags)
    .post(associateTags);

module.exports = router;
