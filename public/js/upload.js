$(document).ready(function() {
	
	$("#upload_form").submit(function(e){
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "uploadfile",
			success: function(data){
				$("#modalBox").html(data);
				$("#modal").fadeIn();
			},
			failure: function(data){
				$("#modalBox").html(data);
				$("modal").fadeIn();
			}
		});
	});
});