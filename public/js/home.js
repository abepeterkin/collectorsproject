$(document).ready(function(){

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
			$("#usernameDropdown").hide();
			$("#profile").hide();
			$("#signOut").hide();
			$("#upload").hide();
		}
	}

	function background() {
		var numImages = 2;
		var randomNumber = Math.floor(Math.random() * numImages) + 1;
		$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
	}
});