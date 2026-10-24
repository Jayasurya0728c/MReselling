/**
 * Nammude Picks — Database Setup Script
 * 
 * Run this ONCE after creating a new Supabase project to set up tables,
 * seed products, and configure the store.
 * 
 * Usage:
 *   node scripts/setup-supabase.js <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY>
 * 
 * Or set environment variables:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/setup-supabase.js
 */

import { createClient } from '@supabase/supabase-js';

const url = process.argv[2] || process.env.SUPABASE_URL;
const key = process.argv[3] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Usage: node scripts/setup-supabase.js <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY>');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// ==================== SEED DATA ====================

const products = [
  {
    name: 'Kerala Traditional Palakka Motif Gold-Tone Choker Necklace',
    slug: 'palakka-motif-gold-tone-choker',
    category: 'Fashion Accessories',
    short_description: 'Traditional Palakka leaf motif design in premium gold-tone finish',
    description: 'Exquisitely crafted Kerala-style Palakka choker necklace featuring the iconic leaf (palakka) motif. Made with premium gold-tone alloy and embedded with emerald-green stones. Perfect for Onam, Vishu, weddings, and festive occasions.',
    price: 349,
    compare_at_price: 799,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Emerald Green', 'Ruby Red', 'Classic Gold'] }],
    in_stock: true,
    stock_quantity: 25,
    is_featured: true,
    is_trending: true,
    is_published: true
  },
  {
    name: 'Premium Jute & Cotton Tote Bag with Kerala Mural Art Print',
    slug: 'kerala-mural-jute-tote-bag',
    category: 'Fashion Accessories',
    short_description: 'Eco-friendly jute-cotton blend tote with traditional Kerala mural artwork',
    description: 'Sustainable and stylish jute-cotton blended tote bag featuring hand-screen-printed Kerala mural art. Spacious main compartment with inner pocket. Perfect for daily shopping, beach visits, or as an eco-conscious fashion statement.',
    price: 299,
    compare_at_price: 599,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Print', options: ['Kathakali', 'Mohiniattam', 'Kerala Landscape'] }],
    in_stock: true,
    stock_quantity: 40,
    is_featured: true,
    is_trending: false,
    is_published: true
  },
  {
    name: 'Wireless Clip-On Lapel Mic for Reels & Content Creators',
    slug: 'wireless-clip-on-lapel-mic',
    category: 'Everyday Gadgets',
    short_description: 'Crystal-clear audio for Instagram Reels, YouTube Shorts & video calls',
    description: 'Professional-grade wireless clip-on lapel microphone with noise cancellation. 20m range, 6-hour battery, plug-and-play for both iPhone and Android. Perfect for content creators making Instagram Reels, YouTube Shorts, and podcasts.',
    price: 499,
    compare_at_price: 999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Connector', options: ['Type-C (Android)', 'Lightning (iPhone)', 'Universal 3.5mm'] }],
    in_stock: true,
    stock_quantity: 30,
    is_featured: true,
    is_trending: true,
    is_published: true
  },
  {
    name: 'Automatic Water Dispenser Pump for 20L Can Bottles',
    slug: 'automatic-water-dispenser-pump',
    category: 'Home & Kitchen',
    short_description: 'USB rechargeable electric water pump that fits all standard 20L cans',
    description: 'Convenient USB-rechargeable automatic water pump that fits all standard 20-litre water cans. One-touch dispensing, food-grade silicone tube, and LED indicator. Long-lasting battery lasts up to 4 weeks on a single charge.',
    price: 249,
    compare_at_price: 499,
    image: 'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['White', 'Black'] }],
    in_stock: true,
    stock_quantity: 50,
    is_featured: false,
    is_trending: true,
    is_published: true
  },
  {
    name: '2-in-1 Multipurpose Vegetable & Dry Fruit Slicer Cutter',
    slug: 'multipurpose-vegetable-slicer',
    category: 'Home & Kitchen',
    short_description: 'Compact handheld slicer for veggies, fruits, cheese and dry fruits',
    description: 'Versatile 2-in-1 handheld slicer with stainless steel blades. Slices vegetables, fruits, cheese, and dry fruits with adjustable thickness. Compact design perfect for small kitchens. Dishwasher safe.',
    price: 249,
    compare_at_price: 499,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Forest Green', 'Classic White'] }],
    in_stock: true,
    stock_quantity: 35,
    is_featured: false,
    is_trending: false,
    is_published: true
  },
  {
    name: 'Portable Handheld USB Mini Fan with Phone Stand',
    slug: 'usb-mini-fan-phone-stand',
    category: 'Everyday Gadgets',
    short_description: '3-speed rechargeable mini fan with built-in phone holder stand',
    description: 'Beat the heat with this portable 3-speed USB rechargeable mini fan with a built-in phone holder stand. 4-hour battery life, foldable design. Perfect desk companion for work, travel, and outdoor events.',
    price: 199,
    compare_at_price: 399,
    image: 'https://images.unsplash.com/photo-1614947488637-f53261cbedf6?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1614947488637-f53261cbedf6?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Pastel Pink', 'Sky Blue', 'Mint Green', 'White'] }],
    in_stock: true,
    stock_quantity: 60,
    is_featured: false,
    is_trending: true,
    is_published: true
  },
  {
    name: 'Self-Stirring Electric Stainless Steel Coffee & Chai Mug',
    slug: 'self-stirring-electric-mug',
    category: 'Home & Kitchen',
    short_description: 'One-button automatic stirring mug for coffee, chai, and protein shakes',
    description: 'Revolutionary self-stirring mug with stainless steel interior. One-button automatic stirring for coffee, tea, chai, and protein shakes. 400ml capacity, powered by 2xAAA batteries (included). Makes the perfect lazy chai lover gift.',
    price: 449,
    compare_at_price: 899,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Coffee Brown', 'Matte Black', 'Silver'] }],
    in_stock: true,
    stock_quantity: 20,
    is_featured: true,
    is_trending: false,
    is_published: true
  },
  {
    name: 'Magnetic Car Phone Mount with 360° Rotation',
    slug: 'magnetic-car-phone-mount',
    category: 'Everyday Gadgets',
    short_description: 'Universal magnetic phone mount that fits any car dashboard or AC vent',
    description: 'Strong N52 neodymium magnet car phone mount with 360° rotation. Universal compatibility with all smartphones. Includes both dashboard stick-on and AC vent clip mounts. One-hand operation for safe driving.',
    price: 199,
    compare_at_price: 449,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Mount Type', options: ['Dashboard', 'AC Vent', 'Combo Pack'] }],
    in_stock: true,
    stock_quantity: 45,
    is_featured: false,
    is_trending: true,
    is_published: true
  },
  {
    name: 'Boho Sunset Lamp Projector — Aesthetic Room Decor',
    slug: 'sunset-lamp-projector',
    category: 'Lifestyle Products',
    short_description: 'USB-powered sunset projection lamp for aesthetic photos and cozy vibes',
    description: 'Create stunning golden-hour vibes anytime with this USB-powered sunset lamp projector. 180° adjustable head, soft warm gradient light. Perfect for aesthetic Instagram photos, room decor, meditation corners, and cozy reading nooks.',
    price: 399,
    compare_at_price: 799,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Sunset Orange', 'Rainbow', 'Golden Hour'] }],
    in_stock: true,
    stock_quantity: 15,
    is_featured: true,
    is_trending: true,
    is_published: true
  },
  {
    name: 'UV-Printed Classic Aviator Sunglasses — Unisex',
    slug: 'classic-aviator-sunglasses',
    category: 'Fashion Accessories',
    short_description: 'Polarized UV400 aviators with metal frame — trendy unisex design',
    description: 'Classic aviator sunglasses with polarized UV400 lenses and lightweight metal frame. Unisex design suitable for all face shapes. Includes hard-shell case and microfiber cleaning cloth.',
    price: 299,
    compare_at_price: 699,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Lens', options: ['Classic Black', 'Brown Gradient', 'Mirror Blue'] }],
    in_stock: true,
    stock_quantity: 30,
    is_featured: false,
    is_trending: false,
    is_published: true
  },
  {
    name: 'Insulated Stainless Steel Tumbler with Straw — 500ml',
    slug: 'insulated-tumbler-with-straw',
    category: 'Lifestyle Products',
    short_description: 'Double-wall vacuum insulated tumbler keeps drinks hot 6hrs / cold 12hrs',
    description: 'Premium double-wall vacuum insulated stainless steel tumbler. Keeps beverages hot for 6 hours or cold for 12 hours. Comes with reusable straw, splash-proof lid, and silicone base. 500ml capacity.',
    price: 399,
    compare_at_price: 799,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Color', options: ['Rose Gold', 'Matte Black', 'Ocean Blue', 'Sage Green'] }],
    in_stock: true,
    stock_quantity: 25,
    is_featured: false,
    is_trending: true,
    is_published: true
  },
  {
    name: 'LED Ring Light 10" with Adjustable Tripod Stand',
    slug: 'led-ring-light-tripod',
    category: 'Everyday Gadgets',
    short_description: '10-inch ring light with flexible tripod — 3 color modes & 10 brightness levels',
    description: 'Professional 10-inch LED ring light with adjustable tripod stand (up to 50 inches). 3 color temperature modes (warm/natural/cool) with 10 brightness levels each. Universal phone holder included. Perfect for Instagram Reels, video calls, makeup tutorials, and product photography.',
    price: 499,
    compare_at_price: 1199,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'],
    variants: [{ name: 'Size', options: ['10 inch', '12 inch'] }],
    in_stock: true,
    stock_quantity: 20,
    is_featured: true,
    is_trending: false,
    is_published: true
  }
];

const storeSettings = {
  id: 'default_store_settings',
  store_name: 'Nammude Picks',
  tagline: 'Nalla Finds. Nalla Prices.',
  whatsapp_number: '91YOURWHATSAPPNUMBER',
  instagram_url: 'https://instagram.com/nammudepicks',
  contact_email: 'support@nammudepicks.in',
  announcement_text: '✨ Special Offer: Free Delivery on orders above ₹999 | Cash on Delivery (COD) Available Pan-India!',
  delivery_fee: 49,
  free_shipping_threshold: 999,
  updated_at: new Date().toISOString()
};

// ==================== SETUP ====================

async function setup() {
  console.log('🔌 Connecting to Supabase:', url);

  // Test connection
  const { data: testData, error: testErr } = await supabase.from('products').select('id').limit(1);
  
  if (testErr) {
    console.log('⚠️  Products table may not exist yet. Please run the schema.sql first in Supabase SQL editor.');
    console.log('   File: supabase/schema.sql');
    console.log('   Error:', testErr.message);
    process.exit(1);
  }

  if (testData && testData.length > 0) {
    console.log('ℹ️  Products table already has data. Skipping product seed.');
  } else {
    console.log('📦 Seeding products...');
    const { error: prodErr } = await supabase.from('products').insert(products);
    if (prodErr) {
      console.error('❌ Error seeding products:', prodErr.message);
    } else {
      console.log(`✅ Seeded ${products.length} products`);
    }
  }

  // Seed store settings
  console.log('⚙️  Upserting store settings...');
  const { error: settingsErr } = await supabase
    .from('store_settings')
    .upsert(storeSettings);
  if (settingsErr) {
    console.error('❌ Error upserting settings:', settingsErr.message);
  } else {
    console.log('✅ Store settings saved');
  }

  console.log('\n🎉 Setup complete! Your Supabase project is ready.');
  console.log('\nNext steps:');
  console.log('1. Update .env with your new Supabase credentials');
  console.log('2. Set these in Vercel Dashboard > Settings > Environment Variables:');
  console.log('   - SUPABASE_URL = ' + url);
  console.log('   - SUPABASE_SERVICE_ROLE_KEY = <your service role key>');
  console.log('   - VITE_SUPABASE_URL = ' + url);
  console.log('   - VITE_SUPABASE_ANON_KEY = <your anon key>');
  console.log('3. Redeploy on Vercel (push to main)');
}

setup().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
