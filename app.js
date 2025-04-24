require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRoutes = require('./src/routes/userRoute');
const app = express();
app.use(express.json()); // for parsing JSON
// const allowedOrigins = new Set([
//   "http://localhost:5173",
//   "https://thumbnail-guru.vercel.app",
// ]);

// app.use(cors({
//   origin: (origin, callback) =>
//     !origin || allowedOrigins.has(origin)
//       ? callback(null, true)
//       : callback(new Error("Not allowed by CORS")),
//   credentials: true,
// }));

app.use(cors({ origin: true, credentials: true }));

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