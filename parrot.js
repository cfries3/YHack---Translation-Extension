function getTranslation(w, target) {
  var xml = "";
  var results = "";

  $.ajax({
    dataType: "xml",
    url: "http://api.wolframalpha.com/v2/query?appid=4KJG8A-T9U3UY2EPT&input=translate%20" + w + "%20from%20" + localStorage.native_language + "%20to%20" + localStorage.foreign_language + "&format=plaintext",
    data: null,
    success: function(data) {
     results = $(data).find("pod").last();
     $(target).children('.tooltip').text(results.find("plaintext").text().split(' ').splice(0,2).join(' ')); 
    },
    error: function(data) { 
      console.log('Error');
    }
  });
}

$(document).ready(function() {
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
})
