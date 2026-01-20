

const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const Logger = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(Logger);
app.use('/api', adminRoutes);

module.exports = app;
