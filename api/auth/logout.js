import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method === 'POST') {
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
