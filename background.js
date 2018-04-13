const hostUrl = 'https://testlngapi.herokuapp.com/translate';
const googleApiLanguagesUrl = 'https://translation.googleapis.com/language/translate/v2/languages';
const apiKey = 'AIzaSyCLcSvC6VhTwp4pNelp7_aA8Cm-thAXpiQ';

chrome.runtime.onMessage.addListener(	
	function(request, sender, sendResponse) {
		if (request.method === 'getContent') {
			let data = request.data;
			let selectTo = request.selectTo;
			getTranslatedText(data, selectTo).then(response => {
				sendResponse(response);
			});
		} else if (request.method === 'getLangCodes') {
			setGoogleLangCodes(() => {
				// get the google lang codes from the local storage of the extension and send it back to content script
				sendResponse(getGoogleLangCodes());
			});
		}	
		return true;		
});

let setGoogleLangCodes = (callback) => {
	fetch(`${googleApiLanguagesUrl}?key=${apiKey}&target=en`)
	.then(res => res.json())
	.catch(error => error)
	.then(parsedRes => {	
		// set lang codes in local storage of the extension
		localStorage.setItem('langCodes', JSON.stringify(parsedRes.data.languages));
		if (typeof callback === 'function') {
			callback();
		}
	});
}

let getGoogleLangCodes = () => {
	let response = localStorage.getItem('langCodes');
	return response;
}


let getTranslatedText = (data, selectTo) => {
	return	fetch(`${hostUrl}?text=${data}&to=${selectTo}`)
			.then(res => {
				return res.json();
			})
			.catch(error => error);
}