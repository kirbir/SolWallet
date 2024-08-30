console.log('popup.js is running');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

  // Get all necessary DOM elements
  const walletInfo = document.getElementById('wallet-info');
  const balanceInfo = document.getElementById('balance-info');
  const createWalletBtn = document.getElementById('create-wallet');
  const importWalletBtn = document.getElementById('import-wallet');
  const walletActions = document.getElementById('wallet-actions');
  const sendBtn = document.getElementById('send-btn');
  const receiveBtn = document.getElementById('receive-btn');
  const menuBtn = document.getElementById('menu-btn');
  const importKeyBtn = document.getElementById('import-key');
  const modal = document.getElementById('menu-modal');
  const showSeedPhraseBtn = document.getElementById('show-seed-phrase');
  const exportPrivateKeyBtn = document.getElementById('export-private-key');
  const seedPhraseContainer = document.getElementById('seed-phrase-container');
  const privateKeyContainer = document.getElementById('private-key-container');
  const seedPhraseElement = document.getElementById('seed-phrase');
  const privateKeyElement = document.getElementById('private-key');
  const copyPrivateKeyBtn = document.getElementById('copy-private-key');

  console.log('DOM elements:', { walletInfo, createWalletBtn, importWalletBtn, walletActions, menuBtn, modal });

  // Check if all elements are found
  if (!walletInfo || !balanceInfo || !createWalletBtn || !importWalletBtn || !walletActions || !menuBtn || !modal) {
    console.error('One or more essential elements not found in the DOM');
    return;
  }

  // Function to load existing wallet
  function loadExistingWallet() {
    chrome.storage.local.get(['publicKey'], (result) => {
      if (result.publicKey) {
        console.log('Existing wallet found:', result.publicKey);
        walletInfo.textContent = `Wallet Address: ${result.publicKey}`;
        createWalletBtn.style.display = 'none';
        importWalletBtn.style.display = 'none';
        walletActions.style.display = 'flex';
        updateBalance(result.publicKey);
      } else {
        console.log('No existing wallet found');
      }
    });
  }

  // Function to update balance
  function updateBalance(publicKey) {
    console.log('Updating balance for:', publicKey);
    chrome.runtime.sendMessage({action: 'getBalance', publicKey: publicKey}, (response) => {
      console.log('Balance update response:', response);
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        balanceInfo.textContent = 'Error fetching balance';
        return;
      }
      if (response && response.success) {
        balanceInfo.textContent = `Balance: ${response.balance} SOL`;
      } else {
        console.error('Error response:', response);
        balanceInfo.textContent = 'Error fetching balance';
        // Display a more user-friendly error message
        alert('Unable to fetch balance. Please try again later.');
      }
    });
  }

  // Load existing wallet when popup opens
  loadExistingWallet();

  createWalletBtn.addEventListener('click', () => {
    console.log('Create wallet button clicked');
    walletInfo.textContent = 'Creating wallet...';
    chrome.runtime.sendMessage({action: 'generateWallet'}, (response) => {
      console.log('Wallet creation response:', response);
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        walletInfo.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.success) {
        walletInfo.textContent = `Wallet Address: ${response.address}`;
        createWalletBtn.style.display = 'none';
        importWalletBtn.style.display = 'none';
        walletActions.style.display = 'flex';
        updateBalance(response.address);
      } else {
        console.error('Error response:', response);
        walletInfo.textContent = 'Error creating wallet: ' + (response && response.error ? response.error : 'Unknown error');
      }
    });
  });

  importWalletBtn.addEventListener('click', () => {
    console.log('Import wallet button clicked');
    alert('Import wallet functionality not implemented yet');
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      console.log('Send button clicked');
      alert('Send functionality not implemented yet');
    });
  }

  if (receiveBtn) {
    receiveBtn.addEventListener('click', () => {
      console.log('Receive button clicked');
      const address = walletInfo.textContent.split(': ')[1];
      alert(`Your wallet address is: ${address}\nShare this address with others to receive crypto.`);
    });
  }

  // Menu functionality
  menuBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
      seedPhraseContainer.style.display = 'none';
      privateKeyContainer.style.display = 'none';
    }
  });

  importKeyBtn.addEventListener('click', () => {
    const privateKey = prompt('Enter your private key:');
    if (privateKey) {
      // Implement private key import logic here
      console.log('Importing private key:', privateKey);
    }
  });

  showSeedPhraseBtn.addEventListener('click', () => {
    chrome.storage.local.get(['mnemonic'], (result) => {
      if (result.mnemonic) {
        seedPhraseElement.textContent = result.mnemonic;
        seedPhraseContainer.style.display = 'block';
        privateKeyContainer.style.display = 'none';
      } else {
        alert('No seed phrase found. Please create a wallet first.');
      }
    });
  });

  exportPrivateKeyBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'encodePrivateKey'}, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        alert('Error exporting private key: ' + chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        privateKeyElement.textContent = response.encodedKey;
        privateKeyContainer.style.display = 'block';
        seedPhraseContainer.style.display = 'none';
      } else {
        alert('Error exporting private key: ' + (response.error || 'Unknown error'));
      }
    });
  });

  copyPrivateKeyBtn.addEventListener('click', () => {
    const privateKey = privateKeyElement.textContent;
    navigator.clipboard.writeText(privateKey).then(() => {
      alert('Private key copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  });

  receiveBtn.addEventListener('click', () => {
    console.log('Receive button clicked');
    const address = walletInfo.textContent.split(': ')[1];
    alert(`Your wallet address is: ${address}\nShare this address with others to receive crypto.`);
  });

  console.log('End of popup.js');
});
