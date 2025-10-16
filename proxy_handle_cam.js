const express = require('express');
const fetch = require('node-fetch');  // v2
const cors = require('cors');

const app = express();
const PORT = 3001;

// Permitir CORS para o frontend
app.use(cors({
  origin: '*',  // Adjust for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Dynamic endpoint para Surfline playlists - supports multiple cameras
app.get('/proxy/surfline/:country/:location', async (req, res) => {
  try {
    const { country, location } = req.params;
    const url = `https://hls.cdn-surfline.com/${country}/${location}/playlist.m3u8`;
    
    console.log('Fetching playlist for:', url);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Referer': 'https://www.surfline.com/',
      'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    };

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

    let m3u8Content = await response.text();

    // Since M3U8 has relative URLs, we don't need to rewrite them
    // VideoJS will automatically resolve relative URLs based on the playlist URL
    
    // Log the content sample to debug
    console.log(`M3U8 content sample for ${country}/${location}:`, m3u8Content.substring(0, 300));

    res.set('Content-Type', 'application/x-mpegURL');
    res.set('Cache-Control', 'max-age=30'); // Cache playlist for 30 seconds
    res.send(m3u8Content);
  } catch (error) {
    console.error(`Proxy playlist error for ${req.params.country}/${req.params.location}:`, error.message);
    res.status(500).send('Error fetching playlist from Surfline');
  }
});

// add explicit playlist route that includes the filename so clients requesting the playlist path with the filename get the same content
app.get('/proxy/surfline/:country/:location/playlist.m3u8', async (req, res) => {
  try {
    const { country, location } = req.params;
    const url = `https://hls.cdn-surfline.com/${country}/${location}/playlist.m3u8`;
    console.log('Fetching playlist for:', url);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Referer': 'https://www.surfline.com/',
      'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    };

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

    let m3u8Content = await response.text();

    // Rewrite any absolute Surfline URLs in the playlist to route via our proxy
    // Example: https://hls.cdn-surfline.com/ireland/pt-covadovapor/media_31008_j2rwb.ts
    // becomes:  https://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/media_31008_j2rwb.ts
    m3u8Content = m3u8Content.replace(
      /https?:\/\/hls\.cdn-surfline\.com\/([^\/]+)\/([^\/]+)\//g,
      'https://proxy.huna.pt/proxy/surfline/$1/$2/'
    );

    console.log(`M3U8 content sample for ${country}/${location}:`, m3u8Content.substring(0, 300));

    res.set('Content-Type', 'application/x-mpegURL');
    res.set('Cache-Control', 'max-age=30');
    res.send(m3u8Content);
  } catch (error) {
    console.error(`Proxy playlist error for ${req.params.country}/${req.params.location}:`, error.message);
    res.status(500).send('Error fetching playlist from Surfline');
  }
});

// Dynamic endpoint para segmentos de vídeo - supports multiple cameras
app.get('/proxy/surfline/:country/:location/*', async (req, res) => {
  try {
    const { country, location } = req.params;
    const segment = req.params[0]; // The segment filename
    
    console.log(`=== SURFLINE SEGMENT REQUEST ===`);
    console.log('Country:', country);
    console.log('Location:', location);
    console.log('Segment:', segment);
    console.log('Full request URL:', req.url);
    
    const originalUrl = `https://hls.cdn-surfline.com/${country}/${location}/${segment}`;
    console.log('Fetching segment from:', originalUrl);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Referer': 'https://www.surfline.com/',
      'Accept': '*/*',
      'Cache-Control': 'no-cache'
    };

    const response = await fetch(originalUrl, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${originalUrl}`);

    const contentType = response.headers.get('content-type') || 'video/MP2T';
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'max-age=300'); // Cache segments for 5 minutes
    res.send(await response.buffer());
  } catch (error) {
    console.error(`Proxy segment error for ${req.params.country}/${req.params.location}/${req.params[0]}:`, error.message);
    res.status(500).send('Error fetching segment');
  }
});

// Backward compatibility - redirect old single endpoint to pt-covadovapor
app.get('/proxy/surfline', async (req, res) => {
  console.log('Redirecting old endpoint to pt-covadovapor');
  res.redirect('/proxy/surfline/ireland/pt-covadovapor');
});

// Catch-all for any media segments that don't match the above patterns
app.get('/proxy/media_*.ts', async (req, res) => {
  try {
    console.log('=== CATCH-ALL ROUTE HIT ===');
    console.log('Full URL:', req.url);
    console.log('Path:', req.path);
    
    // Extract filename from path
    const filename = req.path.split('/').pop();
    console.log('Extracted filename:', filename);
    
    // Default to pt-covadovapor for backward compatibility
    const originalUrl = `https://hls.cdn-surfline.com/ireland/pt-covadovapor/${filename}`;
    console.log('Fetching from default location:', originalUrl);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Referer': 'https://www.surfline.com/',
      'Accept': '*/*',
      'Cache-Control': 'no-cache'
    };

    const response = await fetch(originalUrl, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || 'video/MP2T';
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(await response.buffer());
  } catch (error) {
    console.error('Catch-all proxy error:', error.message);
    res.status(500).send('Error fetching segment');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});