var text = "";

highlight();

function highlight() {
	// This function should retrieve all people, places, and time values from the database and highlight them in the provenance lists
	$.get("/mark/" + id, function() {
//		mark();
	});
}

function flag() {
	
}
	
function getSelectionText() {
	if (window.getSelection) {
		text = window.getSelection().toString();
		mark(window.getSelection(), $("#artifact_provenance"));
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
}

function mark(word, element) {
    var rgxp = new RegExp(word, 'g');
    var repl = '<span class="highlighted">' + word + '</span>';
	element[0].innerHTML = element[0].innerHTML.replace(rgxp, repl);
	div = "#" + text;
	$('.highlighted').contextmenu(function (event){
		event.preventDefault();
		var parentOffset = $(this).parent().offset();
		var relX = event.pageX - parentOffset.left;
		var relY = event.pageY - parentOffset.tsop;
		$(".custom-menu").finish().toggle(100).
		css({
			top: relY + "px",
			left: relX + "px"
	    });
	});
};

$(document).bind("mousedown", function (e) {
	if (!$(e.target).parents(".custom-menu").length > 0) {
		$(".custom-menu").hide(100);
    }
});

$(".custom-menu li").click(function(){
	switch($(this).attr("data-action")) {
		case "first": 
			// Add word to person database; update search results
			break;
		case "second": 
			// Add word to time database; update search results
			break;
		case "third": 
			// Add word to place database; update search results
			break;
    }
	$(".custom-menu").hide(100);
});