import { getSupabase } from './_supabase.js';
import { json, handleOptions } from './_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const sb = getSupabase();
  if (!sb) {
    return json(res, 503, { error: 'Database not configured.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return json(res, 200, {
          storeName: data.store_name,
          tagline: data.tagline,
          whatsappNumber: data.whatsapp_number,
          instagramUrl: data.instagram_url,
          contactEmail: data.contact_email,
          announcementText: data.announcement_text,
          deliveryFee: data.delivery_fee,
          freeShippingThreshold: data.free_shipping_threshold
        });
      }

      return json(res, 200, {});
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body;

      const { error } = await sb
        .from('store_settings')
        .upsert({
          id: 'default_store_settings',
          store_name: body.storeName,
          tagline: body.tagline,
          whatsapp_number: body.whatsappNumber,
          instagram_url: body.instagramUrl,
          contact_email: body.contactEmail,
          announcement_text: body.announcementText,
          delivery_fee: body.deliveryFee ? Number(body.deliveryFee) : 49,
          free_shipping_threshold: body.freeShippingThreshold ? Number(body.freeShippingThreshold) : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      return json(res, 200, { success: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[API /api/settings]', err);
    return json(res, 500, { error: err.message });
  }
}
