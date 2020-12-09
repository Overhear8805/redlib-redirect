function onError(error) {
  console.log(`Error: ${error}`);
}

function onSettingsRead(item) {
  let instance = "teddit.net";
  if (item.instance) {
    instance = item.instance;
  }

  const original_url = window.location.href
  const new_url = original_url.replace('old.reddit.com', instance).replace('reddit.com', instance)
  window.location.replace(new_url)
}

let getting = browser.storage.sync.get("instance");
getting.then(onSettingsRead, onError);
