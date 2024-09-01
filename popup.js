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
  const networkSelector = document.getElementById('network-selector');
  const connectionStatus = document.getElementById('connection-status');
  const createNewAccountBtn = document.getElementById('create-new-account');
  const sendModal = document.getElementById('send-modal');
  const cancelSendBtn = document.getElementById('cancel-send');
  const confirmSendBtn = document.getElementById('confirm-send');
  const recipientAddressInput = document.getElementById('recipient-address');
  const sendAmountInput = document.getElementById('send-amount');

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
        
        // Fetch and update recent transactions
        fetchRecentTransactions(result.publicKey)
          .then(transactions => {
            console.log('Fetched transactions:', transactions);
            updateTransactionsList(transactions);
          })
          .catch(error => {
            console.error('Error fetching transactions:', error);
            updateTransactionsList([]); // Show empty list on error
          });
      } else {
        console.log('No existing wallet found');
      }
    });
  }

  // Function to update balance
  function updateBalance(publicKey) {
    console.log('Updating balance for:', publicKey);
    chrome.runtime.sendMessage({ action: 'getBalance', publicKey: publicKey }, (response) => {
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

      }
    });
  }

  // Add this function to fetch recent transactions
  async function fetchRecentTransactions(publicKey) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'getRecentTransactions', publicKey: publicKey }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.success) {
          resolve(response.transactions);
        } else {
          console.error('Error response:', response);
          reject(new Error(response.error || 'Failed to fetch transactions'));
        }
      });
    });
  }

  // Add this function to update the transactions list in the UI
  function updateTransactionsList(transactions) {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = ''; // Clear existing list

    if (!transactions || transactions.length === 0) {
      transactionsList.innerHTML = '<li class="no-transactions">No transactions yet</li>';
    } else {
      transactions.forEach(tx => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
          <span class="transaction-type">${tx.type}</span>
          <span class="transaction-amount">${tx.amount.toFixed(9)} SOL</span>
          <span class="transaction-date">${new Date(tx.timestamp).toLocaleString()}</span>
        `;
        transactionsList.appendChild(li);
      });
    }
  }

  // Load existing wallet when popup opens
  loadExistingWallet();

  createWalletBtn.addEventListener('click', () => {
    console.log('Create wallet button clicked');
    walletInfo.textContent = 'Creating wallet...';
    chrome.runtime.sendMessage({ action: 'generateWallet' }, (response) => {
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
      sendModal.style.display = 'block';
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

  // Function to update connection status
  function updateConnectionStatus(isConnected) {
    connectionStatus.textContent = isConnected ? 'Connected' : 'Disconnected';
    connectionStatus.className = isConnected ? 'connected' : 'disconnected';
  }

  // Function to switch network
  function switchNetwork(network) {
    chrome.runtime.sendMessage({action: 'switchNetwork', network: network}, (response) => {
      if (response && response.success) {
        updateConnectionStatus(true);
        // Refresh wallet info and balance after switching network
        loadExistingWallet();
      } else {
        updateConnectionStatus(false);
        alert('Failed to switch network. Please try again.');
      }
    });
  }

  // Handle network selection
  networkSelector.addEventListener('change', (event) => {
    const selectedNetwork = event.target.value;
    if (selectedNetwork === 'custom') {
      const customRPC = prompt('Enter custom RPC URL:');
      if (customRPC) {
        switchNetwork(customRPC);
      } else {
        networkSelector.value = 'devnet'; // Reset to devnet if no custom RPC is provided
      }
    } else {
      switchNetwork(selectedNetwork);
    }
  });

  // Initial connection status check and set default network to devnet
  chrome.runtime.sendMessage({action: 'getNetworkStatus'}, (response) => {
    if (response && response.connected) {
      updateConnectionStatus(true);
      networkSelector.value = response.network;
    } else {
      updateConnectionStatus(false);
      networkSelector.value = 'devnet';
    }
    // Always switch to devnet when opening the extension
    switchNetwork('https://api.devnet.solana.com');
  });

  // Function to create a new wallet
  function createNewWallet() {
    console.log('Creating new wallet...');
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
        modal.style.display = 'none'; // Close the modal after creating a new account
      } else {
        console.error('Error response:', response);
        walletInfo.textContent = 'Error creating wallet: ' + (response && response.error ? response.error : 'Unknown error');
      }
    });
  }

  // Add event listener for the new "Create New Account" button
  createNewAccountBtn.addEventListener('click', () => {
    console.log('Create New Account button clicked');
    createNewWallet();
  });

  cancelSendBtn.addEventListener('click', () => {
    sendModal.style.display = 'none';
    // Clear input fields
    recipientAddressInput.value = '';
    sendAmountInput.value = '';
  });

  confirmSendBtn.addEventListener('click', () => {
    const recipientAddress = recipientAddressInput.value;
    const amount = parseFloat(sendAmountInput.value);

    if (!recipientAddress || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid recipient address and amount.');
      return;
    }

    // Disable the send button and show a loading indicator
    confirmSendBtn.disabled = true;
    confirmSendBtn.textContent = 'Sending...';

    // Send transaction
    sendTransaction(recipientAddress, amount)
      .then((result) => {
        if (result.success) {
          alert(`Transaction sent successfully! Signature: ${result.signature}`);
          sendModal.style.display = 'none';
          // Clear input fields
          recipientAddressInput.value = '';
          sendAmountInput.value = '';
          // Refresh balance and transaction list
          loadExistingWallet();
        } else {
          throw new Error(result.error);
        }
      })
      .catch(error => {
        alert(`Error sending transaction: ${error.message}`);
      })
      .finally(() => {
        // Re-enable the send button and restore its text
        confirmSendBtn.disabled = false;
        confirmSendBtn.textContent = 'Send';
      });
  });

  console.log('End of popup.js');
});

async function sendTransaction(recipientAddress, amount) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'sendTransaction',
      recipientAddress: recipientAddress,
      amount: amount
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response && response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to send transaction'));
      }
    });
  });
}
