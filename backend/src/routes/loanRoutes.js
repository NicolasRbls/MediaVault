const express = require('express');
const router = express.Router();
const {
    getActiveLoans,
    getLoanHistory,
    createLoan,
    returnLoan
} = require('../controllers/loanController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.route('/')
    .get(getActiveLoans)
    .post(createLoan);

router.route('/history')
    .get(getLoanHistory);

router.route('/:id/return')
    .put(returnLoan);

module.exports = router;
