import { getSupabase } from '../_supabase.js';
import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const sb = getSupabase();
  if (!sb) {
    return json(res, 503, { error: 'Database not configured.' });
  }

  const { id } = req.query;

  try {
    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = req.body;
      const payload = { updated_at: new Date().toISOString() };

      if (body.status !== undefined) payload.status = body.status;
      if (body.supplierOrderRef !== undefined) payload.supplier_order_ref = body.supplierOrderRef;
      if (body.trackingNumber !== undefined) payload.tracking_number = body.trackingNumber;
      if (body.adminNotes !== undefined) payload.admin_notes = body.adminNotes;

      const { error } = await sb.from('orders').update(payload).eq('id', id);
      if (error) throw error;

      return json(res, 200, { success: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error(`[API /api/orders/${id}]`, err);
    return json(res, 500, { error: err.message });
  }
}
