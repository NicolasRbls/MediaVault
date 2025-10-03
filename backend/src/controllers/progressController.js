const db = require('../config/database');

// @desc    Get progress for a media item
// @route   GET /api/media/:id/progress
// @access  Private
const getProgress = (req, res) => {
    const { id: media_id } = req.params;
    const user_id = req.user.id;

    db.get('SELECT * FROM reading_progress WHERE media_id = ? AND user_id = ?', [media_id, user_id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(row); // Will be null if no progress exists
    });
};

// @desc    Add or update progress for a media item
// @route   POST /api/media/:id/progress
// @access  Private
const updateProgress = (req, res) => {
    const { id: media_id } = req.params;
    const user_id = req.user.id;
    const {
        current_page, total_pages, current_episode, total_episodes
    } = req.body;

    let percentage_complete = 0;
    if (total_pages > 0 && current_page > 0) {
        percentage_complete = (current_page / total_pages) * 100;
    } else if (total_episodes > 0 && current_episode > 0) {
        percentage_complete = (current_episode / total_episodes) * 100;
    }

    const upsertSql = `
        INSERT INTO reading_progress (user_id, media_id, current_page, total_pages, current_episode, total_episodes, percentage_complete, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, media_id) DO UPDATE SET
            current_page = excluded.current_page,
            total_pages = excluded.total_pages,
            current_episode = excluded.current_episode,
            total_episodes = excluded.total_episodes,
            percentage_complete = excluded.percentage_complete,
            last_updated = CURRENT_TIMESTAMP;
    `;

    const params = [user_id, media_id, current_page, total_pages, current_episode, total_episodes, percentage_complete];

    db.run(upsertSql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ message: 'Progress saved successfully' });
    });
};

module.exports = {
    getProgress,
    updateProgress
};
