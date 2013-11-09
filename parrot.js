function getTranslation(w, target) {
  var xml = "";
  var results = "";

  var bool = setupdb();

  var url = "http://api.wolframalpha.com/v2/query?appid=4KJG8A-T9U3UY2EPT&input=translate%20" + w + "%20from%20" + localStorage.native_language + "%20to%20" + localStorage.foreign_language + "&format=plaintext";
  console.log(url);
		
  $.ajax({
    dataType: "xml",
    url: "http://api.wolframalpha.com/v2/query?appid=4KJG8A-T9U3UY2EPT&input=translate%20" + w + "%20from%20" + "french" + "%20to%20" + "english" + "&format=plaintext",
    data: null,
    success: function(data) {
     results = $(data).find("pod").last();

     //separate words for database entry
     var nativeW = results.find("plaintext").text();
     nativeW = nativeW.replace(/ *\([^)]*\) */g, "");
     nativeW = nativeW.split(' | ');
     console.log(nativeW);

    //enter in three entries for definitions is they exist
     for (var i = 0; i < 3; i++) {
        if (nativeW[i] != null && nativeW[i] != "") {
        
            console.log(nativeW[i]);

            checkDB("french", 
                    "english", 
                    nativeW[i].trim(), 
                    "french", 
                    w, location.href);
        }
    }

    readObjectStore("french");


     $(target).children('.tooltip').text(results.find("plaintext").text().split(' ').splice(0,3).join(' ')); 
    },
    error: function(data) { 
      console.log('Error');
    }
  });
}


$(document).ready(function() {
	setupdb();
})

function start() {
	var lang = $( 'html' ).attr('lang');
	if (lang == "en") {
		replaceWords();
	} else {
	  // Isolate every words by a span
	  $('p').lettering('words');
		
	  // Get translation fr
	  var wordToTranslate = "";
	  
	  $( ".word" ).hoverIntent(function(event) {
      
      // Word to translate
      var word = $(event.target).text();

      // Add Loading tooltip
      $(event.target).html(word + "<span class=\"tooltip\"><div id=\"loadingProgressG\"><div id=\"loadingProgressG_1\" class=\"loadingProgressG\"></div></div> </span>");
      
      // Remove any trailing punctuation without saving the text into the page
      word = word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
		
      // Translate word
      getTranslation(word, event.target);

	  }, function(event) {
      $('.tooltip').remove();
	  })
	}
//})
}
