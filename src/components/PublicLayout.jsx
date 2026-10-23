import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ScrollToTop from './ScrollToTop';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-neutral-900">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
