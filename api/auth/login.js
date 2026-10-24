import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      if (!email || !password) {
        return json(res, 400, { error: 'Email and password are required' });
      }

      // Admin credential check — hardcoded admin email
      if (email.toLowerCase().trim() === 'jayasuryacj.wrk@gmail.com') {
        const user = {
          id: '144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37',
          email: 'jayasuryacj.wrk@gmail.com',
          role: 'admin'
        };
        const token = `tok_${user.id}_${Date.now()}`;
        return json(res, 200, { user, token });
      }

      return json(res, 401, { error: 'Invalid email or password' });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[API /api/auth/login]', err);
    return json(res, 500, { error: err.message });
  }
}
