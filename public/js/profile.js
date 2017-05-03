$(document).ready(function(){

	$("#search").keyup(function(event){

		if ($("#search").val() !== "") {
				$.post("search/" + $("#search").val() + "/" + user_id, function(result){
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


});
