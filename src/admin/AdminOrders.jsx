import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Save,
  X,
  FileText,
  User,
  MapPin,
  Phone,
  Copy,
  Check
} from 'lucide-react';
import { fetchOrders, updateOrder } from '../lib/dataService';
import { formatCurrency } from '../utils/orderUtils';

const ORDER_STATUSES = [
  'New Request',
  'Awaiting Customer Confirmation',
  'Confirmed',
  'Supplier Order Placed',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Return Requested',
  'Refund Pending',
  'Refunded'
];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Selected Order Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editSupplierRef, setEditSupplierRef] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingUpdates, setSavingUpdates] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);

      const viewId = searchParams.get('view');
      if (viewId) {
        const found = data.find(o => o.id === viewId || o.reference === viewId);
        if (found) openOrderDrawer(found);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openOrderDrawer = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status || 'New Request');
    setEditSupplierRef(order.supplierOrderRef || '');
    setEditTracking(order.trackingNumber || '');
    setEditNotes(order.adminNotes || '');
  };

  const closeOrderDrawer = () => {
    setSelectedOrder(null);
    setSearchParams({});
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setSavingUpdates(true);

    try {
      const res = await updateOrder(selectedOrder.id, {
        status: editStatus,
        supplierOrderRef: editSupplierRef.trim(),
        trackingNumber: editTracking.trim(),
        adminNotes: editNotes.trim()
      });

      if (res.success) {
        showToast('Order details updated successfully!');
        // Update local object
        setSelectedOrder(prev => ({
          ...prev,
          status: editStatus,
          supplierOrderRef: editSupplierRef.trim(),
          trackingNumber: editTracking.trim(),
          adminNotes: editNotes.trim()
        }));
        await loadOrders();
      } else {
        alert('Failed to update: ' + res.error);
      }
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setSavingUpdates(false);
    }
  };

  // WhatsApp communication with customer
  const handleOpenCustomerWhatsApp = () => {
    if (!selectedOrder) return;
    const phone = selectedOrder.customerPhone.replace(/\D/g, '');
    let text = `Hi ${selectedOrder.customerName}, this is regarding your Nammude Picks order ${selectedOrder.reference}.\n\n`;

    if (editStatus === 'New Request' || editStatus === 'Awaiting Customer Confirmation') {
      text += `We have received your COD order request for ${formatCurrency(selectedOrder.totalAmount)}. Could you please confirm if this delivery address in ${selectedOrder.district} is correct so we can dispatch your parcel?`;
    } else if (editStatus === 'Confirmed' || editStatus === 'Supplier Order Placed') {
      text += `Good news! Your order has been confirmed and placed with our supplier. We will share your courier tracking link as soon as the package is dispatched.`;
    } else if (editStatus === 'Shipped') {
      text += `Your parcel has been dispatched via courier! Tracking reference: ${editTracking || 'In Transit'}. Cash on Delivery amount to pay upon arrival: ${formatCurrency(selectedOrder.totalAmount)}.`;
    } else if (editStatus === 'Delivered') {
      text += `Your package was marked delivered! Thank you for choosing Nammude Picks. Please feel free to reach out if you need any assistance.`;
    } else {
      text += `Update regarding your order status: ${editStatus}.`;
    }

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDeliveryAddress = () => {
    if (!selectedOrder) return;
    const full = `${selectedOrder.customerName}\nPhone: ${selectedOrder.customerPhone}\n${selectedOrder.houseName}\n${selectedOrder.streetLocality}\n${selectedOrder.postOffice}\n${selectedOrder.district}, Kerala - ${selectedOrder.pincode}\nInstructions: ${selectedOrder.deliveryInstructions || 'None'}`;
    navigator.clipboard.writeText(full);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const map = {
      'New Request': 'bg-amber-100 text-amber-900 border-amber-300',
      'Awaiting Customer Confirmation': 'bg-blue-100 text-blue-900 border-blue-300',
      'Confirmed': 'bg-emerald-100 text-emerald-900 border-emerald-300',
      'Supplier Order Placed': 'bg-purple-100 text-purple-900 border-purple-300',
      'Shipped': 'bg-indigo-100 text-indigo-900 border-indigo-300',
      'Delivered': 'bg-emerald-700 text-white border-transparent',
      'Cancelled': 'bg-red-100 text-red-900 border-red-300',
      'Return Requested': 'bg-orange-100 text-orange-900 border-orange-300',
      'Refund Pending': 'bg-pink-100 text-pink-900 border-pink-300',
      'Refunded': 'bg-neutral-800 text-white border-transparent'
    };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${map[status] || 'bg-neutral-100 text-neutral-800'}`}>
        {status}
      </span>
    );
  };

  // Filter & Search
  const filteredOrders = orders
    .filter(o => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          o.reference?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q) ||
          o.district?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-float text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track customer requests, verify on Meesho, and coordinate Kerala COD fulfillment.
          </p>
        </div>

        <div className="text-xs font-bold text-neutral-600 bg-white px-3.5 py-2 rounded-xl border border-warm-200">
          Total Orders: <span className="text-brand-800 font-extrabold">{orders.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, phone, district..."
              className="w-full bg-warm-50 border border-warm-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-medium text-neutral-500 whitespace-nowrap">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-warm-50 border border-warm-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {['All', ...ORDER_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'bg-warm-100 text-neutral-700 hover:bg-warm-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 text-neutral-500 font-semibold uppercase tracking-wider text-[10px] border-b border-warm-100">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Items</th>
                  <th className="py-3.5 px-3">Total (COD)</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Supplier Ref</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-900">
                      {o.reference}
                    </td>
                    <td className="py-3.5 px-3 text-neutral-500 text-[11px]">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-neutral-900">{o.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{o.customerPhone} ({o.district})</div>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-700">
                      {o.items?.length || 1} item(s)
                    </td>
                    <td className="py-3.5 px-3 font-bold text-neutral-900">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      {renderStatusBadge(o.status)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-600">
                      {o.supplierOrderRef || <span className="text-neutral-400 italic">Not set</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderDrawer(o)}
                        className="px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-brand-800 hover:text-white font-bold text-[11px] text-neutral-800 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ORDER DETAILS DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-warm-200 flex items-center justify-between bg-warm-50/70">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Order Management Drawer
                </span>
                <h2 className="font-display font-extrabold text-lg text-neutral-900">
                  Ref: <span className="text-brand-800">{selectedOrder.reference}</span>
                </h2>
              </div>
              <button
                onClick={closeOrderDrawer}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-warm-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 flex-1">
              {/* Meesho Manual Verification Alert */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Manual Meesho Fulfilment Protocol</span>
                </div>
                <p className="leading-relaxed">
                  Before confirming this order: Check Meesho app/website for current stock availability, price changes, and PIN code delivery eligibility. Ensure COD is supported for PIN <strong>{selectedOrder.pincode}</strong>.
                </p>
              </div>

              {/* Status Update Card */}
              <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-soft space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Order Fulfillment Status
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="flex-1 bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer WhatsApp Quick Actions */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Customer Communication
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    +91 {selectedOrder.customerPhone}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenCustomerWhatsApp}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send WhatsApp Status Update</span>
                  </button>
                  <button
                    onClick={handleCopyDeliveryAddress}
                    className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-1.5"
                    title="Copy full delivery address for Meesho app"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-soft space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <MapPin className="w-4 h-4 text-brand-700" />
                  <span>Delivery Address (Kerala)</span>
                </div>
                <div className="text-neutral-700 space-y-0.5 pl-5">
                  <div className="font-bold text-neutral-900">{selectedOrder.customerName}</div>
                  <div>{selectedOrder.houseName}</div>
                  <div>{selectedOrder.streetLocality}</div>
                  <div>{selectedOrder.postOffice}</div>
                  <div className="font-semibold text-brand-800">
                    {selectedOrder.district}, Kerala - PIN: {selectedOrder.pincode}
                  </div>
                  {selectedOrder.deliveryInstructions && (
                    <div className="mt-1 pt-1 border-t border-warm-100 text-neutral-500 italic">
                      Note: "{selectedOrder.deliveryInstructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-soft space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700">
                  Ordered Products ({selectedOrder.items?.length || 1})
                </h4>
                <div className="divide-y divide-warm-100 space-y-2 text-xs">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">{item.name}</div>
                        {item.variant && (
                          <div className="text-[11px] text-neutral-500">Variant: {item.variant}</div>
                        )}
                        <div className="text-[11px] text-neutral-400">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</div>
                      </div>
                      <div className="font-bold text-neutral-900">
                        {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-warm-200 space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping Fee:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-warm-100">
                    <span>Total Cash to Collect (COD):</span>
                    <span className="text-brand-800 font-extrabold">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Supplier Reference & Tracking Fields */}
              <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-soft space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700">
                  Supplier & Courier Tracking
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Supplier Order ID (e.g. Meesho Order No.)
                  </label>
                  <input
                    type="text"
                    value={editSupplierRef}
                    onChange={(e) => setEditSupplierRef(e.target.value)}
                    placeholder="e.g. MSH-908129381"
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Courier Tracking AWB / Link (Delhivery / Shadowfax / Ekart)
                  </label>
                  <input
                    type="text"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    placeholder="e.g. DELV991827361 or tracking URL"
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Internal Admin Notes (Customer requests, packing checks)
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Private notes about this order..."
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer Save Button */}
            <div className="p-4 border-t border-warm-200 bg-warm-50/70 flex items-center justify-between">
              <button
                onClick={closeOrderDrawer}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Close Drawer
              </button>

              <button
                onClick={handleSaveChanges}
                disabled={savingUpdates}
                className="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{savingUpdates ? 'Saving...' : 'Save Order Updates'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
