
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Correct import for Geist
import './globals.css';

const geistSans = Geist({ // Correct instantiation
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({ // Correct instantiation
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Културни Круг - Квиз Опште Културе',
  description: 'Забаван квиз из опште културе генерисан помоћу вештачке интелигенције.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Cyrl" className="h-[450px] overflow-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark h-full overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
