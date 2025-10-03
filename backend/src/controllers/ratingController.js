const db = require('../config/database');

// @desc    Get rating for a media item
// @route   GET /api/media/:id/ratings
// @access  Private
const getRating = (req, res) => {
    const { id: media_id } = req.params;
    const user_id = req.user.id;

    db.get('SELECT * FROM user_ratings WHERE media_id = ? AND user_id = ?', [media_id, user_id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(row); // Will be null if no rating exists
    });
};

// @desc    Add or update a rating for a media item
// @route   POST /api/media/:id/ratings
// @access  Private
const addOrUpdateRating = (req, res) => {
    const { id: media_id } = req.params;
    const user_id = req.user.id;
    const { rating, review, finished_date } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const upsertSql = `
        INSERT INTO user_ratings (user_id, media_id, rating, review, finished_date)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, media_id) DO UPDATE SET
        rating = excluded.rating,
        review = excluded.review,
        finished_date = excluded.finished_date;
    `;

    db.run(upsertSql, [user_id, media_id, rating, review, finished_date], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ message: 'Rating saved successfully' });
    });
};

// @desc    Delete a rating for a media item
// @route   DELETE /api/media/:id/ratings
// @access  Private
const deleteRating = (req, res) => {
    const { id: media_id } = req.params;
    const user_id = req.user.id;

    db.run('DELETE FROM user_ratings WHERE media_id = ? AND user_id = ?', [media_id, user_id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.json({ message: 'Rating deleted successfully' });
    });
};

module.exports = {
    getRating,
    addOrUpdateRating,
    deleteRating
};
