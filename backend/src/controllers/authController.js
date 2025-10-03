const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const password_hash = bcrypt.hashSync(password, salt);

        // Insert user into database
        const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.run(sql, [username, email, password_hash], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.status(201).json({ id: this.lastID, username, email });
        });
    });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT Payload
        const payload = {
            id: user.id,
            username: user.username
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: 3600 }, // 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = (req, res) => {
    // The user object is attached to the request in the auth middleware
    db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    });
};


module.exports = {
    register,
    login,
    getProfile
};
