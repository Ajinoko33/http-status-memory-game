import { GameConfigContextProvider } from '@/components';
import { Layout } from '@/components/layout';
import { AntDConfigProvider } from '@/components/provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HTTP Status Memory Game',
  description: 'The memory game with http response status code',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AntdRegistry>
          <AntDConfigProvider>
            <GameConfigContextProvider>
              <Layout>{children}</Layout>
            </GameConfigContextProvider>
          </AntDConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
