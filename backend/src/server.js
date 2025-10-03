require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database connection
require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const tagRoutes = require('./routes/tagRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const loanRoutes = require('./routes/loanRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes (will be uncommented as they are built)
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/stats', statsRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('MediaVault API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
