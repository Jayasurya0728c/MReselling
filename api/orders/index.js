import { getSupabase } from '../_supabase.js';
import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const sb = getSupabase();
  if (!sb) {
    return json(res, 503, { error: 'Database not configured.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('orders')
        .select(`*, order_items (id, product_id, product_name, variant, quantity, unit_price, total_price)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map(o => ({
        id: o.id,
        reference: o.reference,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        houseName: o.house_name,
        streetLocality: o.street_locality,
        postOffice: o.post_office,
        district: o.district,
        state: o.state,
        pincode: o.pincode,
        deliveryInstructions: o.delivery_instructions,
        subtotal: o.subtotal,
        shippingFee: o.shipping_fee,
        totalAmount: o.total_amount,
        paymentMethod: o.payment_method,
        status: o.status,
        supplierOrderRef: o.supplier_order_ref || '',
        trackingNumber: o.tracking_number || '',
        adminNotes: o.admin_notes || '',
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: (o.order_items || []).map(i => ({
          id: i.id,
          productId: i.product_id,
          name: i.product_name,
          variant: i.variant,
          quantity: i.quantity,
          unitPrice: i.unit_price,
          totalPrice: i.total_price
        }))
      }));

      return json(res, 200, mapped);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const reference = body.reference || `NP-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: orderData, error: ordErr } = await sb
        .from('orders')
        .insert([{
          reference,
          customer_name: body.customerName,
          customer_phone: body.customerPhone,
          house_name: body.houseName,
          street_locality: body.streetLocality,
          post_office: body.postOffice,
          district: body.district,
          state: body.state || 'India',
          pincode: body.pincode,
          delivery_instructions: body.deliveryInstructions || '',
          subtotal: Number(body.subtotal),
          shipping_fee: Number(body.shippingFee),
          total_amount: Number(body.totalAmount),
          payment_method: 'Cash on Delivery (COD)',
          status: 'New Request',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (ordErr) throw ordErr;

      // Insert order items
      if (orderData && body.items && body.items.length > 0) {
        const itemsPayload = body.items.map(item => ({
          order_id: orderData.id,
          product_id: item.productId,
          product_name: item.name,
          variant: item.variant || '',
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          total_price: Number(item.totalPrice)
        }));

        await sb.from('order_items').insert(itemsPayload);
      }

      return json(res, 201, { success: true, reference, id: orderData.id });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[API /api/orders]', err);
    return json(res, 500, { error: err.message });
  }
}
