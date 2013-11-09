chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = request.text;

        //fetch foreign language setting
        var foreignLang = "french";
        var words = readObjectStore(foreignLang);

        //iterate over list of words
		for (var i = 0; i < words.length; i++) {
            var curObj = words[i];
            //check for equivalence
			if (curObj["nativeWord"] == curObj["foreignWord"]) { 
				continue; 
			}
			
			var uppercase = [ curObj["nativeWord"].charAt(0).toUpperCase() + curObj["nativeWord"].slice(1), 
                              curObj["foreignWord"].charAt(0).toUpperCase() + curObj["foreignWord"].slice(1) ];
			
			// First replace all tags by a marker ### and @@@.
			while (response.search("<" + curObj["nativeWord"]) != -1 || 
                   response.search(curObj["nativeWord"] + ">") != -1) {

				response = response.replace("<" + curObj["nativeWord"], "###");
				response = response.replace(curObj["nativeWord"] + ">", "@@@");
			}

			while (response.search(curObj["nativeWord"]) != -1 || 
                   response.search(uppercase[0]) != -1) {

				response = response.replace(curObj["nativeWord"], "<span class='foreign'>" + curObj["foreignWord"] + "</span>");
				response = response.replace(uppercase[0], "<span class='foreign'>" + uppercase[1] + "</span>");
			}

			// Fix the tags
			while (response.search("###") != -1 || response.search("@@@") != -1) {
				response = response.replace("###", "<" + curObj["nativeWord"]);
				response = response.replace("@@@", curObj["nativeWord"] + ">");
			} 
		}

		sendResponse({ translation: response }); 
});
