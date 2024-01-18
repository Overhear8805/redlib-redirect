function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function save(e) {
  e.preventDefault();
	console.log(document.getElementById("instance").value)
  browser.storage.sync.set({
    instance: document.getElementById("instance").value
  });

	document.getElementById("savebtn").textContent = "✅ Saved"
	setTimeout(
		function() {
			document.getElementById("savebtn").textContent  = "Save"
  	}, 
		1500
	);
}

function loadAvailableInstances() {
	let dropdown = document.getElementById('instance');
	dropdown.length = 0;
	dropdown.selectedIndex = 0;

	// Load from localstorage
  function setCurrentChoice(result) {
		let instance = result.instance;
		if(instance == undefined) {
			instance = "https://libreddit.privacydev.net"; // Fallback/default
		}
		let option;
	 	option = document.createElement('option');
	 	option.text = "➡️ " + instance;
	 	option.value = instance;
	 	dropdown.add(option);
		dropdown.selectedIndex = 1;
  }
  function onError(error) {
    console.log(`Error: ${error}`);
  }
  let getting = browser.storage.sync.get("instance");
  getting.then(setCurrentChoice, onError);
	
	// Load from github
	const url = 'https://raw.githubusercontent.com/redlib-org/redlib-instances/main/instances.json';
	fetch(url)  
	  .then(  
	    function(response) {  
	      if (response.status !== 200) {  
	        console.warn('Looks like there was a problem. Status Code: ' + 
	          response.status);  
	        return;  
	      }
	
	      response.json().then(function(data) {  
	      	let option;
					data = data.instances;
	    
	    		for (let i = 0; i < data.length; i++) {
							const url = data[i].url;
							const country = data[i].country;
							if (url != null){
	      	    	option = document.createElement('option');
	      		  	option.text = getFlagEmoji(country) + " " + url;
	      		  	option.value = url;
	      		  	dropdown.add(option);
							}
	    		}    
	      });  
	    }  
	  )  
	  .catch(function(err) {  
	    console.error('Fetch Error -', err);  
	  });
}
document.querySelector("form").addEventListener("submit", save);

document.addEventListener("DOMContentLoaded", loadAvailableInstances);
document.addEventListener("DOMContentLoaded", restoreOptions);
