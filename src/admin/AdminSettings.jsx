import React, { useState, useEffect } from 'react';
import { Save, Check, Settings, MessageCircle, Mail, Truck, AlertCircle, ShieldAlert } from 'lucide-react';
import { fetchStoreSettings, saveStoreSettings } from '../lib/dataService';
import storeConfig from '../config/storeConfig';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: storeConfig.storeName,
    tagline: storeConfig.tagline,
    whatsappNumber: storeConfig.whatsappNumber,
    instagramUrl: storeConfig.instagramUrl,
    contactEmail: storeConfig.contactEmail,
    announcementText: storeConfig.announcementText,
    deliveryFee: storeConfig.deliveryFee,
    freeShippingThreshold: storeConfig.freeShippingThreshold
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStoreSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Error fetching store settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveStoreSettings(settings);
      if (res.success) {
        showToast('Store settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + res.error);
      }
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-neutral-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-float text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Configure brand details, WhatsApp business number, delivery fees, and announcements.
        </p>
      </div>

      {/* Manual Reseller Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Business Principle:</strong> This storefront uses manual WhatsApp verification and manual supplier ordering. Do not claim automatic Meesho API connections, automatic warehouse stock sync, or instant supplier guarantees to customers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-warm-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-700" />
            <span>Brand & Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Store Display Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-warm-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp & Communication Channels</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                WhatsApp Business Number (with country code 91, no '+' or spaces) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="919876543210"
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Replace <code>91YOURWHATSAPPNUMBER</code> with your actual 10-digit mobile number preceded by 91 (e.g. <code>919847123456</code>). All customer COD order requests will be routed to this number.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Instagram Profile URL (For Reels & Bio)
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/nammudepicks"
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="support@nammudepicks.in"
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Charges & Free Shipping Threshold */}
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-warm-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-700" />
            <span>Kerala Shipping & Delivery Rates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Standard Kerala Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Set to 0 if you want free shipping on all orders.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold || ''}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value ? Number(e.target.value) : null })}
                placeholder="e.g. 999"
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Orders above this amount get free delivery automatically.</p>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-warm-100">
            Top Announcement Bar
          </h2>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Banner Text (Displayed at very top of website)
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
