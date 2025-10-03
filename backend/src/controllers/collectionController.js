const db = require('../config/database');

// @desc    Get all collections for a user
// @route   GET /api/collections
// @access  Private
const getAllCollections = (req, res) => {
    const userId = req.user.id;
    db.all('SELECT c.*, (SELECT COUNT(*) FROM collection_items ci WHERE ci.collection_id = c.id) as media_count FROM collections c WHERE c.user_id = ? ORDER BY c.name', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Get a single collection with its media
// @route   GET /api/collections/:id
// @access  Private
const getCollectionById = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const sql = 'SELECT * FROM collections WHERE id = ? AND user_id = ?';
    db.get(sql, [id, userId], (err, collection) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const mediaSql = `SELECT m.* FROM media m JOIN collection_items ci ON m.id = ci.media_id WHERE ci.collection_id = ? ORDER BY ci.added_at DESC`;
        db.all(mediaSql, [id], (err, mediaItems) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.json({ ...collection, items: mediaItems });
        });
    });
};

// @desc    Create a new collection
// @route   POST /api/collections
// @access  Private
const createCollection = (req, res) => {
    const userId = req.user.id;
    const { name, description, is_public } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Collection name is required' });
    }

    const sql = 'INSERT INTO collections (user_id, name, description, is_public) VALUES (?, ?, ?, ?)';
    db.run(sql, [userId, name, description, is_public || 0], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, is_public } = req.body;

    const sql = 'UPDATE collections SET name = ?, description = ?, is_public = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [name, description, is_public, id, userId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Collection not found or user not authorized' });
        }
        res.json({ message: 'Collection updated successfully' });
    });
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run('DELETE FROM collection_items WHERE collection_id = ?', [id]);
        db.run('DELETE FROM collections WHERE id = ? AND user_id = ?', [id, userId], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            if (this.changes === 0) {
                db.run('ROLLBACK');
                return res.status(404).json({ message: 'Collection not found or user not authorized' });
            }
            db.run('COMMIT');
            res.json({ message: 'Collection deleted successfully' });
        });
    });
};

// @desc    Add media to a collection
// @route   POST /api/collections/:id/media
// @access  Private
const addMediaToCollection = (req, res) => {
    const { id: collection_id } = req.params;
    const { media_id } = req.body;

    if (!media_id) {
        return res.status(400).json({ message: 'Media ID is required' });
    }

    const sql = 'INSERT INTO collection_items (collection_id, media_id) VALUES (?, ?)';
    db.run(sql, [collection_id, media_id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error or item already in collection', error: err.message });
        }
        res.status(201).json({ message: 'Media added to collection' });
    });
};

// @desc    Remove media from a collection
// @route   DELETE /api/collections/:id/media/:mediaId
// @access  Private
const removeMediaFromCollection = (req, res) => {
    const { id: collection_id, mediaId: media_id } = req.params;

    const sql = 'DELETE FROM collection_items WHERE collection_id = ? AND media_id = ?';
    db.run(sql, [collection_id, media_id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Media item not found in this collection' });
        }
        res.json({ message: 'Media removed from collection' });
    });
};

module.exports = {
    getAllCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addMediaToCollection,
    removeMediaFromCollection
};