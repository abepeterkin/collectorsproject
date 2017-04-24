$(document).ready(function(){

	/************************************/
	/*			Process login			*/
	/************************************/
	$("#login").on('submit', function() {
		modal = true;
		$("#modal").fadeOut(function(){
			$.ajax({
				type: "POST",
				url: "login",
				success: function(data){
					$("#modalBox").html(data);
					$("#modal").fadeIn();
				}
			});
		});
	});
	
	/************************************/
	/*	Redirect to signup from login	*/
	/************************************/
	$("#signUpHere").click(function() {
		modal = true;
		$("#modal").fadeOut(function(){
			$.post("signup", function(data){
				window.$("#modalBox").html(data);
				window.$("#modal").fadeIn();
			});
		});
	});
});