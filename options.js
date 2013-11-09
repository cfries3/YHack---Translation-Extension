$('#news').click(function(){
  var backup_text = $('#news').html();
  var suggestions = ["cuisine", "gouvernement", "chèvre", "football", "médecins", "histoire", "Colorado", "Soleil", "astronomy", "Moon"];

  $('#news').html("Loading...");
  get_articles(suggestions[Math.floor(Math.random() * suggestions.length)], 'french');

  setTimeout(function() {
    $('#news').html(backup_text);
  }, 1000);  
});

function save_options() {
	var selectnative = document.getElementById("nativelang");
	var nativelang = selectnative.children[selectnative.selectedIndex].value;
	
	var selectforeign = document.getElementById("foreignlang");
	var foreignlang = selectforeign.children[selectforeign.selectedIndex].value;
	
	var status = document.getElementById("status");
	
	if (nativelang ==  foreignlang) {
		status.innerHTML = "Foreign language must be different from native language."
		return;
	}
	else {
		localStorage["native_language"] = nativelang;
		localStorage["foreign_language"] = foreignlang;
		var cookie = "native=" + nativelang + ";foreign=" + foreignlang + ";";
		document.cookie = cookie;
		status.innerHTML = "Options saved."
	}

}

function restore_options() {
	document.querySelector('#save').addEventListener('click', save_options);
	
	var nativelang = localStorage["native_language"];
	var foreignlang = localStorage["foreign_language"];
	if (!nativelang || !foreignlang) {
		if(!nativelang) {
			localStorage["native_language"] = "english";
			nativelang = "english";
		}
		if(!foreignlang) {
			localStorage["foreign_language"] = "french";
			foreignlang="french";
		}
	}
	
	var select = document.getElementById("nativelang");
	for (var i = 0; i < select.children.length; i++) {
		var language = select.children[i];
		if (language.value == nativelang) {
			language.selected = "true";
			break;
		}
	}
	
	var select = document.getElementById("foreignlang");
	for (var i = 0; i < select.children.length; i++) {
		var language = select.children[i];
		if (language.value == foreignlang) {
			language.selected = "true";
			break;
		}
	}
}

function get_articles(word, inlanguage) {
	
	var langcode = new Object();
	langcode['english'] = 'en-US';
	langcode['french'] = 'fr-CA';
	langcode['norwegian'] = 'nb-NO';
	langcode['spanish'] = 'es-ES';
	
	var articles = [];
	
	$.bingSearch({
	    query: word,
	    appKey: 'im9RWof1FQx0l+0VNxOninLgEtmC7VVUHUU9DwOKU6U=',
		targetlang: langcode[inlanguage],
	    beforeSearchResults: function(data) {
	        // Use data.hasMore, data.resultBatchCount
	    },
	    // Optional: Function is called once per result in the current batch
	    searchResultIterator: function(data) {
			var a = {};
			a['title'] = data['Title'];
			a['url'] = data['Url'];
			a['description'] = data['Description'];
			articles.push(a);
	        // Use data.ID, data.Title, data.Description, data.Url, data.DisplayUrl, data.Metadata.Type (check for undefined)
	    },
	    afterSearchResults: function(data) {
        var $list = $('#articles');
        $list.html("<p>Articles related to <span class='text bold'>" + word + "</span> in <span class='text bold'>" + inlanguage + "</span></p><br/>");
        for (var i = 0; i < 3; i++) {
          var base = articles[i]['url'].split('/');
          $list.append('<li class="text normal"><a target="_blank" href="' + articles[i]['url'] + '">' + articles[i]['title'] + '</a> - <span class="text book">' + base[2].substring(4,50) + '</span></li>');
        }
	    },
	    fail: function(data) {
	        console.log("Failed again.")
	    }
	
	});
}

document.addEventListener('DOMContentLoaded', restore_options);


