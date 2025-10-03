const db = require('../config/database');

// @desc    Get overview stats
// @route   GET /api/stats/overview
// @access  Private
const getOverviewStats = (req, res) => {
    const userId = req.user.id;

    const queries = [
        `SELECT COUNT(*) as total_media FROM media WHERE user_id = ${userId}`,
        `SELECT type, COUNT(*) as count FROM media WHERE user_id = ${userId} GROUP BY type`,
        `SELECT status, COUNT(*) as count FROM media WHERE user_id = ${userId} GROUP BY status`,
        `SELECT COUNT(*) as total_read_this_year FROM user_ratings WHERE user_id = ${userId} AND strftime('%Y', finished_date) = strftime('%Y', 'now')`
    ];

    // This is a simplified way to run multiple queries. For a production app,
    // a more robust solution would be better.
    const promises = queries.map(sql => new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    }));

    Promise.all(promises)
        .then(([totalMedia, byType, byStatus, readThisYear]) => {
            res.json({
                totalMedia: totalMedia[0].total_media,
                byType: byType.reduce((acc, { type, count }) => ({ ...acc, [type]: count }), {}),
                byStatus: byStatus.reduce((acc, { status, count }) => ({ ...acc, [status]: count }), {}),
                readThisYear: readThisYear[0].total_read_this_year
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Database error', error: err.message });
        });
};

module.exports = {
    getOverviewStats
};
