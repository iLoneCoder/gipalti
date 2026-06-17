// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPayerToken') {

        const targetUrl = "https://hub.tipalti.com";
        const cookieName = "PayerToken";
        
        chrome.cookies.get({ url: targetUrl, name: cookieName }, (cookie) => {
          if (cookie) {
            console.log("cookie:", cookie);
            console.log("Cookie value:", cookie.value);
            console.log("Is it HttpOnly?", cookie.httpOnly);

            sendResponse({ 
                success: !!cookie,
                token: cookie.value 
            });
          } else {
            console.log("Cookie not found.");
            sendResponse({ 
                success: false,
                token: null 
            });
          }

        });
        // Return true to indicate you wish to send a response asynchronously
        return true;
    }
})
