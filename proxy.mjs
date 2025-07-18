import express from 'express';
import fetch from 'node-fetch';

const app = express();
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const PORT = 3001;

// Guardian API
const GUARDIAN_KEY = '248ab775-af92-4aaa-a008-3b14a80c2b86';
app.get('/guardian', async (req, res) => {
  const params = new URLSearchParams({ ...req.query, 'api-key': GUARDIAN_KEY });
  const url = `https://content.guardianapis.com/search?${params}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Guardian API fetch failed', details: err.message });
  }
});

// NewsAPI.org
const NEWSAPI_KEY = 'f0c7f9cbed7347dc888cee85220af58a';
app.get('/newsapi', async (req, res) => {
  const params = new URLSearchParams({ ...req.query, 'apiKey': NEWSAPI_KEY });
  const url = `https://newsapi.org/v2/top-headlines?${params}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'NewsAPI fetch failed', details: err.message });
  }
});

// Mediastack
const MEDIASTACK_KEY = '9d6ca3319109c373b0c63aa48c4c4e8c';
app.get('/mediastack', async (req, res) => {
  const params = new URLSearchParams({ ...req.query, 'access_key': MEDIASTACK_KEY });
  const url = `http://api.mediastack.com/v1/news?${params}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Mediastack fetch failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 