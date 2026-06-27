// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPayerToken') {

        const targetUrl = "https://hub.tipalti.com";
        
        chrome.cookies.getAll({ url: targetUrl }, (cookie) => {
          if (cookie) {
            console.log("cookie:", cookie);
            console.log("Cookie value:", cookie.value);
            console.log("Is it HttpOnly?", cookie.httpOnly);
            
            const payerToken = cookie.find(c => c.name === 'PayerToken')?.value;
            const accessToken = cookie.find(c => c.name === 'Tipalti.AccessToken')?.value;

            const cookies = {
              payerToken,
              accessToken
            }
            
            sendResponse({ 
                success: !!cookies.payerToken,
                cookies 
            });
          } else {
            console.log("Cookie not found.");
            sendResponse({ 
                success: false,
                cookies: null 
            });
          }

        });
        // Return true to indicate you wish to send a response asynchronously
        return true;
    }
})
