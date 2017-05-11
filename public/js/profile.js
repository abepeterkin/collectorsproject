$(document).ready(function(){
	var span = document.getElementsByClassName("close")[0];

	/* inserting user info */
	$("#dropbtn").html(firstname);
	$("#name").html(firstname+" "+lastname);
	$("#user_email").html(email);
	$("#institution_name").html(affiliation);
	$("#user_location").html(city + ", " + country);

	/* opening first tab by default, load user's objects */
	document.getElementById("defaultOpen").click();

	$.post("search/" + affiliation, function(result){
		$("#uploadList").html("");
		var resultObjects = JSON.parse(result);
//		$("#pageNumber").html("Showing < " + resultObjects.length + " > results");
		for (var key in resultObjects) {
			if (resultObjects.hasOwnProperty(key)) {
   				var obj = resultObjects[key];
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


	/* opens edit profile modal */
	$("#edit_profile").click(function() {
	    $("#editInfoModal")[0].style.display = "flex";
		$("#editInfoModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
		$("input#firstname").val(firstname);
		$("input#lastname").val(lastname);
		$("input#email").val(email);
		$("input#city").val(city);
		$("input#country").val(country);
		$("input#affiliation").val(affiliation);
	});

	/* opens password modal */
	$("#change_password").click(function() {
	    $("#passwordModal")[0].style.display = "flex";
		$("#passwordModal")[0].style.backgroundColor = "hsla(0,0%,0%,0.5)";
	});

	/* opens object modal */
	$(document).on('click', ".search_result", function(event) {

		console.log("DOCUMENT CLICK: id is " + $(this).attr("data-id"));

		var obj = {
			id : $(this).attr("data-id"),
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



	/* closes modal windows */
	$(document).click(function(event) {
		if (event.target == $("#uploadModal")[0]) {
			$("#uploadModal")[0].style.display = "none";
		}

    	if (event.target == $("#objectModal")[0]) {
			$("#objectModal")[0].style.display = "none";
		}

		if (event.target == $("#editInfoModal")[0]) {
			$("#editInfoModal")[0].style.display = "none";
		}

		if (event.target == $("#passwordModal")[0]) {
			$("#passwordModal")[0].style.display = "none";
		}
	});


	/* gets uploaded objects for Uploads tab*/
	$("#defaultOpen").click(function(event) {
	    $.post("search/" + affiliation, function(result){
			$("#uploadList").html("");
			var resultObjects = JSON.parse(result);
			if (resultObjects.length < 20) {
				$("#pageNumber").html("< 1 >");
				// show first twenty
			}
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
		});
	});

/* THIS DOESN"T WORK YET!!*/
	/*$('#edit_password_form').submit(function(event) {
		console.log("this jquery happens...");
		event.preventDefault();
		var new_p = $("#new_password").val();
		var confirm_p = $("#confirm_new_password").val();
		if (new_p && confirm_p) {

				console.log("gets here 1");
			var post_params = {
				newpassword : new_p,
				confirmpassword : confirm_p
			}
			$("#edit_password_error_message").val("Submitting...");
			$.post("/editpassword", post_params, function(data) {
				console.log("gets here 2");
				$("#edit_password_error_message").val(data);
			});
		} else {
			console.log("gets here 3");
			$("#edit_password_error_message").val("Please fill out all fields");
		}
	});*/


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

	/* mousing over a search result */
	$(document).on('mouseover', ".search_result", function(event) {
		$('body').css('cursor','pointer');
	});

	/* mouse leaves over a search result */
	$(document).on('mouseleave', ".search_result", function(event) {
		$('body').css('cursor','default');
	});

});
