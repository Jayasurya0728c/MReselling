import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { db } from './db.js';

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. API Routes
  if (pathname.startsWith('/api')) {
    try {
      const authHeader = req.headers['authorization'];
      const isAdmin = Boolean(authHeader && authHeader.includes('Bearer '));

      // Auth
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { email, password } = await parseBody(req);
        if (!email || !password) {
          return sendJson(res, 400, { error: 'Email and password are required' });
        }
        const user = db.verifyUser(email, password);
        if (!user) {
          return sendJson(res, 401, { error: 'Invalid email or password' });
        }
        return sendJson(res, 200, { user, token: `tok_${user.id}_${Date.now()}` });
      }

      if (pathname === '/api/auth/me' && req.method === 'GET') {
        return sendJson(res, 200, { user: db.getUserById('144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37') });
      }

      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        return sendJson(res, 200, { success: true });
      }

      // Products
      if (pathname === '/api/products' && req.method === 'GET') {
        return sendJson(res, 200, db.getProducts(isAdmin));
      }

      if (pathname.startsWith('/api/products/') && req.method === 'GET') {
        const id = pathname.replace('/api/products/', '');
        const product = db.getProductById(id, isAdmin);
        if (!product) return sendJson(res, 404, { error: 'Product not found' });
        return sendJson(res, 200, product);
      }

      if (pathname === '/api/products' && req.method === 'POST') {
        const data = await parseBody(req);
        return sendJson(res, 201, db.saveProduct(data));
      }

      if (pathname.startsWith('/api/products/') && (req.method === 'PUT' || req.method === 'PATCH')) {
        const id = pathname.replace('/api/products/', '');
        const data = await parseBody(req);
        return sendJson(res, 200, db.saveProduct({ ...data, id }));
      }

      if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
        const id = pathname.replace('/api/products/', '');
        return sendJson(res, 200, { success: db.deleteProduct(id) });
      }

      // Orders
      if (pathname === '/api/orders' && req.method === 'GET') {
        return sendJson(res, 200, db.getOrders());
      }

      if (pathname === '/api/orders' && req.method === 'POST') {
        const data = await parseBody(req);
        return sendJson(res, 201, db.createOrder(data));
      }

      if (pathname.startsWith('/api/orders/') && (req.method === 'PATCH' || req.method === 'PUT')) {
        const id = pathname.replace('/api/orders/', '');
        const updates = await parseBody(req);
        const updated = db.updateOrder(id, updates);
        if (!updated) return sendJson(res, 404, { error: 'Order not found' });
        return sendJson(res, 200, updated);
      }

      // Settings
      if (pathname === '/api/settings' && req.method === 'GET') {
        return sendJson(res, 200, db.getSettings());
      }

      if (pathname === '/api/settings' && (req.method === 'PUT' || req.method === 'POST')) {
        const updates = await parseBody(req);
        return sendJson(res, 200, db.updateSettings(updates));
      }

      return sendJson(res, 404, { error: 'API route not found' });
    } catch (err) {
      console.error('[API Error]:', err);
      return sendJson(res, 500, { error: err.message || 'Internal server error' });
    }
  }

  // 2. Static File Serving from dist/
  let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

  // If path doesn't have extension and file doesn't exist, fallback to index.html (SPA)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    if (ext !== '.html') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.end('Server error loading asset');
  }
});

server.listen(PORT, () => {
  console.log(`[Production Server] Running at http://localhost:${PORT}`);
});
