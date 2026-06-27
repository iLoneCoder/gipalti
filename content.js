// Content script that runs on hub.tipalti.com pages
console.log('hello');


// Request the payerToken from the Service Worker
chrome.runtime.sendMessage(
  { action: 'getPayerToken' },
  async (response) => {
    console.log("The action is triggered");
    console.log("Response received in content script:", response);
    if (response.cookies.payerToken && response.cookies.accessToken) {
      console.log('payerToken from extension:', response.cookies.accessToken);
      await addCookieValuesToPage(response.cookies);
    } else {
      console.log('Failed to retrieve payerToken:', response.error);
    }
  }
);

async function addCookieValuesToPage(cookies) {
    try {
        const copyIconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

        const headerContainer = await waitForElement('.user-controls.top-bar__user-controls');
        console.log("Header container:", headerContainer);

        const extensionContainer = document.createElement('div');

        const idContainer = addContainerItem(
            'div', 
            'span', 
            'button', 
            `${cookies.payerToken}`, 
            cookies.payerToken, 
            'Copy ID',
            'gipalti-id_container'
        );

        const accessTokenContainer = addContainerItem(
            'div', 
            'span', 
            'button', 
            "AccessToken", 
            cookies.accessToken, 
            'Copy Access Token',
            'gipalti-access_token_container'
        );
        

        extensionContainer.appendChild(idContainer);
        extensionContainer.appendChild(accessTokenContainer);
        headerContainer.appendChild(extensionContainer);

        extensionContainer.classList.add('gipalti-extension_container');
 
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
                console.log("Element found:", element);
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

function addContainerItem(
    containerTag, 
    textElementTag, 
    buttonElementTag, 
    textToDisplay, 
    textToCopy, 
    copyTooltip,
    containerClassName
) {
    const copyIconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    const container = document.createElement(containerTag);
    const textElement = document.createElement(textElementTag);
    const copyButton = document.createElement(buttonElementTag);

    textElement.textContent = textToDisplay;
    
    copyButton.innerHTML = copyIconSvg;
    copyButton.style.marginLeft = '2px';
    copyButton.style.cursor = 'pointer';
    copyButton.title = copyTooltip;

    container.appendChild(textElement);
    container.appendChild(copyButton);

    addCopyButtonListener(copyButton, textToCopy);

    container.classList.add(containerClassName);
    copyButton.classList.add('gipalti-copy_button');


    return container
}

function addCopyButtonListener(button, textToCopy) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(textToCopy)
    })
}
