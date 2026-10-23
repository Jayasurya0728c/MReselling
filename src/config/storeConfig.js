/**
 * Central Store Configuration for Nammude Picks
 * 
 * Edit business details here. These values are used as default fallbacks
 * and can also be managed dynamically via the Admin Dashboard when connected to Supabase.
 */

export const storeConfig = {
  // Brand details
  storeName: 'Nammude Picks',
  tagline: 'Nalla Finds. Nalla Prices.',
  description: 'Curated, stylish and affordable finds for everyday life in Kerala. 100% Cash on Delivery available across all 14 districts.',
  
  // Contact & Social (Replace placeholder with your actual 10-digit WhatsApp number with country code, e.g. 919876543210)
  whatsappNumber: '91YOURWHATSAPPNUMBER', // Format: 91 followed by 10 digits without spaces or '+'
  whatsappDisplay: '+91 (Your WhatsApp Number)',
  instagramUrl: 'https://instagram.com/nammudepicks',
  instagramHandle: '@nammudepicks',
  contactEmail: 'support@nammudepicks.in',
  
  // Regional settings (Kerala)
  defaultState: 'Kerala',
  operatingDistricts: [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ],
  
  // Shipping & Pricing
  currencySymbol: '₹',
  deliveryFee: 49, // Flat shipping charge in INR
  freeShippingThreshold: 999, // Orders above this get free delivery (set null to disable)
  codAvailable: true,
  
  // Announcement bar
  announcementText: '✨ Special Kerala Offer: Free Delivery on orders above ₹999 | Cash on Delivery (COD) Available!',
  showAnnouncement: true,

  // Store verification & Disclaimers
  independentResellerDisclaimer: 'Nammude Picks is an independent curated online storefront. We handpick quality products, manually verify orders, and fulfill them via reputable Indian suppliers and manufacturers. We are not officially affiliated with or endorsed by Meesho.',
  
  // Estimated delivery
  deliveryEstimateDays: '3 to 7 business days across Kerala'
};

export default storeConfig;
