let translateText = (e) => {
	e.preventDefault();

	let inputText = document.getElementById('translate-text').value;
	let translateTo = document.getElementById('select-translate-to').value;

    callEventPageMethod('getContent', inputText, translateTo, response => {
        document.getElementById('translated-text').innerHTML = response;	
    });	

}

let callEventPageMethod = (method, data, toValue, callback) => {
	let responseTextElement = document.getElementById('translated-text');
	if (isNotEmpty(data)) {		
		let encodedText = encodeURIComponent(data);
		chrome.runtime.sendMessage({ method: method, data: encodedText, selectTo: toValue }, response => {
			responseTextElement.classList.remove('error');
			if(typeof callback === 'function') {
				callback(response);
			}
		});	
	} else {		
		responseTextElement.classList.add('error');
		localStorage.setItem('translatedText', 'Please provide a text to be translated');
		let response = localStorage.getItem('translatedText');
		if(typeof callback === 'function') {
			callback(response);
		}		
	}

}

let getAllGoogleLangCodes = (method, callback) => {
	chrome.runtime.sendMessage({ method: method }, response => {
		if (typeof callback === 'function') {
			callback(response);
		}
	});
}

let isNotEmpty = (input) => {
	return input.trim() !== '';
}

window.addEventListener('load', function() {
	let selectOptions = document.getElementById('select-translate-to');
	getAllGoogleLangCodes('getLangCodes', response => {
		let languages = JSON.parse(response);
		languages.map((lang, index) => {
			let myOption = document.createElement('option');
			myOption.text = lang.name;
			myOption.value = lang.language;
			selectOptions.add(myOption);
			if (lang.language === 'bg') {
				selectOptions.selectedIndex = index;
			}
		});

	});

	let translateForm = document.getElementById('translate-form');
	translateForm.addEventListener('submit', translateText);	
});
