const db = require('../config/database');
const path = require('path');

// @desc    Get all media for a user
// @route   GET /api/media
// @access  Private
const getAllMedia = (req, res) => {
    const userId = req.user.id;
    const { status, type, limit } = req.query;

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

    if (limit) {
        sql += ' LIMIT ?';
        params.push(parseInt(limit, 10));
    }

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

    const cover_image = req.file ? path.join('/uploads', req.file.filename) : null;

    const sql = `INSERT INTO media (user_id, title, type, author_creator, description, cover_image, release_year, isbn_code, status, acquisition_date, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

    const params = [userId, title, type, author_creator, description, cover_image, release_year, isbn_code, status, acquisition_date];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID, cover_image, ...req.body });
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

    // First, get the existing media item to check for an old image
    db.get('SELECT cover_image FROM media WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Media not found or user not authorized' });
        }

        let cover_image = row.cover_image;
        if (req.file) {
            // TODO: Optionally delete the old image from the filesystem `row.cover_image`
            cover_image = path.join('/uploads', req.file.filename);
        }

        const sql = `UPDATE media SET
                        title = ?,
                        type = ?,
                        author_creator = ?,
                        description = ?,
                        release_year = ?,
                        isbn_code = ?,
                        status = ?,
                        acquisition_date = ?,
                        cover_image = ?,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE id = ? AND user_id = ?`;

        const params = [title, type, author_creator, description, release_year, isbn_code, status, acquisition_date, cover_image, id, userId];

        db.run(sql, params, function(err) {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            if (this.changes === 0) {
                // This case should ideally not be hit due to the check above, but as a fallback
                return res.status(404).json({ message: 'Media not found or user not authorized' });
            }
            res.json({ message: 'Media updated successfully', cover_image });
        });
    });
};

// @desc    Delete a media item
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    // TODO: Optionally delete the image from the filesystem

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
