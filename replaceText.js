$( document ).ready(function() {
	chrome.runtime.sendMessage({ "text": document.getElementsByTagName("body")[0].innerHTML }, function(response) {
		document.getElementsByTagName("body")[0].innerHTML = response.translation;
	});
	
});
