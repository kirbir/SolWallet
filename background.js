import { Buffer } from 'buffer';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';

// Remove the line that tries to set Buffer on window
// window.Buffer = Buffer;

let wallet = null;
const connection = new Connection('https://api.mainnet-beta.solana.com');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateWallet') {
    generateWallet().then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;  // Indicates that the response is sent asynchronously
  }
});

async function generateWallet() {
  try {
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
    return {
      success: false,
      error: error.message
    };
  }
}