const db = require('../config/database');

// @desc    Get all media for a user
// @route   GET /api/media
// @access  Private
const getAllMedia = (req, res) => {
    const userId = req.user.id;
    const { status, type } = req.query;

    let sql = 'SELECT * FROM media WHERE user_id = ?';
    const params = [userId];

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    if (type) {
        sql += ' AND type = ?';
        params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Get a single media item
// @route   GET /api/media/:id
// @access  Private
const getMediaById = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.get('SELECT * FROM media WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Media not found' });
        }
        res.json(row);
    });
};

// @desc    Create a new media item
// @route   POST /api/media
// @access  Private
const createMedia = (req, res) => {
    const userId = req.user.id;
    const {
        title, type, author_creator, description, release_year, isbn_code, status, acquisition_date
    } = req.body;

    if (!title || !type) {
        return res.status(400).json({ message: 'Title and type are required' });
    }

    const sql = `INSERT INTO media (user_id, title, type, author_creator, description, release_year, isbn_code, status, acquisition_date, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

    const params = [userId, title, type, author_creator, description, release_year, isbn_code, status, acquisition_date];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
};

// @desc    Update a media item
// @route   PUT /api/media/:id
// @access  Private
const updateMedia = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const {
        title, type, author_creator, description, release_year, isbn_code, status, acquisition_date
    } = req.body;

    const sql = `UPDATE media SET
                    title = ?,
                    type = ?,
                    author_creator = ?,
                    description = ?,
                    release_year = ?,
                    isbn_code = ?,
                    status = ?,
                    acquisition_date = ?,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = ? AND user_id = ?`;

    const params = [title, type, author_creator, description, release_year, isbn_code, status, acquisition_date, id, userId];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Media not found or user not authorized' });
        }
        res.json({ message: 'Media updated successfully' });
    });
};

// @desc    Delete a media item
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.run('DELETE FROM media WHERE id = ? AND user_id = ?', [id, userId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Media not found or user not authorized' });
        }
        res.json({ message: 'Media deleted successfully' });
    });
};

module.exports = {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
};
