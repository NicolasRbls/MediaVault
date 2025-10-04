const db = require('../config/database');

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = (req, res) => {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const whereClause = 'WHERE username LIKE ? OR email LIKE ?';
    const searchParam = `%${search}%`;

    const countSql = `SELECT COUNT(*) as count FROM users ${search ? whereClause : ''}`;
    const dataSql = `SELECT id, username, email, role, created_at FROM users ${search ? whereClause : ''} ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    const countParams = search ? [searchParam, searchParam] : [];
    const dataParams = search ? [searchParam, searchParam, limit, offset] : [limit, offset];

    db.get(countSql, countParams, (err, totalRow) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        const totalUsers = totalRow.count;
        const totalPages = Math.ceil(totalUsers / limit);

        db.all(dataSql, dataParams, (err, users) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.json({
                data: users,
                pagination: {
                    totalPages,
                    currentPage: page,
                    totalItems: totalUsers
                }
            });
        });
    });
};

// @desc    Get system-wide stats
// @route   GET /api/admin/stats
// @access  Admin
const getSystemStats = (req, res) => {
    const queries = {
        totalUsers: { sql: 'SELECT COUNT(*) as count FROM users', method: 'get' },
        totalMedia: { sql: 'SELECT COUNT(*) as count FROM media', method: 'get' },
        totalCollections: { sql: 'SELECT COUNT(*) as count FROM collections', method: 'get' },
        activeLoans: { sql: `SELECT COUNT(*) as count FROM loans WHERE status = 'active'`, method: 'get' },
        byType: { sql: 'SELECT type, COUNT(*) as count FROM media GROUP BY type', method: 'all' }
    };

    const promises = Object.entries(queries).map(([key, { sql, method }]) => 
        new Promise((resolve, reject) => {
            db[method](sql, [], (err, result) => {
                if (err) return reject(err);

                if (method === 'get') {
                    // Robust check for empty results from a COUNT query
                    resolve({ [key]: result ? result.count : 0 });
                } else { // method === 'all'
                    const processedResult = result.reduce((acc, { type, count }) => ({ ...acc, [type]: count }), {});
                    resolve({ [key]: processedResult });
                }
            });
        })
    );

    Promise.all(promises)
        .then(results => {
            const stats = results.reduce((acc, current) => ({ ...acc, ...current }), {});
            res.json(stats);
        })
        .catch(err => {
            res.status(500).json({ message: 'Database error', error: err.message });
        });
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUserRole = (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Prevent admin from changing their own role
    if (req.user.id === parseInt(id, 10)) {
        return res.status(400).json({ message: 'Admins cannot change their own role.' });
    }

    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    db.run(sql, [role, id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User role updated successfully.' });
    });
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = (req, res) => {
    const { id } = req.params;

    if (req.user.id === parseInt(id, 10)) {
        return res.status(400).json({ message: 'Admins cannot delete themselves.' });
    }

    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully.' });
    });
};

// @desc    Get all media items with pagination and search
// @route   GET /api/admin/media
// @access  Admin
const getAllMedia = (req, res) => {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const whereClause = 'WHERE m.title LIKE ? OR m.author_creator LIKE ?';
    const searchParam = `%${search}%`;

    const countSql = `SELECT COUNT(*) as count FROM media m ${search ? whereClause : ''}`;
    const dataSql = `
        SELECT m.*, u.username as owner_username
        FROM media m
        JOIN users u ON m.user_id = u.id
        ${search ? whereClause : ''}
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const countParams = search ? [searchParam, searchParam] : [];
    const dataParams = search ? [searchParam, searchParam, limit, offset] : [limit, offset];

    db.get(countSql, countParams, (err, totalRow) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        const totalItems = totalRow.count;
        const totalPages = Math.ceil(totalItems / limit);

        db.all(dataSql, dataParams, (err, media) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.json({
                data: media,
                pagination: {
                    totalPages,
                    currentPage: page,
                    totalItems
                }
            });
        });
    });
};

// @desc    Update a media item
// @route   PUT /api/admin/media/:id
// @access  Admin
const updateMedia = (req, res) => {
    const { id } = req.params;
    const fields = req.body;

    // Remove id from fields to prevent changing it
    delete fields.id;

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }

    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    const sql = `UPDATE media SET ${setClause} WHERE id = ?`;

    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Media not found.' });
        }
        res.json({ message: 'Media updated successfully.' });
    });
};

// @desc    Delete a media item
// @route   DELETE /api/admin/media/:id
// @access  Admin
const deleteMedia = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM media WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Media not found.' });
        }
        res.json({ message: 'Media deleted successfully.' });
    });
};

module.exports = {
    getAllUsers,
    getSystemStats,
    updateUserRole,
    deleteUser,
    getAllMedia,
    updateMedia,
    deleteMedia,
};
