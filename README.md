# Solana Wallet Chrome Extension

![screenshot](https://github.com/user-attachments/assets/aae40dc0-7edb-4138-b5a7-a6408c23aba9)

A lightweight Chrome extension for managing Solana wallets.

## 🚀 Features

- ✨ Create new Solana wallets
- 💰 View wallet balance in real-time
- 🔑 Export private keys securely
- 🌱 Display and securely store seed phrases
- 📥 Receive SOL tokens
- 💸 Send SOL tokens to other addresses
- 🔄 View recent transactions
- 🌐 Switch between different Solana networks (Mainnet, Testnet, Devnet)
- 👛 Create multiple accounts within the same wallet
- 🔒 Secure storage of wallet information
- 📊 Real-time balance updates
- 🔍 Transaction details and confirmation status

## 🛠️ Technologies Used

- **Language:** JavaScript
- **Main Library:** [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- **Blockchain:** Solana
- **Extension Framework:** Chrome Extension API
- **Build Tool:** Webpack
- **Additional Libraries:**
  - [bip39](https://github.com/bitcoinjs/bip39) for mnemonic phrase generation
  - [bs58](https://github.com/cryptocoinjs/bs58) for Base58 encoding/decoding

## 🛠 Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/solana-wallet-extension.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder from this project

## 📖 Usage

1. Click the extension icon in Chrome to open the wallet interface
2. Create a new wallet or import an existing one
3. View your balance and wallet address
4. Use the "Send" button to transfer SOL to another address
5. Use the "Receive" button to display your address for incoming transactions
6. View recent transactions in the transaction list
7. Switch between different Solana networks using the network selector
8. Access additional options like exporting private keys from the menu

## ⚠️ Security

- Always keep your seed phrase and private keys secure
- Never share sensitive information with anyone
- This extension is for educational purposes; use at your own risk

## 🔜 Upcoming Features

- [ ] Support for SPL tokens
- [ ] Enhanced transaction history with filtering options
- [ ] QR code generation for easy receiving
- [ ] Address book functionality
- [ ] Custom RPC endpoint support

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/solana-wallet-extension/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
