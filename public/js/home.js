window.onload = function() {
	var numImages = 4;
    var randomNumber = Math.floor(Math.random() * numImages) + 1;
	$("#backgroundImageID").css("background-image", "url(images/background_" + randomNumber + ".jpg");
}


var searchbar = $("#search");


$(document).ready(function(){

	console.log("USER: " + email);

	//$("#tester").html(user);

	var span = document.getElementsByClassName("close")[0];

$('#search_details').click(function(){
  if(this.checked) {
  	alert("To Search for an exact phrase, put the query in quotes. For instance, if you wanted to find 'John Smith' only, type into the search box \"John Smith\" with the quotes. \n\nTo exclude a term, use -term. For instance, if you wanted to exclude Smith, type in \"John -Smith\" without the quotes. This is case insensitive, so \"John -smith\" is the same query.");
  }
});

if (email !== "undefined") {
	$("#dropbtn").html(firstname);
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

	$("#profile").click(function() {
		loadProfileData();
	    $("#profileModal")[0].style.display = "flex";
		$("#profileModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
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

	$(document).click(function(event) {
    	if (event.target == $("#profileModal")[0]) {
			$("#profileModal")[0].style.display = "none";
		}
	});

	$("#accountInfoBtn").click(function(event) {
		setTabs();
	    $("#accountInfo")[0].style.display = "block";
		event.currentTarget.className += " active";
	});

	$("#uploadInfoBtn").click(function(event) {
		setTabs();
	    $("#uploadInfo")[0].style.display = "block";
		event.currentTarget.className += " active";
	});

	$("#objectInfoBtn").click(function(event) {
		setTabs();
	    $("#objectInfo")[0].style.display = "block";
		event.currentTarget.className += " active";
	});
	
	function loadProfileData() {
		// will need to refresh the variables in the template so that new data will be shown if changed in profile	
	}
	
	$("#editEmail").on('change', function() {
		console.log("mail");
		$.post("edit/email/" + user_id + "/" + $("#editEmail").val(), function(result){
			console.log(result);
		});
	});

	$("#editFirstName").on('change', function() {
		console.log("first name");
		$.post("edit/firstname/" + user_id + "/" + $("#editFirstName").val(), function(result){
			console.log(result);
		});
	});

	$("#editLastName").on('change', function() {
		console.log("last name");
		$.post("edit/lastname/" + user_id + "/" + $("#editLastName").val(), function(result){
			console.log(result);
		});
	});

		$("#searchSmall").on('change', function() {
			$("#profile_search_results").html("");
			$.post("search/" + $("#searchSmall").val() + "/" + user_id, function(result){
				var resultObjects = JSON.parse(result);
				for (var key in resultObjects) {
					if (resultObjects.hasOwnProperty(key)) {
      				var obj = resultObjects[key];
						console.log(JSON.stringify(obj));
						var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
						$("#profile_search_results").append(resultHTML);
					}
				}
			});
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
				$('body').css('cursor','pointer');
			});

			$(document).on('mouseleave', ".search_result", function(event) {
				$('body').css('cursor','default');
			});

			$(document).click(function(event) {
					if (event.target == $("#objectModal")[0]) {
					$("#objectModal")[0].style.display = "none";
				}
			});


function setTabs() {
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}


	$("#search").on("change", function(event){

			//document.getElementById("body_words").remove();
			$("#top").hide();
	    	document.getElementById("body_text").display="block";
		    document.getElementById("body_text").style.top="75px";

		    document.getElementById("header").style.height = "50px";


		    document.getElementById("nav_bar_title").style.fontSize = "20px";
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
