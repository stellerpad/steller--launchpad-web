# Stellar Launchpad Web

A Next.js web application where anyone can launch tokens on Stellar, configure vesting schedules, run airdrops, and browse all existing token launches.

## 🚀 Features

### Token Launch
- **Easy Token Creation**: Launch tokens on Stellar with customizable parameters
- **Token Configuration**: Set name, symbol, supply, decimals, and features (mintable/burnable)
- **Multi-step Wizard**: Guided process with token config, vesting, and airdrop setup
- **Real-time Deployment**: Live transaction progress with contract address results

### Vesting Schedules
- **Flexible Vesting**: Linear, cliff, or hybrid vesting schedules
- **Progress Tracking**: Visual progress bars showing released and claimable amounts
- **One-click Claiming**: Claim vested tokens directly from the interface
- **Revocable Options**: Support for revocable vesting schedules

### Airdrop Campaigns
- **Multiple Distribution Types**: Equal, weighted, or claimable airdrops
- **CSV Upload**: Easy recipient management with CSV file upload
- **Distribution Control**: Manual or automated token distribution
- **Campaign Tracking**: Monitor distribution progress and status

### Token Explorer
- **Browse All Launches**: Discover tokens launched on the platform
- **Advanced Filtering**: Search by name, symbol, date range
- **Detailed Token Pages**: Complete token information with tabs for overview, vesting, airdrops, and holders
- **Stellar Integration**: Direct links to Stellar Expert for on-chain verification

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet Integration**: @stellar/freighter-api
- **Stellar SDK**: @stellar/stellar-sdk
- **Charts**: Recharts
- **Icons**: Lucide React

## 🏗 Project Structure

```
stellar-launchpad-web/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── launch/page.tsx          # Token launch form
│   ├── explore/page.tsx         # Browse launches
│   ├── token/[id]/page.tsx      # Token detail page
│   ├── vesting/
│   │   ├── page.tsx             # My vesting schedules
│   │   └── new/page.tsx         # Create vesting
│   ├── airdrop/
│   │   ├── page.tsx             # My airdrops
│   │   └── new/page.tsx         # Create airdrop
│   └── layout.tsx
├── components/
│   ├── wallet/                  # Wallet connection components
│   ├── launch/                  # Token launch form components
│   ├── token/                   # Token display components
│   ├── vesting/                 # Vesting management components
│   ├── airdrop/                 # Airdrop management components
│   ├── explore/                 # Token discovery components
│   └── ui/                      # Reusable UI components
├── hooks/                       # React hooks for state management
├── lib/                         # Utility libraries and helpers
└── types/                       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Freighter wallet extension installed in your browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/stellar-launchpad-web.git
cd stellar-launchpad-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💫 Usage

### Launching a Token

1. **Connect Freighter Wallet**: Click "Connect Freighter" in the header
2. **Navigate to Launch**: Click "Launch a Token" from the homepage or header
3. **Configure Token**: Fill in token details (name, symbol, supply, etc.)
4. **Optional Vesting**: Set up vesting schedules for team allocation
5. **Optional Airdrop**: Configure airdrop campaigns for distribution
6. **Review & Deploy**: Confirm configuration and deploy to Stellar

### Managing Vesting

1. **View Schedules**: Navigate to "Vesting" to see your schedules
2. **Track Progress**: Monitor vesting progress with visual indicators
3. **Claim Tokens**: Click "Claim" buttons to withdraw vested tokens
4. **Create New**: Use "Create Schedule" for standalone vesting contracts

### Running Airdrops

1. **Campaign Overview**: Visit "Airdrops" to manage campaigns
2. **Create Campaign**: Set up new airdrops with CSV recipient uploads
3. **Monitor Progress**: Track distribution status and completion
4. **Execute Distribution**: Manually trigger token distribution when ready

### Exploring Tokens

1. **Browse Launches**: Use "Explore" to discover all platform tokens
2. **Filter Results**: Search by name, symbol, or launch date
3. **View Details**: Click on tokens to see comprehensive information
4. **Check On-chain**: Use Stellar Expert links for blockchain verification

## 🔗 Sister Repositories

This is part of a 3-repository ecosystem:

- **Core Contracts**: [stellar-launchpad-core](https://github.com/your-org/stellar-launchpad-core) - Soroban smart contracts
- **Documentation**: [stellar-launchpad-docs](https://github.com/your-org/stellar-launchpad-docs) - Technical documentation

## 🎨 Design Features

- **Dark Mode**: Optimized dark theme for better user experience
- **Mobile Responsive**: Full mobile and tablet support
- **Real-time Updates**: Live transaction progress and status updates
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth loading animations and skeleton screens

## 🔒 Security

- **Wallet Integration**: Secure Freighter wallet integration
- **Input Validation**: Client-side validation for all forms
- **Error Boundaries**: Graceful error handling and recovery
- **HTTPS Only**: All external links use secure protocols

## 📱 Browser Support

- Chrome/Chromium (recommended for Freighter)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Create an issue in this repository for bugs or feature requests
- Join our community discussions
- Check the [documentation repository](https://github.com/your-org/stellar-launchpad-docs) for detailed guides