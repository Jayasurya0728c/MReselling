/**
 * Unified Data Service for Nammude Picks
 * 
 * Works seamlessly with Supabase PostgreSQL and provides an honest, reliable
 * local demo fallback when Supabase credentials have not yet been provided in .env.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { initialProducts, sanitizePublicProduct } from '../data/products';
import storeConfig from '../config/storeConfig';

const LOCAL_PRODUCTS_KEY = 'nammude_picks_products_v1';
const LOCAL_ORDERS_KEY = 'nammude_picks_orders_v1';
const LOCAL_SETTINGS_KEY = 'nammude_picks_settings_v1';

// Seed demo orders for local preview mode
const initialDemoOrders = [
  {
    id: 'ord-101',
    reference: 'NP-202610-1842',
    customerName: 'Anjali Menon',
    customerPhone: '9847123456',
    houseName: 'Menon Villa, Flat 4B',
    streetLocality: 'Panampilly Nagar',
    postOffice: 'Panampilly Nagar SO',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682036',
    deliveryInstructions: 'Please call before delivery. Ring bell twice.',
    items: [
      {
        productId: 'prod-001',
        name: 'Kerala Traditional Palakka Motif Gold-Tone Choker Necklace',
        variant: 'Emerald Green',
        quantity: 1,
        unitPrice: 349,
        totalPrice: 349
      },
      {
        productId: 'prod-005',
        name: '2-in-1 Multipurpose Vegetable & Dry Fruit Slicer Cutter',
        variant: 'Forest Green',
        quantity: 1,
        unitPrice: 249,
        totalPrice: 249
      }
    ],
    subtotal: 598,
    shippingFee: 49,
    totalAmount: 647,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'New Request',
    supplierOrderRef: '',
    trackingNumber: '',
    adminNotes: 'Customer requested quick delivery before Friday family function.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ord-102',
    reference: 'NP-202610-1729',
    customerName: 'Rahul Varma',
    customerPhone: '9446987654',
    houseName: 'Sreevalsam House',
    streetLocality: 'Kowdiar Main Road',
    postOffice: 'Kowdiar SO',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695003',
    deliveryInstructions: 'Leave with security guard if not answering.',
    items: [
      {
        productId: 'prod-003',
        name: 'Wireless Clip-On Lapel Mic for Reels & Content Creators',
        variant: 'Type-C (Android)',
        quantity: 1,
        unitPrice: 499,
        totalPrice: 499
      }
    ],
    subtotal: 499,
    shippingFee: 49,
    totalAmount: 548,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Supplier Order Placed',
    supplierOrderRef: 'MSH-891048201',
    trackingNumber: 'SHDW1092837482',
    adminNotes: 'Verified on Meesho at ₹260. Supplier dispatched via Shadowfax.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'ord-103',
    reference: 'NP-202610-1510',
    customerName: 'Fathima Zehra',
    customerPhone: '9745112233',
    houseName: 'Baitul Noor',
    streetLocality: 'Mananchira Square',
    postOffice: 'Calicut City',
    district: 'Kozhikode',
    state: 'Kerala',
    pincode: '673001',
    deliveryInstructions: '',
    items: [
      {
        productId: 'prod-007',
        name: 'Self-Stirring Electric Stainless Steel Coffee & Chai Mug',
        variant: 'Coffee Brown',
        quantity: 2,
        unitPrice: 449,
        totalPrice: 898
      }
    ],
    subtotal: 898,
    shippingFee: 49,
    totalAmount: 947,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Delivered',
    supplierOrderRef: 'MSH-772910394',
    trackingNumber: 'DELV8817293847',
    adminNotes: 'Delivered successfully. Customer confirmed via WhatsApp.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// Helper to get local data
function getLocalProducts() {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local products:', err);
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

function setLocalProducts(products) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving local products:', err);
  }
}

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local orders:', err);
  }
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(initialDemoOrders));
  return initialDemoOrders;
}

function setLocalOrders(orders) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving local orders:', err);
  }
}

// ================= PRODUCT FUNCTIONS =================

/**
 * Fetch products for public storefront or admin.
 * @param {boolean} isAdmin - If false, private supplier cost/url are strictly stripped.
 */
export async function fetchProducts({ isAdmin = false } = {}) {
  // 1. Try native backend API
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const headers = {};
    if (isAdmin && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/products', { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    // continue to Supabase
  }

  if (isSupabaseConfigured && supabase) {
    try {
      if (isAdmin) {
        // For admin: fetch products with private supplier info
        const { data: productsData, error: prodErr } = await supabase
          .from('products')
          .select(`
            *,
            product_supplier_info (
              supplier_cost,
              supplier_url,
              supplier_sku,
              supplier_notes
            )
          `)
          .order('created_at', { ascending: false });

        if (prodErr) throw prodErr;

        return (productsData || []).map(p => ({
          ...p,
          supplierCost: p.product_supplier_info?.[0]?.supplier_cost ?? p.supplierCost ?? null,
          supplierUrl: p.product_supplier_info?.[0]?.supplier_url ?? p.supplierUrl ?? '',
          supplierSku: p.product_supplier_info?.[0]?.supplier_sku ?? p.supplierSku ?? ''
        }));
      } else {
        // Public storefront: fetch ONLY published products, NO private supplier fields!
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, category, short_description, description, price, compare_at_price, image, images, variants, in_stock, stock_quantity, is_featured, is_trending, is_published, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(p => ({
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
          isPublished: p.is_published
        }));
      }
    } catch (err) {
      console.warn('Supabase product fetch failed, falling back to local storage:', err.message);
    }
  }

  // Fallback to local products
  const products = getLocalProducts();
  if (isAdmin) {
    return products;
  }
  return products.filter(p => p.isPublished !== false).map(sanitizePublicProduct);
}

/**
 * Fetch a single product by slug or ID
 */
export async function fetchProductBySlug(slug, { isAdmin = false } = {}) {
  const all = await fetchProducts({ isAdmin });
  return all.find(p => p.slug === slug || p.id === slug) || null;
}

/**
 * Create or update product (Admin only)
 */
export async function saveProduct(productData) {
  const { supplierCost, supplierUrl, supplierSku, ...publicFields } = productData;
  const isEditing = Boolean(productData.id && productData.id.trim());

  // 1. Try local API first
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const url = isEditing ? `/api/products/${productData.id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const saved = await res.json();
      return { success: true, id: saved.id };
    }
  } catch (e) {
    // continue
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const dbProductPayload = {
        name: publicFields.name,
        slug: publicFields.slug || publicFields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: publicFields.category,
        short_description: publicFields.shortDescription,
        description: publicFields.description,
        price: Number(publicFields.price),
        compare_at_price: publicFields.compareAtPrice ? Number(publicFields.compareAtPrice) : null,
        image: publicFields.image,
        images: publicFields.images || [publicFields.image],
        variants: publicFields.variants || [],
        in_stock: Boolean(publicFields.inStock),
        stock_quantity: Number(publicFields.stockQuantity || 0),
        is_featured: Boolean(publicFields.isFeatured),
        is_trending: Boolean(publicFields.isTrending),
        is_published: publicFields.isPublished !== false,
        updated_at: new Date().toISOString()
      };

      let productId = productData.id;

      if (isEditing) {
        const { error: updErr } = await supabase
          .from('products')
          .update(dbProductPayload)
          .eq('id', productId);
        if (updErr) throw updErr;
      } else {
        const { data: newProd, error: insErr } = await supabase
          .from('products')
          .insert([dbProductPayload])
          .select()
          .single();
        if (insErr) throw insErr;
        productId = newProd.id;
      }

      // Upsert private supplier info in separate protected table
      if (productId) {
        const { error: supErr } = await supabase
          .from('product_supplier_info')
          .upsert({
            product_id: productId,
            supplier_cost: supplierCost ? Number(supplierCost) : null,
            supplier_url: supplierUrl || '',
            supplier_sku: supplierSku || '',
            updated_at: new Date().toISOString()
          }, { onConflict: 'product_id' });

        if (supErr) console.warn('Could not save supplier info to protected table:', supErr.message);
      }

      return { success: true, id: productId };
    } catch (err) {
      console.error('Error saving to Supabase, updating local fallback:', err);
    }
  }

  // Local fallback
  const list = getLocalProducts();
  const id = isEditing ? productData.id : `prod-${Date.now().toString(36)}`;
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const formatted = {
    ...productData,
    id,
    slug,
    price: Number(productData.price),
    compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
    stockQuantity: Number(productData.stockQuantity || 0),
    supplierCost: supplierCost ? Number(supplierCost) : null
  };

  const index = list.findIndex(p => p.id === id);
  if (index >= 0) {
    list[index] = formatted;
  } else {
    list.unshift(formatted);
  }

  setLocalProducts(list);
  return { success: true, id };
}

/**
 * Delete product (Admin only)
 */
export async function deleteProduct(productId) {
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Error deleting in Supabase, using local fallback:', err.message);
    }
  }

  const list = getLocalProducts().filter(p => p.id !== productId);
  setLocalProducts(list);
  return { success: true };
}

// ================= ORDER FUNCTIONS =================

/**
 * Create a new COD order request
 */
export async function createOrder(orderPayload) {
  const reference = `NP-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Try local API first
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...orderPayload, reference })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, reference: data.reference, id: data.id };
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert into orders table
      const { data: orderData, error: ordErr } = await supabase
        .from('orders')
        .insert([{
          reference,
          customer_name: orderPayload.customerName,
          customer_phone: orderPayload.customerPhone,
          house_name: orderPayload.houseName,
          street_locality: orderPayload.streetLocality,
          post_office: orderPayload.postOffice,
          district: orderPayload.district,
          state: orderPayload.state || 'Kerala',
          pincode: orderPayload.pincode,
          delivery_instructions: orderPayload.deliveryInstructions || '',
          subtotal: Number(orderPayload.subtotal),
          shipping_fee: Number(orderPayload.shippingFee),
          total_amount: Number(orderPayload.totalAmount),
          payment_method: 'Cash on Delivery (COD)',
          status: 'New Request',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (ordErr) throw ordErr;

      // 2. Insert items
      if (orderData && orderPayload.items && orderPayload.items.length > 0) {
        const itemsPayload = orderPayload.items.map(item => ({
          order_id: orderData.id,
          product_id: item.productId,
          product_name: item.name,
          variant: item.variant || '',
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          total_price: Number(item.totalPrice)
        }));

        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(itemsPayload);

        if (itemsErr) console.warn('Order items insert warning:', itemsErr.message);
      }

      return {
        success: true,
        reference,
        id: orderData.id
      };
    } catch (err) {
      console.warn('Supabase order creation failed, saving to local orders queue:', err.message);
    }
  }

  // Local fallback
  const localOrders = getLocalOrders();
  const newOrder = {
    ...orderPayload,
    id: `ord-${Date.now().toString(36)}`,
    reference,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'New Request',
    supplierOrderRef: '',
    trackingNumber: '',
    adminNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localOrders.unshift(newOrder);
  setLocalOrders(localOrders);

  return {
    success: true,
    reference,
    id: newOrder.id
  };
}

/**
 * Fetch all orders (Admin only)
 */
export async function fetchOrders() {
  // 1. Try local API first
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const res = await fetch('/api/orders', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            variant,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(o => ({
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
    } catch (err) {
      console.warn('Supabase fetch orders failed, falling back to local orders:', err.message);
    }
  }

  return getLocalOrders();
}

/**
 * Update order status, supplier reference, tracking or internal admin notes (Admin only)
 */
export async function updateOrder(orderId, updates) {
  // 1. Try local API first
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        updated_at: new Date().toISOString()
      };
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.supplierOrderRef !== undefined) payload.supplier_order_ref = updates.supplierOrderRef;
      if (updates.trackingNumber !== undefined) payload.tracking_number = updates.trackingNumber;
      if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;

      const { error } = await supabase
        .from('orders')
        .update(payload)
        .eq('id', orderId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase order update failed, updating local copy:', err.message);
    }
  }

  // Local fallback
  const list = getLocalOrders();
  const idx = list.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setLocalOrders(list);
    return { success: true };
  }
  return { success: false, error: 'Order not found' };
}

// ================= STORE SETTINGS FUNCTIONS =================

export async function fetchStoreSettings() {
  // 1. Try local API first
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.storeName) {
        return {
          ...storeConfig,
          ...data
        };
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return {
          storeName: data.store_name || storeConfig.storeName,
          tagline: data.tagline || storeConfig.tagline,
          whatsappNumber: data.whatsapp_number || storeConfig.whatsappNumber,
          instagramUrl: data.instagram_url || storeConfig.instagramUrl,
          contactEmail: data.contact_email || storeConfig.contactEmail,
          announcementText: data.announcement_text || storeConfig.announcementText,
          deliveryFee: data.delivery_fee !== null ? data.delivery_fee : storeConfig.deliveryFee,
          freeShippingThreshold: data.free_shipping_threshold ?? storeConfig.freeShippingThreshold
        };
      }
    } catch (err) {
      console.warn('Could not fetch store settings from Supabase:', err.message);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (raw) return { ...storeConfig, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading local settings:', err);
  }

  return storeConfig;
}

export async function saveStoreSettings(settings) {
  // 1. Try local API first
  try {
    const token = localStorage.getItem('nammude_admin_token');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert({
          id: 'default_store_settings',
          store_name: settings.storeName,
          tagline: settings.tagline,
          whatsapp_number: settings.whatsappNumber,
          instagram_url: settings.instagramUrl,
          contact_email: settings.contactEmail,
          announcement_text: settings.announcementText,
          delivery_fee: Number(settings.deliveryFee),
          free_shipping_threshold: settings.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase settings update failed:', err.message);
    }
  }

  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ================= IMAGE UPLOAD =================

/**
 * Upload an image file to Supabase storage bucket 'product-images'
 * Falls back to FileReader data URL in local mode.
 */
export async function uploadImage(file) {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return { success: true, url: data.publicUrl };
    } catch (err) {
      console.error('Supabase image upload failed:', err);
      // Fall through to local fallback
    }
  }

  // Local fallback: convert to base64 Data URL so user can preview and test immediately
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ success: true, url: reader.result, isLocal: true });
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
