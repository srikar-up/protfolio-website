import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'portfolio_data.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for file operations
const getPortfolioData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    return null;
  }
};

const savePortfolioData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
};

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

  res.status(200).json({
    status: 'success',
    message: `Thank you, ${name}! Your message has been received successfully.`
  });
});

// 3. Get Portfolio Data
app.get('/api/portfolio', async (req, res) => {
  const data = await getPortfolioData();
  if (!data) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not load portfolio data.'
    });
  }
  res.json(data);
});

// 4. Save Portfolio Data
app.post('/api/portfolio', async (req, res) => {
  const success = await savePortfolioData(req.body);
  if (!success) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not save portfolio data.'
    });
  }
  res.json({
    status: 'success',
    message: 'Portfolio data updated successfully.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
