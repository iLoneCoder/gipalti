// Content script that runs on hub.tipalti.com pages
console.log('hello');


// Request the payerToken from the Service Worker
chrome.runtime.sendMessage(
  { action: 'getPayerToken' },
  async (response) => {
    console.log("The action is triggered");
    console.log("Response received in content script:", response);
    if (response.token) {
      console.log('payerToken from extension:', response.token);
      await addCookieValueToPage(response.token);
    } else {
      console.log('Failed to retrieve payerToken:', response.error);
    }
  }
);

async function addCookieValueToPage(token) {
    try {
        const copyIconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

        const headerContainer = await waitForElement('.user-controls.top-bar__user-controls');
        console.log("Header container:", headerContainer);

        const extensionContainer = document.createElement('div');
        const idContainer = document.createElement('div');
        const id = document.createElement('span');
        const copyButton = document.createElement('button');
        
        
        id.textContent = `${token}`;


        copyButton.innerHTML = copyIconSvg;
        copyButton.style.marginLeft = '2px';
        copyButton.style.cursor = 'pointer';
        copyButton.title = 'Copy ID';

        extensionContainer.appendChild(idContainer);
        idContainer.appendChild(id);
        idContainer.appendChild(copyButton);
        headerContainer.appendChild(extensionContainer);

        // style the container
        idContainer.classList.add('gipalti-id_container');
        copyButton.classList.add('gipalti-copy_button');
       
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(token)
        })
    } catch (error) {
        console.error("Error adding cookie value to page:", error);
    }
}


function waitForElement(selector) {
    return new Promise((res, rej) => {
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector)
            if(element) {
                observer.disconnect()
                res(element)
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        setTimeout(() => {
            observer.disconnect()
            rej(new Error('Element not found within timeout'))
        }, 10000) // Timeout after 10 seconds
    })
}
