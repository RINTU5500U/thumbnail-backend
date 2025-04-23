require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoute');
const app = express();
app.use(express.json()); // for parsing JSON

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('hello!');
});
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});