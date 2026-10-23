import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto text-neutral-400">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h1 className="font-display font-extrabold text-3xl text-neutral-900">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 rounded-full bg-brand-800 text-white font-bold text-xs"
      >
        Back to Home
      </Link>
    </div>
  );
}
