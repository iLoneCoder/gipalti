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
    } else if (request.action === 'open_ep_request') {
      console.log("open_ep_request action received in background.js");
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          const url = tabs[0].url;
          const currnetId = tabs[0].id;
          const splitUrl = url.split('dashboard/purchase-request/request/');
          const idOfEpRequest = splitUrl.length > 1 ? splitUrl[1] : "";

          if (!!idOfEpRequest) {
            const newUrl = `https://hub.tipalti.com/dashboard/purchase-request/request/${idOfEpRequest}`;

            chrome.tabs.update(currnetId, { url: `${splitUrl[0]}dashboard/procurement/purchases`});
            chrome.tabs.create({ url: newUrl, active: true })
          }

          console.log("Current tab URL:", url);
        })
    }
})
