import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { initialProducts } from '../src/data/products.js';
import { storeConfig } from '../src/config/storeConfig.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial demo orders
const defaultOrders = [
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
    houseName: 'Sreevalsam House, 4th Cross',
    streetLocality: 'Indiranagar 100ft Road',
    postOffice: 'Indiranagar PO',
    district: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
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
  }
];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

class StoreDatabase {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('[DB] Failed to read store.json, reinitializing:', err);
    }

    // Default initial seed data
    const initialData = {
      users: [
        {
          id: '144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37',
          email: 'jayasuryacj.wrk@gmail.com',
          role: 'admin',
          // Default password hash or empty to allow setup on first login
          passwordHash: null,
          createdAt: new Date().toISOString()
        }
      ],
      products: initialProducts.map(p => ({
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString()
      })),
      orders: defaultOrders,
      settings: {
        storeName: storeConfig.storeName,
        whatsappNumber: storeConfig.whatsappNumber,
        deliveryFee: storeConfig.deliveryFee,
        freeShippingThreshold: storeConfig.freeShippingThreshold,
        announcementText: storeConfig.announcementText,
        showAnnouncement: storeConfig.showAnnouncement
      }
    };

    this.save(initialData);
    return initialData;
  }

  save(data = this.data) {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Failed to save store.json:', err);
    }
  }

  // --- Auth & Users ---
  verifyUser(email, password) {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-register first user as admin if email matches
      if (email.toLowerCase() === 'jayasuryacj.wrk@gmail.com') {
        const newUser = {
          id: '144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37',
          email,
          role: 'admin',
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString()
        };
        this.data.users.push(newUser);
        this.save();
        return { id: newUser.id, email: newUser.email, role: newUser.role };
      }
      return null;
    }

    // If user has no password yet, set it on first successful login
    if (!user.passwordHash) {
      user.passwordHash = hashPassword(password);
      this.save();
      return { id: user.id, email: user.email, role: user.role };
    }

    // Verify hash
    if (user.passwordHash === hashPassword(password)) {
      return { id: user.id, email: user.email, role: user.role };
    }

    // Also accept if password matches direct match for convenience during transition
    return null;
  }

  getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role };
  }

  // --- Products ---
  getProducts(includePrivate = false) {
    if (includePrivate) {
      return this.data.products;
    }
    return this.data.products.map(({ supplierCost, supplierUrl, supplierSku, ...publicProduct }) => publicProduct);
  }

  getProductById(id, includePrivate = false) {
    const product = this.data.products.find(p => p.id === id || p.slug === id);
    if (!product) return null;
    if (includePrivate) return product;
    const { supplierCost, supplierUrl, supplierSku, ...publicProduct } = product;
    return publicProduct;
  }

  saveProduct(productData) {
    const now = new Date().toISOString();
    const existingIndex = this.data.products.findIndex(p => p.id === productData.id);

    if (existingIndex >= 0) {
      this.data.products[existingIndex] = {
        ...this.data.products[existingIndex],
        ...productData,
        updatedAt: now
      };
      this.save();
      return this.data.products[existingIndex];
    } else {
      const newProduct = {
        ...productData,
        id: productData.id || `prod-${Date.now().toString(36)}`,
        createdAt: now,
        updatedAt: now
      };
      this.data.products.unshift(newProduct);
      this.save();
      return newProduct;
    }
  }

  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Orders ---
  getOrders() {
    return this.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id || o.reference === id) || null;
  }

  createOrder(orderData) {
    const now = new Date().toISOString();
    const reference = `NP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now().toString(36)}`,
      reference: orderData.reference || reference,
      status: 'New Request',
      supplierOrderRef: '',
      trackingNumber: '',
      adminNotes: orderData.adminNotes || '',
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrder(id, updates) {
    const orderIndex = this.data.orders.findIndex(o => o.id === id || o.reference === id);
    if (orderIndex === -1) return null;

    this.data.orders[orderIndex] = {
      ...this.data.orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.orders[orderIndex];
  }

  // --- Settings ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
    return this.data.settings;
  }
}

export const db = new StoreDatabase();
