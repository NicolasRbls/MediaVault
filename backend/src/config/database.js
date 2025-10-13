const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../mediavault.db');
const schemaPath = path.resolve(__dirname, '../models/database.sql');

// Function to seed the admin user
function seedAdminUser() {
    const adminEmail = 'admin@gmail.com';
    const adminUsername = 'admin1';
    const adminPassword = 'admin';

    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, user) => {
        if (err) {
            console.error('Error checking for admin user', err.message);
            return;
        }
        if (!user) {
            // Admin user doesn't exist, create it
            const salt = bcrypt.genSaltSync(10);
            const password_hash = bcrypt.hashSync(adminPassword, salt);
            const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
            
            db.run(sql, [adminUsername, adminEmail, password_hash, 'admin'], function(err) {
                if (err) {
                    console.error('Error creating admin user', err.message);
                } else {
                    console.log('Admin user created successfully.');
                }
            });
        } else {
            console.log('Admin user already exists.');
        }
    });
}

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

// Create tables from schema.sql
function createTables() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error creating tables', err.message);
        } else {
            console.log('Tables created successfully.');
            // Seed the admin user after tables are created
            seedAdminUser();
        }
    });
}

module.exports = db;
