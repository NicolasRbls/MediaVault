const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    getSystemStats, 
    updateUserRole, 
    deleteUser, 
    getAllMedia,
    updateMedia,
    deleteMedia
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// User Management
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id', adminAuth, updateUserRole);
router.delete('/users/:id', adminAuth, deleteUser);

// Stats
router.get('/stats', adminAuth, getSystemStats);

// Media Management
router.get('/media', adminAuth, getAllMedia);
router.put('/media/:id', adminAuth, updateMedia);
router.delete('/media/:id', adminAuth, deleteMedia);

module.exports = router;
