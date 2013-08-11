$(document).ready(function () {
	console.log("Jquery working...");
	var body = $("#mediaarticlebody").text();
	//console.log(text);
	if ( $( "#mediaarticlerelated" ).length ) {
		console.log("has images");
	}
	else{
		/*Now I need to insert the relevant images...*/
		chrome.runtime.sendMessage({greeting: body}, function(response) {
		  console.log(response.farewell);
		});
		  
	}
});