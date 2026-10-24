import { getSupabase } from '../_supabase.js';
import { json, handleOptions } from '../_helpers.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const sb = getSupabase();
  if (!sb) {
    return json(res, 503, { error: 'Database not configured.' });
  }

  // Extract product ID from URL: /api/products/[id]
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const isAdmin = Boolean(authHeader && authHeader.startsWith('Bearer '));

      let query;
      if (isAdmin) {
        query = sb.from('products').select(`*, product_supplier_info (supplier_cost, supplier_url, supplier_sku, supplier_notes)`);
      } else {
        query = sb.from('products').select('id, name, slug, category, short_description, description, price, compare_at_price, image, images, variants, in_stock, stock_quantity, is_featured, is_trending, is_published, created_at');
      }

      // Try by ID or slug
      const { data, error } = await query.or(`id.eq.${id},slug.eq.${id}`).limit(1).maybeSingle();
      if (error) throw error;
      if (!data) return json(res, 404, { error: 'Product not found' });

      const p = data;
      const mapped = {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        shortDescription: p.short_description,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compare_at_price,
        image: p.image,
        images: p.images || [p.image],
        variants: p.variants || [],
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        isFeatured: p.is_featured,
        isTrending: p.is_trending,
        isPublished: p.is_published,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      };

      if (isAdmin) {
        mapped.supplierCost = p.product_supplier_info?.[0]?.supplier_cost ?? null;
        mapped.supplierUrl = p.product_supplier_info?.[0]?.supplier_url ?? '';
        mapped.supplierSku = p.product_supplier_info?.[0]?.supplier_sku ?? '';
      }

      return json(res, 200, mapped);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = req.body;
      const { supplierCost, supplierUrl, supplierSku, ...fields } = body;

      const dbPayload = {
        name: fields.name,
        slug: fields.slug || fields.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: fields.category,
        short_description: fields.shortDescription,
        description: fields.description,
        price: Number(fields.price),
        compare_at_price: fields.compareAtPrice ? Number(fields.compareAtPrice) : null,
        image: fields.image,
        images: fields.images || [fields.image],
        variants: fields.variants || [],
        in_stock: fields.inStock !== false,
        stock_quantity: Number(fields.stockQuantity || 0),
        is_featured: Boolean(fields.isFeatured),
        is_trending: Boolean(fields.isTrending),
        is_published: fields.isPublished !== false,
        updated_at: new Date().toISOString()
      };

      const { error } = await sb.from('products').update(dbPayload).eq('id', id);
      if (error) throw error;

      // Upsert supplier info
      if (supplierCost !== undefined || supplierUrl !== undefined || supplierSku !== undefined) {
        await sb.from('product_supplier_info').upsert({
          product_id: id,
          supplier_cost: supplierCost ? Number(supplierCost) : null,
          supplier_url: supplierUrl || '',
          supplier_sku: supplierSku || '',
          updated_at: new Date().toISOString()
        }, { onConflict: 'product_id' });
      }

      return json(res, 200, { success: true, id });
    }

    if (req.method === 'DELETE') {
      const { error } = await sb.from('products').delete().eq('id', id);
      if (error) throw error;
      return json(res, 200, { success: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error(`[API /api/products/${id}]`, err);
    return json(res, 500, { error: err.message });
  }
}
