function getTranslation(w, target) {
  var xml = "";
  var results = "";

  $.ajax({
    dataType: "xml",
    url: "http://api.wolframalpha.com/v2/query?appid=4KJG8A-T9U3UY2EPT&input=translate%20" + w + "%20from%20french%20to%20english&format=image,plaintext",
    data: null,
    success: function(data) {
     results = $(data).find("pod").last();
     $(target).children('.tooltip').text(results.find("plaintext").text().split(' ').splice(0,3).join(' ')); 
    },
    error: function(data) { 
      console.log('ERROR');
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
		var txt = $(event.target).text();

		$(event.target).html(txt + "<span class=\"tooltip\">Loading...</span>");

		wordToTranslate = txt; 
		getTranslation(wordToTranslate, event.target, lang);

	  }, function(event) {
		$('.tooltip').remove();
	  })
	}
})