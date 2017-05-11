/* generate random background image */
window.onload = function() {
	var numImages = 4;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");	
}

var searchbar = $("#search");

$(document).ready(function(){

	var span = document.getElementsByClassName("close")[0];

	$("#search_results").hide();

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

	$("#about").click(function() {
	    $("#aboutModal")[0].style.display = "flex";
		$("#aboutModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
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

		if (event.target == $("#aboutModal")[0]) {
			$("#aboutModal")[0].style.display = "none";
		}
	});


	/* on search */
	$("#search").on("change", function(event){

		/* First get search results */
		if ($("#search").val() !== "") {
			$.post("search/" + $("#search").val(), function(result){
				var resultObjects = JSON.parse(result);
				if (resultObjects.length !== 0) {
					$("#search_results").html("");
					for (var key in resultObjects) {
						if (resultObjects.hasOwnProperty(key)) {
							var obj = resultObjects[key];
								var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
								$("#search_results").append(resultHTML);
						}
					}
					render();
				} else {
					$("#search_results").html("");
					unrender();
				}
			});
		}	
		
		function render() {		
		
			// Render results	
			$("#top").hide();
			$("#body_text").animate({top: "75px"});
			$("#header").animate({height: "50px"});
			$("#wow_title").animate({fontSize: "20px"});
			$("#about").animate({fontSize: "15px"});
			$("#signIn").animate({fontSize: "15px"});
			$("#signUp").animate({fontSize: "15px"});
			$("#dropbtn").animate({fontSize: "15px"});
			$("#upload").animate({fontSize: "15px"});
			$("#profile").animate({fontSize: "15px"});
			$("#signOut").animate({fontSize: "15px"});
			$("#body_text").css('display', 'block');
			$("#search_results").animate({
				width: "90%",
				height: "100%"
			});
			$("#search_results").fadeIn();
		}
		
		function unrender() {
			$("#top").show();
			$("#header").animate({height: "100px"});
			$("#wow_title").animate({fontSize: "22px"});
			$("#about").animate({fontSize: "20px"});
			$("#signIn").animate({fontSize: "20px"});
			$("#signUp").animate({fontSize: "20px"});
			$("#dropbtn").animate({fontSize: "20px"});
			$("#upload").animate({fontSize: "20px"});
			$("#profile").animate({fontSize: "20px"});
			$("#signOut").animate({fontSize: "20px"});
			$("#body_text").animate({bottom: "20%", top: "40%"});
			$("#search_results").animate({
				width: "0px",
				height: "0px"
			});
			$("#search_results").fadeOut();
		}
	});


	/* on clicking a search result */
	$(document).on('click', ".search_result", function(event) {

		var obj = {
			id : $(this).attr("data-id"),
			affiliation: $(this).attr("data-affiliation"),
			name : $(this).attr("data-name"),
			Provenance : $(this).attr("data-provenance")
		}

		var modalHTML = new EJS({url: '../pages/artifact.ejs'}).render(obj);
		$("#object_body").html(modalHTML);
		$("#delete_artifact").hide();
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
