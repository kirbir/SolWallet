import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';

let wallet = null;
let connection = null;
let currentNetwork = 'devnet'; // Set default network to devnet
const networks = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.testnet.solana.com',
  devnet: 'https://api.devnet.solana.com'
};

const RPC_ENDPOINT = networks.devnet; // Set default RPC endpoint to devnet

async function initConnection() {
  if (!connection) {
    connection = new Connection(RPC_ENDPOINT);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === 'generateWallet') {
    generateWallet().then(sendResponse);
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === 'getBalance') {
    getBalance(request.publicKey).then(sendResponse);
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === 'encodePrivateKey') {
    encodePrivateKey().then(sendResponse);
    return true;
  }

  if (request.action === 'switchNetwork') {
    switchNetwork(request.network).then(sendResponse);
    return true;
  }

  if (request.action === 'getNetworkStatus') {
    sendResponse({ connected: !!connection, network: currentNetwork });
    return true;
  }
});

async function generateWallet() {
  try {
    await initConnection();
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    wallet = Keypair.fromSeed(seed.slice(0, 32));

    // Request an airdrop to activate the account
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      1000000000 // 1 SOL in lamports
    );
    await connection.confirmTransaction(airdropSignature);

    await chrome.storage.local.set({
      mnemonic: mnemonic,
      publicKey: wallet.publicKey.toString(),
      privateKey: Array.from(wallet.secretKey)
    });

    return {
      success: true,
      address: wallet.publicKey.toString()
    };
  } catch (error) {
    console.error('Error generating wallet:', error);
    return { success: false, error: error.message };
  }
}

async function getBalance(publicKey) {
  try {
    await initConnection();
    console.log('Fetching balance for:', publicKey);
    const balance = await connection.getBalance(new PublicKey(publicKey));
    console.log('Balance fetched:', balance);
    return {
      success: true,
      balance: balance / 1000000000 // Convert lamports to SOL
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return { success: false, error: error.message };
  }
}

async function encodePrivateKey() {
  try {
    const result = await chrome.storage.local.get(['privateKey']);
    if (result.privateKey) {
      const privateKeyUint8Array = new Uint8Array(result.privateKey);
      const privateKeyBase58 = bs58.encode(privateKeyUint8Array);
      return { success: true, encodedKey: privateKeyBase58 };
    } else {
      return { success: false, error: 'No private key found' };
    }
  } catch (error) {
    console.error('Error encoding private key:', error);
    return { success: false, error: error.message };
  }
}

// Function to switch network
async function switchNetwork(network) {
  try {
    if (networks[network]) {
      currentNetwork = network;
      connection = new Connection(networks[network]);
    } else {
      // Assume it's a custom RPC URL
      connection = new Connection(network);
      currentNetwork = 'custom';
    }
    // Test connection
    await connection.getVersion();
    return { success: true };
  } catch (error) {
    console.error('Error switching network:', error);
    return { success: false, error: error.message };
  }
}