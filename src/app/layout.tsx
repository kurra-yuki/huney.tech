import '../styles/globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';

export const metadata = {
    title: 'Huney.tech - はちみつと学ぶIT',
    description: 'ITを、ひとさじ甘く。初心者向けIT学習サイト。'
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ja">
            <body className="bg-white text-brown">
                <div className="min-h-screen flex flex-col">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
