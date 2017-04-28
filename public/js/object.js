function clicked(object){
	$.post("object/" + object, function(data){
		console.log(data);
	});
};