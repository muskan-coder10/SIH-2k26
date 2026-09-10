const express = require('express');
const router = express.Router();

// Base URL of the Python chatbot microservice. Override with CHATBOT_SERVICE_URL
// env var if it runs on a different host/port (e.g. in production/docker).
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:5050';

// POST /api/chatbot/chat  { message: "..." }
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const response = await fetch(`${CHATBOT_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      return res.status(502).json({ message: 'Chatbot service error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(503).json({
      message: 'Chatbot service unavailable. Make sure the Python service (app.py) is running.',
    });
  }
});

module.exports = router;