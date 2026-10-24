import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Search,
  MessageCircle
} from 'lucide-react';
import { fetchOrders, fetchProducts } from '../lib/dataService';
import { formatCurrency } from '../utils/orderUtils';

export default function AdminOverview() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchOrders(),
          fetchProducts({ isAdmin: true })
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Metrics derived from actual database data
  const totalOrdersCount = orders.length;
  const newRequestsCount = orders.filter(o => o.status === 'New Request').length;
  const awaitingConfirmationCount = orders.filter(o => o.status === 'Awaiting Customer Confirmation').length;
  const fulfillingCount = orders.filter(o => o.status === 'Supplier Order Placed' || o.status === 'Confirmed').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  // Total sales from orders marked delivered
  const totalDeliveredSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  // Low stock alerts (<= 5 units or out of stock)
  const lowStockProducts = products.filter(p => !p.inStock || p.stockQuantity <= 5);

  // Filtered recent orders
  const recentOrders = orders
    .filter(o => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        o.reference?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q)
      );
    })
    .slice(0, 8);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Request':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">New Request</span>;
      case 'Awaiting Customer Confirmation':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Awaiting Confirmation</span>;
      case 'Confirmed':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Confirmed</span>;
      case 'Supplier Order Placed':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Supplier Placed</span>;
      case 'Shipped':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Shipped</span>;
      case 'Delivered':
        return <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">Delivered</span>;
      case 'Cancelled':
        return <span className="bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full text-[11px] font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-warm-200 rounded w-1/4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-warm-200" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time orders, Pan-India COD fulfillment metrics, and inventory monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products?action=add"
            className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl border border-warm-300 bg-white hover:bg-warm-50 text-neutral-800 text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-brand-700" />
            <span>All Orders</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Delivered Sales Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Delivered Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-neutral-900">
            {formatCurrency(totalDeliveredSales)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            From {deliveredCount} fulfilled COD orders
          </div>
        </div>

        {/* New Requests */}
        <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">New Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-amber-800">
            {newRequestsCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Need WhatsApp verification
          </div>
        </div>

        {/* Awaiting Confirmation */}
        <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Confirmation</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-blue-800">
            {awaitingConfirmationCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Waiting on customer reply
          </div>
        </div>

        {/* Orders in Fulfilment */}
        <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Fulfilment</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-purple-900">
            {fulfillingCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Supplier placed or in transit
          </div>
        </div>
      </div>

      {/* Secondary Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-warm-200 flex items-center justify-between">
          <span className="text-neutral-500 font-medium">Total Lifetime Orders:</span>
          <span className="font-bold text-neutral-900">{totalOrdersCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-warm-200 flex items-center justify-between">
          <span className="text-neutral-500 font-medium">Delivered Parcels:</span>
          <span className="font-bold text-emerald-700">{deliveredCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-warm-200 flex items-center justify-between">
          <span className="text-neutral-500 font-medium">Cancelled Orders:</span>
          <span className="font-bold text-red-600">{cancelledCount}</span>
        </div>
      </div>

      {/* Low Stock / Unavailable Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Low Stock & Availability Alert ({lowStockProducts.length} items)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center gap-3">
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-warm-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-neutral-900 truncate">{p.name}</div>
                  <div className="text-[11px] text-neutral-500">
                    {p.inStock ? (
                      <span className="text-amber-700 font-bold">{p.stockQuantity} left in stock</span>
                    ) : (
                      <span className="text-red-600 font-bold">Marked Out of Stock</span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/admin/products?edit=${p.id}`}
                  className="text-xs font-semibold text-brand-800 hover:underline"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-warm-100">
          <div>
            <h2 className="font-display font-bold text-lg text-neutral-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-neutral-500">
              Showing latest order requests placed on the storefront.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, phone..."
                className="bg-warm-50 border border-warm-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <Link
              to="/admin/orders"
              className="text-xs font-bold text-brand-800 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Orders Table */}
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No orders found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50/80 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Reference</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-900">
                      {order.reference}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-700 font-medium">
                      {order.district || order.city || ''}{order.state ? `, ${order.state}` : ''}
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/orders?view=${order.id}`}
                        className="inline-block px-3 py-1 bg-warm-100 hover:bg-brand-800 hover:text-white rounded-lg text-[11px] font-bold text-neutral-800 transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
