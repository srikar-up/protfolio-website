import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// 1. Status API (checked by React frontend on load)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Express Backend Server Online'
  });
});

// 2. Contact form submission endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (name, email, message) are required.'
    });
  }

  console.log(`[Message Received] Name: ${name}, Email: ${email}`);
  console.log(`Content: ${message}`);

  // In a real app, you would save this to a database (MongoDB, Postgres)
  // or send an email via Nodemailer.

  res.status(200).json({
    status: 'success',
    message: `Thank you, ${name}! Your message has been received successfully.`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
