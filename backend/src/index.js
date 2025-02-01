require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT;

connectDB().then(() => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to MongoDB. Server not started.', err);
});