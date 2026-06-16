import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/hooks/useWallet';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stellar Launchpad - Launch Tokens on Stellar',
  description: 'Launch tokens on Stellar with built-in vesting schedules and airdrop campaigns. No coding required.',
  keywords: 'stellar, blockchain, token launch, vesting, airdrop, defi, cryptocurrency',
  authors: [{ name: 'Stellar Launchpad Team' }],
  openGraph: {
    title: 'Stellar Launchpad',
    description: 'Launch tokens on Stellar with vesting and airdrops',
    type: 'website',
  },
};

function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Stellar Launchpad</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/launch" className="text-muted-foreground hover:text-foreground transition-colors">
                Launch
              </Link>
              <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                Explore
              </Link>
              <Link href="/vesting" className="text-muted-foreground hover:text-foreground transition-colors">
                Vesting
              </Link>
              <Link href="/airdrop" className="text-muted-foreground hover:text-foreground transition-colors">
                Airdrops
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkSelector />
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}