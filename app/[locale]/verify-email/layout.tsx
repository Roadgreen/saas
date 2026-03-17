import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'Verify Email | FoodTracks',
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
