import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';

let wallet = null;
let connection = null;

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

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
});

async function generateWallet() {
  try {
    await initConnection();
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    wallet = Keypair.fromSeed(seed.slice(0, 32));

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