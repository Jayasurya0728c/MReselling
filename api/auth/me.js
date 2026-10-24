import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method === 'GET') {
    return json(res, 200, {
      user: {
        id: '144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37',
        email: 'jayasuryacj.wrk@gmail.com',
        role: 'admin'
      }
    });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
