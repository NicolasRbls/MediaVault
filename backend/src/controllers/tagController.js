const db = require('../config/database');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Private
const getAllTags = (req, res) => {
    db.all('SELECT * FROM tags ORDER BY name', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Create a new tag
// @route   POST /api/tags
// @access  Private
const createTag = (req, res) => {
    const { name, color } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Tag name is required' });
    }

    const sql = 'INSERT INTO tags (name, color) VALUES (?, ?)';
    db.run(sql, [name, color], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, color });
    });
};

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Private
const updateTag = (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Tag name is required' });
    }

    const sql = 'UPDATE tags SET name = ?, color = ? WHERE id = ?';
    db.run(sql, [name, color, id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.json({ message: 'Tag updated successfully' });
    });
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private
const deleteTag = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tags WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        // Also remove associations
        db.run('DELETE FROM media_tags WHERE tag_id = ?', [id], (err) => {
            if (err) console.error("Error cleaning up media_tags", err.message);
        });
        res.json({ message: 'Tag deleted successfully' });
    });
};

module.exports = {
    getAllTags,
    createTag,
    updateTag,
    deleteTag
};
