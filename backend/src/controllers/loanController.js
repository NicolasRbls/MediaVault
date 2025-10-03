const db = require('../config/database');

// @desc    Get all active loans for a user
// @route   GET /api/loans
// @access  Private
const getActiveLoans = (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT l.*, m.title, m.cover_image
        FROM loans l
        JOIN media m ON l.media_id = m.id
        WHERE l.lender_id = ? AND l.status = 'active'
        ORDER BY l.loan_date DESC
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Get loan history for a user
// @route   GET /api/loans/history
// @access  Private
const getLoanHistory = (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT l.*, m.title, m.cover_image
        FROM loans l
        JOIN media m ON l.media_id = m.id
        WHERE l.lender_id = ? AND l.status != 'active'
        ORDER BY l.actual_return_date DESC
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Private
const createLoan = (req, res) => {
    const lender_id = req.user.id;
    const { media_id, borrower_name, borrower_contact, loan_date, expected_return_date, notes } = req.body;

    if (!media_id || !borrower_name || !loan_date) {
        return res.status(400).json({ message: 'Media, borrower name, and loan date are required' });
    }

    const sql = `INSERT INTO loans (media_id, lender_id, borrower_name, borrower_contact, loan_date, expected_return_date, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [media_id, lender_id, borrower_name, borrower_contact, loan_date, expected_return_date, notes];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        // Also update the media item's status to 'lent'
        db.run('UPDATE media SET status = \'lent\' WHERE id = ?', [media_id]);
        res.status(201).json({ id: this.lastID, ...req.body });
    });
};

// @desc    Mark a loan as returned
// @route   PUT /api/loans/:id/return
// @access  Private
const returnLoan = (req, res) => {
    const { id } = req.params;
    const lender_id = req.user.id;
    const { actual_return_date } = req.body;

    if (!actual_return_date) {
        return res.status(400).json({ message: 'Actual return date is required' });
    }

    // First, get the media_id from the loan
    db.get('SELECT media_id FROM loans WHERE id = ? AND lender_id = ?', [id, lender_id], (err, loan) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found or user not authorized' });
        }

        const sql = 'UPDATE loans SET status = \'returned\', actual_return_date = ? WHERE id = ?';
        db.run(sql, [actual_return_date, id], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            // Update media status back to 'owned'
            db.run('UPDATE media SET status = \'owned\' WHERE id = ?', [loan.media_id]);
            res.json({ message: 'Loan marked as returned' });
        });
    });
};

module.exports = {
    getActiveLoans,
    getLoanHistory,
    createLoan,
    returnLoan
};
