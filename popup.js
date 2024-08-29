console.log('popup.js is running');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

  const walletInfo = document.getElementById('wallet-info');
  const createWalletBtn = document.getElementById('create-wallet');
  const importWalletBtn = document.getElementById('import-wallet');

  console.log('walletInfo:', walletInfo);
  console.log('createWalletBtn:', createWalletBtn);
  console.log('importWalletBtn:', importWalletBtn);

  // Check if all elements are found
  if (!walletInfo || !createWalletBtn || !importWalletBtn) {
    console.error('One or more elements not found in the DOM');
    return;
  }

  // Function to load existing wallet
  function loadExistingWallet() {
    chrome.storage.local.get(['publicKey'], (result) => {
      if (result.publicKey) {
        walletInfo.textContent = `Wallet Address: ${result.publicKey}`;
        createWalletBtn.style.display = 'none';
        importWalletBtn.style.display = 'none';
      }
    });
  }

  // Load existing wallet when popup opens
  loadExistingWallet();

  createWalletBtn.addEventListener('click', () => {
    console.log('Create wallet button clicked');
    walletInfo.textContent = 'Creating wallet...';
    chrome.runtime.sendMessage({action: 'generateWallet'}, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        walletInfo.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.success) {
        walletInfo.textContent = `Wallet Address: ${response.address}`;
        createWalletBtn.style.display = 'none';
        importWalletBtn.style.display = 'none';
      } else {
        walletInfo.textContent = 'Error creating wallet: ' + (response.error || 'Unknown error');
      }
    });
  });

  importWalletBtn.addEventListener('click', () => {
    console.log('Import wallet button clicked');
    // Implement import wallet logic here
    alert('Import wallet functionality not implemented yet');
  });
});

console.log('End of popup.js');