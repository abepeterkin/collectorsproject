/* generate random background image */
window.onload = function() {
	var numImages = 4;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}

var searchbar = $("#search");


$(document).ready(function(){

	var span = document.getElementsByClassName("close")[0];

	if (email !== "undefined") {
		$("#dropbtn").html(firstname);
		$("#signIn").hide();
		$("#signUp").hide();
	} else {
		$("#dropdown").hide();
	}

	/* opens signup modal */
	$("#signUp").click(function() {
	    $("#signUpModal")[0].style.display = "flex";
		$("#signUpModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	/* opens signin modal */
	$("#signIn").click(function() {
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	/* opens upload modal */
	$("#upload").click(function() {
	    $("#uploadModal")[0].style.display = "flex";
		$("#uploadModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	/* redirects to signin modal */
	$("#signin_redirect").click(function() {
		$("#signUpModal")[0].style.display = "none";
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});


	/* close modals */
	$(document).click(function(event) {
    	if (event.target == $("#signUpModal")[0]) {
			$("#signUpModal")[0].style.display = "none";
		}

		if (event.target == $("#signInModal")[0]) {
			$("#signInModal")[0].style.display = "none";
		}

		if (event.target == $("#objectModal")[0]) {
			$("#objectModal")[0].style.display = "none";
		}

		if (event.target == $("#uploadModal")[0]) {
			$("#uploadModal")[0].style.display = "none";
		}
	});


	/* on search */
	$("#search").on("change", function(event){

		/* this block of code is for hiding and shifting elements on the main page */
			$("#top").hide();

	    	document.getElementById("body_text").display="block";
		    document.getElementById("body_text").style.top="75px";

		    document.getElementById("header").style.height = "50px";


		    document.getElementById("wow_title").style.fontSize = "20px";
		    document.getElementById("about").style.fontSize = "15px";
		    document.getElementById("signIn").style.fontSize = "15px";
		    document.getElementById("signUp").style.fontSize = "15px";

		    document.getElementById("dropbtn").style.fontSize = "15px";

		    document.getElementById("upload").style.fontSize = "15px";
		    document.getElementById("profile").style.fontSize = "15px";
		    document.getElementById("signOut").style.fontSize = "15px";

		    document.getElementById("search_results").style.visibility="visible";
		    document.getElementById("search_results").style.top="20px";
		    document.getElementById("search_results").style.height="600px";

		/******/


		/* get search results */
		$("#search_results").html("");
		if ($("#search").val() !== "") {

			$.post("search/" + $("#search").val(), function(result){
				var resultObjects = JSON.parse(result);
				for (var key in resultObjects) {
					if (resultObjects.hasOwnProperty(key)) {
      					var obj = resultObjects[key];
							console.log(JSON.stringify(obj));
							var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
							$("#search_results").append(resultHTML);
					}
				}
			});
		}
	});


	/* on clicking a search result */
	$(document).on('click', ".search_result", function(event) {

		var obj = {
			_id : $(this).attr("data-id"),
			affiliation: $(this).attr("data-affiliation"),
			name : $(this).attr("data-name"),
			Provenance : $(this).attr("data-provenance")
		}

		var modalHTML = new EJS({url: '../pages/artifact.ejs'}).render(obj);
		$("#object_body").html(modalHTML);
		$("#object_map").hide();

		$("#objectModal")[0].style.display = "flex";
		$("#objectModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";

		var table_height = $("#artifact_table").height();
		$("#object_body").height(table_height);
	});


	/* on mousing over a search result */
	$(document).on('mouseover', ".search_result", function(event) {
		$('body').css('cursor','pointer');
	});

	/* mouse leaves a search result */
	$(document).on('mouseleave', ".search_result", function(event) {
		$('body').css('cursor','default');
	});


	/* uploading a file */
	$('#upload_body').submit(function(event) {
		event.preventDefault();
		var data = new FormData();
		data.append('provenancecolumn', $('input[name=provenancecolumn]').val());
		data.append('namecolumn', $('input[name=namecolumn]').val());
		data.append('ignoreheader', $('input[name=ignoreheader]').val());
		data.append('file', $('input[type=file]')[0].files[0]);
		console.log($('input[type=file]')[0].files[0]);
		$(this).html("Uploading...");
		$.ajax({
            url: '/upload',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
				$('#upload_body').html(data);
			}
		});
	});
});
