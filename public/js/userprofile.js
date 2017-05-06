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
