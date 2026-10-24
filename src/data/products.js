/**
 * Product Catalogue for Nammude Picks
 * 
 * 12 Curated demo products across Fashion, Home & Kitchen, Lifestyle, and Gadgets.
 * Notice: 'supplierCost' and 'supplierUrl' are private fields for admin use only.
 * In a live database, these are stored in a separate table protected by Row Level Security (RLS).
 */

export const initialProducts = [
  {
    id: 'prod-001',
    name: 'Kerala Traditional Palakka Motif Gold-Tone Choker Necklace',
    slug: 'kerala-palakka-motif-choker-necklace',
    category: 'Fashion Accessories',
    shortDescription: 'Classic green & ruby red stone studded brass choker for festive and wedding occasions.',
    description: 'Celebrate Kerala heritage with this stunning handcrafted Palakka motif choker necklace. Features high-grade emerald green and ruby red stones set on a radiant micro-plated gold-tone alloy base. Comes with an adjustable dori (thread) for custom fit. Perfect for Onam celebrations, temple visits, and family weddings.',
    price: 349,
    compareAtPrice: 599,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475152-4735d38d0145?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Emerald Green', 'Ruby Red', 'Dual Tone'] }
    ],
    inStock: true,
    stockQuantity: 28,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    // Private supplier information (Admin only - stripped before sending to public)
    supplierCost: 165,
    supplierUrl: 'https://www.meesho.com/s/p/palakka-necklace-example',
    supplierSku: 'MSH-PALAKKA-01'
  },
  {
    id: 'prod-002',
    name: 'USB Rechargeable Automatic Water Can Dispenser Pump',
    slug: 'usb-rechargeable-water-can-dispenser-pump',
    category: 'Home & Kitchen',
    shortDescription: 'One-touch wireless water pumping for 20-litre bubble top cans. Fits all standard cans.',
    description: 'Tired of heavy water bottle lifting or manual hand pumps? This smart portable automatic water pump fits standard 20L water cans effortlessly. Powered by a 1200mAh lithium battery that dispenses up to 5-6 full cans on a single charge. Features food-grade silicone hose and 304 stainless steel spout. Quiet motor and sleek minimal design.',
    price: 389,
    compareAtPrice: 699,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Pearl White'] }
    ],
    inStock: true,
    stockQuantity: 42,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    supplierCost: 190,
    supplierUrl: 'https://www.meesho.com/s/p/water-pump-dispenser-example',
    supplierSku: 'MSH-WP-20L'
  },
  {
    id: 'prod-003',
    name: 'Wireless Clip-On Lapel Mic for Reels & Content Creators',
    slug: 'wireless-clip-on-lapel-mic-for-reels',
    category: 'Everyday Gadgets',
    shortDescription: 'Plug-and-play wireless microphone with noise cancellation. Type-C & iPhone compatible.',
    description: 'Elevate your Instagram Reels, YouTube videos, and Malayalam vlogs with crystal clear audio. This ultra-compact clip-on collar microphone pairs instantly without Bluetooth pairing or apps. Offers up to 20m transmission range with intelligent noise-reduction chip and 6-hour continuous battery life.',
    price: 499,
    compareAtPrice: 999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Connector Type', options: ['Type-C (Android)', 'Lightning (iPhone)', 'Dual Receiver (Both)'] }
    ],
    inStock: true,
    stockQuantity: 18,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    supplierCost: 260,
    supplierUrl: 'https://www.meesho.com/s/p/wireless-mic-k8-example',
    supplierSku: 'MSH-MIC-K8'
  },
  {
    id: 'prod-004',
    name: 'Eco-Friendly Handcrafted Jute Tote Bag with Zip Closure',
    slug: 'eco-friendly-handcrafted-jute-tote-bag',
    category: 'Lifestyle Products',
    shortDescription: 'Durable, laminated golden jute shopper bag with reinforced cotton web handles.',
    description: 'Ditch single-use plastic in style. This spacious golden jute shopper tote is handcrafted from premium eco-friendly natural jute fibers with water-resistant inner lamination. Features sturdy padded cotton handles, smooth top zipper closure, and an interior quick-access slip pocket. Spacious enough for grocery runs, college books, or beach days in Kochi.',
    price: 299,
    compareAtPrice: 499,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Design Print', options: ['Minimalist Botanical Leaf', 'Classic Plain Golden', 'Mandala Art'] }
    ],
    inStock: true,
    stockQuantity: 35,
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    supplierCost: 130,
    supplierUrl: 'https://www.meesho.com/s/p/jute-tote-bag-example',
    supplierSku: 'MSH-JUTE-BAG-02'
  },
  {
    id: 'prod-005',
    name: '2-in-1 Multipurpose Vegetable & Dry Fruit Slicer Cutter',
    slug: '2-in-1-multipurpose-vegetable-dry-fruit-slicer',
    category: 'Home & Kitchen',
    shortDescription: 'Razor-sharp stainless steel rotating blade for ultra-thin onion, banana & almond slices.',
    description: 'Speed up your crispy banana chips preparation, onion slicing, and dry fruit grating. Made from heavy-duty BPA-free food-safe ABS plastic with an adjustable stainless steel wavy blade. Ergonomic push handle protects fingers while delivering paper-thin, uniform cuts every single time.',
    price: 249,
    compareAtPrice: 450,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Forest Green', 'Sky Blue'] }
    ],
    inStock: true,
    stockQuantity: 50,
    isFeatured: true,
    isTrending: false,
    isPublished: true,
    supplierCost: 110,
    supplierUrl: 'https://www.meesho.com/s/p/dry-fruit-slicer-example',
    supplierSku: 'MSH-SLICER-2IN1'
  },
  {
    id: 'prod-006',
    name: 'Portable USB Electric Lint Remover & Fabric Shaver',
    slug: 'portable-usb-electric-lint-remover',
    category: 'Everyday Gadgets',
    shortDescription: 'Restores sweaters, blankets, curtains, and t-shirts like brand new in seconds.',
    description: 'Keep your shirts, cotton kurtas, bedsheets, and sweaters looking brand new. Equipped with high-speed 6-leaf stainless steel blades protected by a honeycomb mesh safety guard that removes pilling without catching fabric threads. Features a USB rechargeable battery and transparent detachable lint collector.',
    price: 369,
    compareAtPrice: 649,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Sage Green', 'White & Gold'] }
    ],
    inStock: true,
    stockQuantity: 24,
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    supplierCost: 175,
    supplierUrl: 'https://www.meesho.com/s/p/lint-remover-usb-example',
    supplierSku: 'MSH-LINT-01'
  },
  {
    id: 'prod-007',
    name: 'Self-Stirring Electric Stainless Steel Coffee & Chai Mug',
    slug: 'self-stirring-electric-coffee-mug',
    category: 'Home & Kitchen',
    shortDescription: 'Magnetic one-touch automatic mixing mug for milkshakes, coffee, and green tea.',
    description: 'No spoon needed. Press the handle button and watch this double-walled thermal mug create a powerful silent vortex with its detachable magnetic rotor pill. Keeps beverages hot or cold for up to 3 hours with airtight leakproof sipping lid.',
    price: 449,
    compareAtPrice: 799,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Coffee Brown', 'Stainless Silver', 'Pastel Pink'] }
    ],
    inStock: true,
    stockQuantity: 15,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    supplierCost: 220,
    supplierUrl: 'https://www.meesho.com/s/p/self-stir-mug-example',
    supplierSku: 'MSH-MUG-SS01'
  },
  {
    id: 'prod-008',
    name: 'Sunset Projection LED Atmosphere Lamp for Bedroom & Aesthetics',
    slug: 'sunset-projection-led-atmosphere-lamp',
    category: 'Lifestyle Products',
    shortDescription: '180° rotatable romantic golden hour halo light for aesthetic photography and room decor.',
    description: 'Bring the golden hour sunset of Kovalam beach right into your living room or bedroom. Features high-transmittance crystal lens and thick aluminum base for excellent heat dissipation. Create warm, dreamy vibes for Instagram content, Reels, or relaxing evening ambient lighting.',
    price: 329,
    compareAtPrice: 599,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Light Effect', options: ['Golden Sunset', 'Sunset Red', 'Rainbow Halo'] }
    ],
    inStock: true,
    stockQuantity: 30,
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    supplierCost: 145,
    supplierUrl: 'https://www.meesho.com/s/p/sunset-lamp-example',
    supplierSku: 'MSH-SUNSET-01'
  },
  {
    id: 'prod-009',
    name: '360° Magnetic Car Dashboard & AC Vent Phone Mount',
    slug: '360-magnetic-car-phone-mount',
    category: 'Everyday Gadgets',
    shortDescription: 'Ultra-strong 6x N52 neodymium magnets with flexible alloy arm. Zero wobble.',
    description: 'Drive safely through city traffic and highway trips without phone drops. Built with aerospace-grade alloy casing and 6 powerful N52 neodymium magnets that securely hold all smartphone sizes even on rough roads and speed breakers. Includes both 3M dashboard base and AC vent clip.',
    price: 279,
    compareAtPrice: 499,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Space Grey', 'Matte Black'] }
    ],
    inStock: true,
    stockQuantity: 38,
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    supplierCost: 115,
    supplierUrl: 'https://www.meesho.com/s/p/magnetic-car-mount-example',
    supplierSku: 'MSH-CAR-MOUNT-01'
  },
  {
    id: 'prod-010',
    name: 'Handcrafted Wooden Polarized Sunglasses (UV400 Protection)',
    slug: 'handcrafted-wooden-polarized-sunglasses',
    category: 'Fashion Accessories',
    shortDescription: 'Lightweight natural bamboo temple sunglasses with glare-free HD TAC polarized lenses.',
    description: 'Stay effortlessly stylish under the bright sun. These vintage-inspired square sunglasses feature genuine natural bamboo wood temples and lightweight polycarbonate frames. High-definition Category 3 polarized lenses provide 100% UV400 protection against harsh reflections on water and road.',
    price: 499,
    compareAtPrice: 899,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Frame Color', options: ['Matte Black Frame', 'Tortoise Brown Frame'] }
    ],
    inStock: true,
    stockQuantity: 19,
    isFeatured: true,
    isTrending: false,
    isPublished: true,
    supplierCost: 240,
    supplierUrl: 'https://www.meesho.com/s/p/wooden-sunglasses-example',
    supplierSku: 'MSH-GLASSES-WOOD'
  },
  {
    id: 'prod-011',
    name: '3-in-1 Foldable Handheld Mini Fan with Power Bank & Flashlight',
    slug: '3-in-1-foldable-handheld-mini-fan',
    category: 'Everyday Gadgets',
    shortDescription: 'Pocket-sized quiet rechargeable fan with soft TPE blades and 2000mAh emergency backup.',
    description: 'Beat the hot and humid summer weather anywhere you go. This clever pocket fan folds into a 180° desktop fan or handheld cooling wand. Soft silicone blades stop safely on touch. Includes a bright LED backup flashlight and can even charge your phone in emergencies.',
    price: 399,
    compareAtPrice: 699,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Mint Green', 'Powder Pink', 'Snow White'] }
    ],
    inStock: true,
    stockQuantity: 22,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    supplierCost: 195,
    supplierUrl: 'https://www.meesho.com/s/p/mini-bear-fan-example',
    supplierSku: 'MSH-FAN-3IN1'
  },
  {
    id: 'prod-012',
    name: 'Stainless Steel Double-Wall Thermal Travel Tumbler (500ml)',
    slug: 'stainless-steel-double-wall-thermal-tumbler',
    category: 'Lifestyle Products',
    shortDescription: 'Keeps water chilled for 24h or coffee hot for 12h. Leakproof flip straw lid.',
    description: 'The ultimate daily companion for office, college, or workout. Crafted from 18/8 food-grade kitchen stainless steel that leaves no metallic aftertaste. Sweat-free powder-coated exterior with a comfortable silicone carry handle.',
    price: 549,
    compareAtPrice: 899,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Olive Green', 'Matte Charcoal', 'Cream Beige'] }
    ],
    inStock: true,
    stockQuantity: 20,
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    supplierCost: 285,
    supplierUrl: 'https://www.meesho.com/s/p/tumbler-500ml-example',
    supplierSku: 'MSH-TUMBLER-500'
  }
];

export const categories = [
  'All',
  'Fashion Accessories',
  'Home & Kitchen',
  'Everyday Gadgets',
  'Lifestyle Products'
];

/**
 * Strips confidential supplier data from products before returning to public storefront
 */
export function sanitizePublicProduct(product) {
  if (!product) return null;
  // eslint-disable-next-line no-unused-vars
  const { supplierCost, supplierUrl, supplierSku, ...publicData } = product;
  return publicData;
}
