const db = require('../config/database');

// @desc    Get tags for a media item
// @route   GET /api/media/:id/tags
// @access  Private
const getMediaTags = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT t.id, t.name, t.color 
                 FROM tags t
                 JOIN media_tags mt ON t.id = mt.tag_id
                 WHERE mt.media_id = ?`;
    db.all(sql, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
};

// @desc    Associate tags with a media item
// @route   POST /api/media/:id/tags
// @access  Private
const associateTags = async (req, res) => {
    const { id: mediaId } = req.params;
    const { tagNames } = req.body; // Expecting an array of tag names (strings)

    if (!Array.isArray(tagNames)) {
        return res.status(400).json({ message: 'tagNames must be an array of strings' });
    }

    const getTagId = (name) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id FROM tags WHERE name = ?', [name], (err, row) => {
                if (err) return reject(err);
                if (row) return resolve(row.id);
                // Tag doesn't exist, create it
                db.run('INSERT INTO tags (name) VALUES (?)', [name], function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                });
            });
        });
    };

    try {
        const tagIds = await Promise.all(tagNames.map(name => getTagId(name.trim())));

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('DELETE FROM media_tags WHERE media_id = ?', [mediaId], (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ message: 'DB error on delete', error: err.message });
                }
            });

            if (tagIds.length > 0) {
                const stmt = db.prepare('INSERT INTO media_tags (media_id, tag_id) VALUES (?, ?)');
                tagIds.forEach(tagId => {
                    stmt.run(mediaId, tagId);
                });
                stmt.finalize((err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ message: 'DB error on finalize', error: err.message });
                    }
                    db.run('COMMIT');
                    res.status(200).json({ message: 'Tags updated successfully' });
                });
            } else {
                db.run('COMMIT');
                res.status(200).json({ message: 'Tags cleared successfully' });
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Error processing tags', error: err.message });
    }
};

module.exports = {
    getMediaTags,
    associateTags
};