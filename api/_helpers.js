// Shared CORS and response helpers for all API routes

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function json(res, statusCode, data) {
  cors(res);
  res.status(statusCode).json(data);
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res);
    res.status(200).end();
    return true;
  }
  return false;
}
