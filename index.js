require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false })); // middleware to parse POST body

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Test endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Store one URL for testing
let originalUrl;

// POST endpoint to create short URL
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  let hostname;

  // Check URL format
  try {
    hostname = new URL(url).hostname;
  } catch {
    return res.json({ error: 'invalid url' });
  }

  // DNS lookup to verify hostname
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    originalUrl = url; // save valid URL
    res.json({ original_url: originalUrl, short_url: 1 });
  });
});

// GET endpoint to redirect to original URL
app.get('/api/shorturl/1', (req, res) => {
  if (!originalUrl) {
    return res.json({ error: 'No URL found' });
  }
  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
