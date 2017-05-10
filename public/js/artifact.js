var text = "";
var id = $("#objectID").attr('data-id');
console.log("ARTIFACT.JS: id is " + id);

$('.artifact-modal').bind('contextmenu', function(e) {
    return false;
}); 

highlight(id);

function highlight(id) {
	$.get("/mark/person/" + id, function(result) {
		if (result.length = 0) {
			console.log("Nothing to highlight");
		} else {
			var resultObjects = JSON.parse(result);
			for (var key in resultObjects) {
				if (resultObjects.hasOwnProperty(key)) {
					var obj = resultObjects[key];
					var objPersons = $.unique(obj.Persons)
					for (var i = 0; i < objPersons.length; i++) {
						mark(objPersons[i], $("#artifact_provenance"));
					}
				}
			}
		}
	});
	$.get("/mark/location/" + id, function(result) {
		if (result.length = 0) {
			console.log("Nothing to highlight");
		} else {
			var resultObjects = JSON.parse(result);
			for (var key in resultObjects) {
				if (resultObjects.hasOwnProperty(key)) {
					var obj = resultObjects[key];
					var objPersons = $.unique(obj.Locations)
					for (var i = 0; i < objPersons.length; i++) {
						mark(objPersons[i], $("#artifact_provenance"));
					}
				}
			}
		}
	});
}

function flag() {

}

function getSelectionText() {
	if (window.getSelection) {
		if (window.getSelection() != "") {
			text = window.getSelection().toString();
			mark(window.getSelection(), $("#artifact_provenance"));
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
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

/*$(document).bind("mousedown", function (e) {
	if (!$(e.target).parents(".custom-menu").length > 0) {
		$(".custom-menu").hide(100);
    }
});*/

$(".custom-menu li").click(function(){
	switch($(this).attr("data-action")) {
		case "first":
			$.post("/mark/person/" + id + "/" + text, function(result){
				console.log("Got it back here.");
			});
			break;
		case "second":
			$.post("/mark/location/" + id + "/" + text, function(result){
				console.log("Got it back here2.");
			});
			break;
    }
	$(".custom-menu").hide(100);
});

$("#delete_artifact").on("click", function(event) {
	console.log("ID " + id);
	$.post("/deleteartifact/" + id, function(result) {
		window.location = "/profile";
	});
});