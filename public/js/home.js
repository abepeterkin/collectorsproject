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
var modal = false;
var results = false;

background();
checkUser();

if (username != "") {
	$("#signIn").hide();
	$("#signUp").hide();
}

	if (modal == false) {
		/************************************/
		/*			Signup button			*/
		/************************************/
		$("#signUp").click(function(){
			modal = true;
			$("#modalBox").load("pages/signup.ejs");
			$("#modal").fadeIn();
		});

		/************************************/
		/*	Redirect to signup from login	*/
		/************************************/
		$("#signIn").click(function() {
			modal = true;
			$("#modalBox").load("pages/signin.ejs");
			$("#modal").fadeIn();
		});

		/************************************/
		/*				Upload 				*/
		/************************************/
		$("#upload").click(function() {
			modal = true;
			$("#modalBox").load("pages/upload.ejs");
			$("#modal").fadeIn();
		});

		/************************************/
		/*			Profile Modal			*/
		/************************************/
		$("#profile").click(function() {
			modal = true;
			$("#modalBox").load("pages/profile.ejs");
			$("#modal").fadeIn();
		});
		
		/************************************/
		/*				Sign out			*/
		/************************************/
		$("#signOut").click(function() {
			modal = false;
			window.location.href = "/logout";
		});

		/************************************/
		/*			Search Modal			*/
		/************************************/
		$("#search").keyup(function(event){
			if(event.keyCode == 13){
				$("#body_words").fadeOut();
				$("#search_results").html("");
				if ($("#search").val() !== "") {
					$.post("search/" + $("#search").val(), function(result){
						var resultObjects = JSON.parse(result);
						for (var key in resultObjects) {
							if (resultObjects.hasOwnProperty(key)) {
     						var obj = resultObjects[key];
								var resultHTML = new EJS({
									url: '../pages/searchresult.ejs'
								}).render(obj);
								$("#search_results").append(resultHTML);
							}
						}
					});
				}
								$("#search").animate({
					bottom: '500px'
				});
				$("#search").ajaxComplete(function() {
					$("#search").prop('disabled', false);
				});
			}
			/*modal = true;
			results = true;
				if(event.keyCode == 13){
					query = $("#search").val();
					$("#body_words").hide();
					$("#body_text").display = "block";
					console.log($("#body_text"));
//					$("#body_text").style.top = "75px";
//					$("#header").style.height = "50px";
					$.post("search/" + query, function(data){
						$("#modal").html(data).fadeIn();
					});
				}*/
		});
		
		/************************************/
		/*			Exit modal boxes		*/
		/************************************/
		$(document).click(function(event) {
			if (event.target == $("#modal")[0]) {
				$("#modal").fadeOut();
				modal = false;
			}
		});
	}

	function checkUser() {
		if (username === "") {
			$("#username").hide();
			$("#profile").hide();
			$("#signOut").hide();
			$("#upload").hide();
			$("#dropdown").hide();
		}
	}

	function background() {
		var numImages = 2;
		var randomNumber = Math.floor(Math.random() * numImages) + 1;
		$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
	}
});