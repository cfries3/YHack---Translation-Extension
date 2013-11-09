chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = request.text;
		var words = [ ["computer", "ordinateur"], ["memory", "memoria"], ["hardware", "hardware"] ];
		for (var i = 0; i < words.length; i++) {
			if (words[i][0] == words[i][1]) { 
				continue; 
			}
			
			while (response.search(words[i][0]) != -1) {
				response = response.replace(words[i][0], "<span class='foreign'>" + words[i][1] + "</span>");
			}
		}
		sendResponse({ translation: response });
});
