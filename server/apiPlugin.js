import { db } from './db.js';

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

export function apiPlugin() {
  return {
    name: 'nammude-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        if (!pathname.startsWith('/api')) {
          return next();
        }

        try {
          const authHeader = req.headers['authorization'];
          const isAdmin = Boolean(authHeader && authHeader.includes('Bearer '));

          // 1. Auth routes
          if (pathname === '/api/auth/login' && req.method === 'POST') {
            const { email, password } = await parseBody(req);
            if (!email || !password) {
              return sendJson(res, 400, { error: 'Email and password are required' });
            }

            const user = db.verifyUser(email, password);
            if (!user) {
              return sendJson(res, 401, { error: 'Invalid email or password' });
            }

            return sendJson(res, 200, {
              user,
              token: `tok_${user.id}_${Date.now()}`
            });
          }

          if (pathname === '/api/auth/me' && req.method === 'GET') {
            return sendJson(res, 200, {
              user: db.getUserById('144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37')
            });
          }

          if (pathname === '/api/auth/logout' && req.method === 'POST') {
            return sendJson(res, 200, { success: true });
          }

          // 2. Products routes
          if (pathname === '/api/products' && req.method === 'GET') {
            const products = db.getProducts(isAdmin);
            return sendJson(res, 200, products);
          }

          if (pathname.startsWith('/api/products/') && req.method === 'GET') {
            const id = pathname.replace('/api/products/', '');
            const product = db.getProductById(id, isAdmin);
            if (!product) {
              return sendJson(res, 404, { error: 'Product not found' });
            }
            return sendJson(res, 200, product);
          }

          if (pathname === '/api/products' && req.method === 'POST') {
            const productData = await parseBody(req);
            const saved = db.saveProduct(productData);
            return sendJson(res, 201, saved);
          }

          if (pathname.startsWith('/api/products/') && (req.method === 'PUT' || req.method === 'PATCH')) {
            const id = pathname.replace('/api/products/', '');
            const productData = await parseBody(req);
            const saved = db.saveProduct({ ...productData, id });
            return sendJson(res, 200, saved);
          }

          if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
            const id = pathname.replace('/api/products/', '');
            const success = db.deleteProduct(id);
            return sendJson(res, 200, { success });
          }

          // 3. Orders routes
          if (pathname === '/api/orders' && req.method === 'GET') {
            const orders = db.getOrders();
            return sendJson(res, 200, orders);
          }

          if (pathname === '/api/orders' && req.method === 'POST') {
            const orderData = await parseBody(req);
            const newOrder = db.createOrder(orderData);
            return sendJson(res, 201, newOrder);
          }

          if (pathname.startsWith('/api/orders/') && (req.method === 'PATCH' || req.method === 'PUT')) {
            const id = pathname.replace('/api/orders/', '');
            const updates = await parseBody(req);
            const updated = db.updateOrder(id, updates);
            if (!updated) {
              return sendJson(res, 404, { error: 'Order not found' });
            }
            return sendJson(res, 200, updated);
          }

          // 4. Settings routes
          if (pathname === '/api/settings' && req.method === 'GET') {
            const settings = db.getSettings();
            return sendJson(res, 200, settings);
          }

          if (pathname === '/api/settings' && (req.method === 'PUT' || req.method === 'POST')) {
            const updates = await parseBody(req);
            const updated = db.updateSettings(updates);
            return sendJson(res, 200, updated);
          }

          return sendJson(res, 404, { error: 'API route not found' });
        } catch (err) {
          console.error('[API Error]:', err);
          return sendJson(res, 500, { error: err.message || 'Internal server error' });
        }
      });
    }
  };
}
