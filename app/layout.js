import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'], // Pilih subset sesuai kebutuhan
  weight: ['400', '500', '600', '700'], // Tambahkan berat font yang diinginkan
  variable: '--font-poppins', // Variabel CSS untuk font
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
