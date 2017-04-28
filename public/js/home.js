$(document).ready(function(){

var modal = false;
var results = false;

background();
checkUser();

var searchbar = $("#search");

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
}

	if (modal == false) {
		/************************************/
		/*			Signup button			*/
		/************************************/
		$("#signUp").click(function(){
			modal = true;
			$.ajax({
				type: "GET",
				url: "/signup",
				success: function(data){
					$("#modalBox").html(data);
					$("#modal").fadeIn();
				}
			});
		});

		/************************************/
		/*	Redirect to signup from login	*/
		/************************************/
		$("#signIn").click(function() {
			modal = true;
			$.ajax({
				type: "GET",
				url: "/signin",
				success: function(data){
					$("#modalBox").html(data);
					$("#modal").fadeIn();
				}
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
			$("#profile").click(function() {
				modal = true;
				$.post("profile", function(data){
					$("#modal").html(data).fadeIn();
				});
			});

		/************************************/
		/*			Search Modal			*/
		/************************************/
			searchbar.keyup(function(event){
				$("#search_results").html("");
				if (searchbar.val() !== "") {
					$.post("search/" + searchbar.val(), function(result){
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
					if (results == true) {
						$("#body_words").show();
					}
					$("#modal").fadeOut();
					modal = false;
					console.log(modal);
				}
			});
		console.log(modal);
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
