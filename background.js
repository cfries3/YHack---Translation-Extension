chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = request.text;
		var words = [ ["computer", "ordinateur"], ["memory", "memoria"], ["hardware", "hardware"], ["direct", "test"], ["table", "fail"] ];
		for (var i = 0; i < words.length; i++) {
			if (words[i][0] == words[i][1]) { 
				continue; 
			}
			
			var uppercase = [ words[i][0].charAt(0).toUpperCase() + words[i][0].slice(1), words[i][1].charAt(0).toUpperCase() + words[i][1].slice(1) ]
			
			// First replace all tags by a marker $$$ and ^^^.
			while (response.search("<" + words[i][0]) != -1 && response.search(words[i][0] + ">") != -1) {
				response = response.replace("<" + words[i][0], "$$$");
				response = response.replace(words[i][0] + ">", "^^^");
			}
			while (response.search(words[i][0]) != -1 && response.search(uppercase[0]) != -1) {
				response = response.replace(words[i][0], "<span class='foreign'>" + words[i][1] + "</span>");
				response = response.replace(uppercase[0], "<span class='foreign'>" + uppercase[1] + "</span>");
			}
			// Fix the tags
			while (response.search("$$$") != -1 && response.search("^^^") != -1) {
				response = response.replace("$$$", "<" + words[i][0]);
				response = response.replace("^^^", words[i][0] + ">");
			}
		}
		sendResponse({ translation: response });
});
