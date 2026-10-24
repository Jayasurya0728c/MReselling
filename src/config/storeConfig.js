/**
 * Central Store Configuration for Nammude Picks
 * Pan-India E-Commerce Storefront
 */

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const storeConfig = {
  // Brand details
  storeName: 'Nammude Picks',
  tagline: 'Curated Finds. Best Prices.',
  description: 'Curated, stylish and affordable finds delivered right to your doorstep across India. 100% Cash on Delivery available pan-India.',
  
  // Contact & Social
  whatsappNumber: '91YOURWHATSAPPNUMBER',
  whatsappDisplay: '+91 (Your Support Number)',
  instagramUrl: 'https://instagram.com/nammudepicks',
  instagramHandle: '@nammudepicks',
  contactEmail: 'support@nammudepicks.in',
  
  // Regional settings (All India)
  defaultState: '',
  allStates: INDIAN_STATES,
  
  // Shipping & Pricing
  currencySymbol: '₹',
  deliveryFee: 49, // Flat shipping charge in INR
  freeShippingThreshold: 999, // Orders above this get free delivery
  codAvailable: true,
  
  // Announcement bar
  announcementText: '✨ Special Offer: Free Delivery on orders above ₹999 | Cash on Delivery (COD) Available Pan-India!',
  showAnnouncement: true,

  // Store verification & Disclaimers
  independentResellerDisclaimer: 'Nammude Picks is an independent curated online storefront. We handpick quality products, manually verify orders, and fulfill them via reputable Indian suppliers and manufacturers. We are not officially affiliated with or endorsed by Meesho.',
  
  // Estimated delivery
  deliveryEstimateDays: '3 to 7 business days across India'
};

export default storeConfig;
