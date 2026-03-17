import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found — 404 | FoodTracks',
  description: 'The page you are looking for does not exist or has been moved. Return to the FoodTracks homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <ChefHat className="h-16 w-16 mx-auto text-orange-500" />
        <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
        <p className="text-xl text-gray-500 max-w-md mx-auto">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl font-bold px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
