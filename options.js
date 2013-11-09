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

document.addEventListener('DOMContentLoaded', restore_options);

