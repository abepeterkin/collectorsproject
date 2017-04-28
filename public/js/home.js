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

	if (username === "") {
		$("#username").hide();
		$("#profile").hide();
		$("#signOut").hide();
		$("#upload").hide();
	} else {
		$("#profile").html(username);
		$("#signIn").hide();
		$("#signUp").hide();
	}

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

});
