const fallbackInstance = "https://libreddit.privacydev.net";
function getAnyInstance(){
	// Load from github
	const url = 'https://raw.githubusercontent.com/redlib-org/redlib-instances/main/instances.json';
	fetch(url)  
	  .then(  
	    function(response) {  
	      if (response.status !== 200) {  
	        console.warn('Looks like there was a problem. Status Code: ' + response.status);  
	        return	fallbackInstance;
				}
	
	      response.json().then(function(data) {  
					data = data.instances;
	    		for (let i = 0; i < data.length; i++) {
						return data[i].url;
	    		}    
	      });  
	    }  
	  )  
	  .catch(function(err) {  
	    console.error('Fetch Error -', err);  
      return	fallbackInstance;
	  });
}

/*
Redirect Logic
*/
async function redirectHandler(details) {
	// Default URL of libre instance
	let newUrl = getAnyInstance();

	// Target URL of the captured webRequest event
	const initialTargetUrl = details.url;

	// Try to get the instance URL from sync storage
	const result = await browser.storage.sync.get("instance");

	if(result.instance !== undefined) {
		newUrl = result.instance;
	} else {
		// If no instance is set in localstorage, persist the one we loaded as fallback
  	browser.storage.sync.set({
  	  instance: newUrl
  	});
	}

	const rewrittenTargetUrl = initialTargetUrl.replace(
		/^http(?:s)?:\/\/(?:(?:www|old).)?reddit.com(?:\/)?(.*)/i,
		newUrl.replace(/(\/+)$/, "") + "/$1"
	);

	/*
	Return a webRequest.BlockingResponse object.
	https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/BlockingResponse
	*/
	blockingResponse = {};
	blockingResponse.redirectUrl = rewrittenTargetUrl;

	return blockingResponse;
}

/*
Target URL filter for the webRequest.onBeforeRequest event listener.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
*/
webRequestFilter = {
	urls: [
		"*://reddit.com/*",
		"*://www.reddit.com/*",
		'*://old.reddit.com/*'
	]
}

/*
Add a webRequest.onBeforeRequest event listener.
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
*/
browser.webRequest.onBeforeRequest.addListener(
	redirectHandler, webRequestFilter, ["blocking"]
);
