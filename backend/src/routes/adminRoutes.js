const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    getSystemStats, 
    updateUserRole, 
    deleteUser, 
    getAllMedia,
    updateMedia,
    deleteMedia,
    getAllCollections,
    updateCollection,
    deleteCollection,
    getAllLoans,
    updateLoan,
    deleteLoan
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

// Collection Management
router.get('/collections', adminAuth, getAllCollections);
router.put('/collections/:id', adminAuth, updateCollection);
router.delete('/collections/:id', adminAuth, deleteCollection);

// Loan Management
router.get('/loans', adminAuth, getAllLoans);
router.put('/loans/:id', adminAuth, updateLoan);
router.delete('/loans/:id', adminAuth, deleteLoan);

module.exports = router;
