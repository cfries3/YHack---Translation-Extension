$(document).ready(function() {

  // Isolate every words by a span
  $('p').lettering('words');

  // Get translation fr
  var wordToTranslate;
  $('.word').mouseover(function(event) {
    
    $(event.target).addClass('tip');
    $(event.target).attr('data-tip', 'Loading');
    $('.tip').tipr();

    wordToTranslate = $(event.target).text(); 
    getTranslation(wordToTranslate, event.target);

  });
  
})

function getTranslation(w, target) {
  var xml = "";
  
  $.ajax({
    dataType: "xml",
    url: "http://api.wolframalpha.com/v2/query?appid=4KJG8A-T9U3UY2EPT&input=translate%20" + w + "%20from%20english%20to%20french&format=image,plaintext",
    data: null,
    success: function(data) {
      console.log(data);


      $(target).attr('data-tip', 'Hello');
      $('.tip').tipr();
    },
    error: function(data) { 
      console.log('ERROR');
    }
});
}
