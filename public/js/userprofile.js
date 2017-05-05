$(document).ready(function(){
	var span = document.getElementsByClassName("close")[0];


	/* inserting user info*/
	$("#dropbtn").html(firstname);
	$("#name").html(firstname+" "+lastname);
	$("#user_email").html(email);
	$("#institution_name").html(affiliation);
	$("#user_location").html(city + ", " + country);
	


	/* opening first tab by default*/
	document.getElementById("defaultOpen").click();
	$.post("search/" + affiliation, function(result){
				$("#uploadList").html("");
				var resultObjects = JSON.parse(result);
				for (var key in resultObjects) {
					if (resultObjects.hasOwnProperty(key)) {
      				var obj = resultObjects[key];
						//console.log(JSON.stringify(obj));
						var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
						$("#uploadList").append(resultHTML);
					}
				}
		});


	/* opens upload modal */
	$("#upload").click(function() {
	    $("#uploadModal")[0].style.display = "flex";
		$("#uploadModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	/* closes upload modal */
	$(document).click(function(event) {
    	if (event.target == $("#uploadModal")[0]) {
			$("#uploadModal")[0].style.display = "none";
		}
	});

	/* opens edit profile modal */
	$("#edit_profile").click(function() {
	    $("#signInModal")[0].style.display = "flex";
		$("#signInModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});


	/* opens object modal */
	$(document).on('click', ".search_result", function(event) {

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

		var table_height = $("#artifact_table").height();
		$("#object_body").height(table_height);
	});

	$(document).on('mouseover', ".search_result", function(event) {
		$('body').css('cursor','pointer');
	});

	$(document).on('mouseleave', ".search_result", function(event) {
		$('body').css('cursor','default');
	});


	/* closes object modal */
	$(document).click(function(event) {
    	if (event.target == $("#objectModal")[0]) {
			$("#objectModal")[0].style.display = "none";
		}
	});


	/*gets uploaded objects*/
	$("#defaultOpen").click(function(event) {
		console.log("whoo");
	    $.post("search/" + affiliation, function(result){
				$("#uploadList").html("");
				var resultObjects = JSON.parse(result);
				for (var key in resultObjects) {
					if (resultObjects.hasOwnProperty(key)) {
      				var obj = resultObjects[key];
						console.log(JSON.stringify(obj));
						var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
						$("#uploadList").append(resultHTML);
					}
				}
		});
	});



	/* POST request for object search */
	$("#searchSmall").on('change', function() {
		$("#profile_search_results").html("");
		
		$.post("search/" + $("#searchSmall").val() + "/" + user_id, function(result){
			var resultObjects = JSON.parse(result);
			console.log(resultObjects); //resultObjects is empty []
			for (var key in resultObjects) {
				if (resultObjects.hasOwnProperty(key)) {
     				var obj = resultObjects[key];
					console.log(JSON.stringify(obj));
					var resultHTML = new EJS({url: '../pages/searchresult.ejs'}).render(obj);
					$("#profile_search_results").append(resultHTML);
				}
			}
			console.log('yaaa');
		});
	});


});