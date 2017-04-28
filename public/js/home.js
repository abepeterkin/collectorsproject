window.onload = function() {
	var numImages = 2;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}


var searchbar = $("#search");


$(document).ready(function(){

	console.log("USER: " + username);

	$("#tester").html(username);

	var span = document.getElementsByClassName("close")[0];

$('#search_details').click(function(){
  if(this.checked) {
  	alert("To Search for an exact phrase, put the query in quotes. For instance, if you wanted to find 'John Smith' only, type into the search box \"John Smith\" with the quotes. \n\nTo exclude a term, use -term. For instance, if you wanted to exclude Smith, type in \"John -Smith\" without the quotes. This is case insensitive, so \"John -smith\" is the same query.");
  }
});

if (username != "") {
	$("#dropbtn").html(username);
	$("#signIn").hide();
	$("#signUp").hide();
	// $("#signOut").hide();
} else {
	$("#dropdown").hide();
}
// =======
// 	if (username === "") {
// 		$("#username").hide();
// 		$("#profile").hide();
// 		$("#signOut").hide();
// 		$("#upload").hide();
// 	} else {
// 		$("#profile").html(username);
// 		$("#signIn").hide();
// 		$("#signUp").hide();
// 	}
// >>>>>>> e2fb8bd683e78660d5a266d582f1afcc5bd1f5c4

	$("#signUp").click(function() {
	    $("#signUpModal")[0].style.display = "flex";
		$("#signUpModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	$("#signIn").click(function() {
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	$("#upload").click(function() {
	    $("#uploadModal")[0].style.display = "flex";
		$("#uploadModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});
	
	$(document).click(function(event) {
    	if (event.target == $("#signUpModal")[0]) {
			$("#signUpModal")[0].style.display = "none";
		}
	});

	$(document).click(function(event) {
    	if (event.target == $("#signInModal")[0]) {
			$("#signInModal")[0].style.display = "none";
		}
	});

	$(document).click(function(event) {
    	if (event.target == $("#objectModal")[0]) {
			$("#objectModal")[0].style.display = "none";
		}
	});

	$(document).click(function(event) {
    	if (event.target == $("#uploadModal")[0]) {
			$("#uploadModal")[0].style.display = "none";
		}
	});

	$("#search").keyup(function(event){

			//document.getElementById("body_words").remove();
			$("#top").hide();
	    	document.getElementById("body_text").display="block";
		    document.getElementById("body_text").style.top="75px"; 

		    document.getElementById("header").style.height = "50px";


		    document.getElementById("nav_bar_title").style.fontSize = "20px";
		    document.getElementById("news").style.fontSize = "15px";
		    document.getElementById("about").style.fontSize = "15px";
		    document.getElementById("signIn").style.fontSize = "15px";
		    document.getElementById("signUp").style.fontSize = "15px";

		    document.getElementById("upload").style.fontSize = "15px";
		    document.getElementById("profile").style.fontSize = "15px";
		    document.getElementById("signOut").style.fontSize = "15px";

		    document.getElementById("search_results").style.visibility="visible";
		    document.getElementById("search_results").style.top="20px";
		    document.getElementById("search_results").style.height="600px";


		$("#search_results").html("");
				if ($("#search").val() !== "") {

				    console.log($("#search").val());
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

			$(document).on('click', ".search_result", function(event) {
				console.log("RESULT CLICKED");

				var obj = {
					_id : $(this).attr("_id"),
					affiliation: $(this).attr("data-affiliation"),
					name : $(this).attr("data-name"),
					Provenance : $(this).attr("data-provenance")
				}

				var modalHTML = new EJS({url: '../pages/artifact.ejs'}).render(obj);
				$("#object_body").html(modalHTML);

				$("#objectModal")[0].style.display = "flex";
				$("#objectModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
			});

			$(document).on('mouseover', ".search_result", function(event) {
				console.log("RESULT MOUSEOVER");
				$('body').css('cursor','pointer');
			});

			$(document).on('mouseleave', ".search_result", function(event) {
				$('body').css('cursor','default');
			});

	function checkUser() {
		if (username === "") {
			$("#username").hide();
			$("#profile").hide();
			$("#signOut").hide();
			$("#upload").hide();
			$("#dropdown").hide();
		}
	}

});
