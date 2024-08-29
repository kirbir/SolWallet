document.addEventListener('DOMContentLoaded', () => {
  const walletInfo = document.getElementById('wallet-info');
  const generateWalletBtn = document.getElementById('generate-wallet');
  const sendTransactionBtn = document.getElementById('send-transaction');

  generateWalletBtn.addEventListener('click', () => {
    walletInfo.textContent = 'Generating wallet...';
    chrome.runtime.sendMessage({action: 'generateWallet'}, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        walletInfo.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.success) {
        walletInfo.textContent = `Address: ${response.address}`;
      } else {
        walletInfo.textContent = 'Error generating wallet';
      }
    });
  });

  sendTransactionBtn.addEventListener('click', () => {
    // Implement send transaction logic
  });
});