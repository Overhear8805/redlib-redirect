/*
Teddit Redirect
*/
async function tedditRedirectHandler(details) {

	// Default URL of teddit instance
	let tedditUrl = "https://teddit.net";

	// Target URL of the captured webRequest event
	const initialTargetUrl = details.url;

	// Try to get the teddit instance URL from sync storage
	const result = await browser.storage.sync.get("instance");

	if(result.instance !== undefined) {
		tedditUrl = "https://" + result.instance;
	}

	const rewrittenTargetUrl = initialTargetUrl.replace(
		/^http(?:s)?:\/\/(?:(?:www|old).)?reddit.com(?:\/)?(.*)/i,
		tedditUrl.replace(/(\/+)$/, "") + "/$1"
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
	tedditRedirectHandler, webRequestFilter, ["blocking"]);
