$(document).ready(function(){

var modal = false;
var results = false;
var username = "";

background();
checkUser();
buttonFunctions();

	function buttonFunctions() {
		if (modal == false) {
			
		/************************************/
		/*			Signup button			*/
		/************************************/
			$("#signUp").click(function() {
				modal = true;
				$.post("signup", function(data){
					$("#modalBox").html(data);
					$("#modal").fadeIn();
				});
			}); 
		
		/************************************/
		/*	Redirect to signup from login	*/
		/************************************/
			$("#signUpHere").click(function() {
				modal = true;
				$("#modal").fadeOut(function(){
					$.post("signup", function(data){
						$("#modalBox").html(data);
						$("#modal").fadeIn();
					});
				});
			});
	
		/************************************/
		/*	Redirect to signup from login	*/
		/************************************/
			$("#signIn").click(function() {
				modal = true;
				$.post("login", function(data){
					$("#modalBox").html(data);
					$("#modal").fadeIn();
				});
			});
	
		/************************************/
		/*				Upload 				*/
		/************************************/
			$("#upload").click(function() {
				modal = true;
				$.post("upload", function(data){
					console.log(data);
				});
			});
	
		
		/************************************/
		/*			Profile Modal			*/
		/************************************/
			$("#menu_item #profile").click(function() {
				modal = true;
				$.post("profile", function(data){
					$("#modal").html(data).fadeIn();
					modal = false;
				});
			});
		
		/************************************/
		/*			Search Modal			*/
		/************************************/
			$("#search").keyup(function(event){
				modal = true;
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
				}
			});
			
		/************************************/
		/*			Exit modal boxes		*/
		/************************************/			
			$(document).click(function(event) {
				if (event.target == $("#modal")[0]) {
					if (results == true) {
						$("#body_words").show();
					}
					$("#modal").fadeOut();
				}
			});
			modal = false;
		}
	}

	function checkUser() {
		if (username === "") {
			$("#username").hide();
			$("#profile").hide();
			$("#signOut").hide();
			$("#upload").hide();
		} else {
			$("#profile").html(username + "'s profile");
			$("#signIn").hide();
			$("#signUp").hide();
		}
	}

	function background() {
		var numImages = 2;
		var randomNumber = Math.floor(Math.random() * numImages) + 1;
		$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
	}
});