$(document).ready(function(){

	/************************************/
	/*			Process sign in			*/
	/************************************/
	$("#login_frm").submit(function() {
		modal = true;
		$("#modal").fadeOut(function(){
			$.ajax({
				type: "POST",
				url: "signin",
				success: function(data){
					console.log(data);
//					$("#modalBox").html(data);
//					$("#modal").fadeIn();
				}
			});
		});
	});
	
	/************************************/
	/*	Redirect to signup from sign in	*/
	/************************************/
	$("#signUp_lnk").click(function() {
		modal = true;
		window.$("#modal").fadeOut(function(){
			$.post("signup", function(data){
				window.$("#modalBox").html(data);
				window.$("#modal").fadeIn();
			});
		});
	});
});