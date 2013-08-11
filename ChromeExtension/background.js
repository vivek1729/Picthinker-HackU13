$(document).ready(function () {
function loadimage(params){
var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&" +
							       "api_key=a2282a6e140e07e7689570dd1463330a&" +
							        "text="+encodeURIComponent(params)+"&" +
							        "safe_search=1&" +  // 1 is "safe"
							         "content_type=1&" +  // 1 is "photos only"
							        "sort=relevance&" +  // another good one is "interestingness-desc"
							         "per_page=1&" +
									 "page=1";
									 var photos;
									 $.ajax({type: "GET",url: url,dataType: "html",
					             	success: function (xml) {
					                        //console.log(xml);
					                        photos = $(xml).find('photo');
					                         console.log("Image loaded successfully");
					           				$.each(photos, function() {
					                         var imgsrc = "http://farm" + this.getAttribute("farm") +
									         ".static.flickr.com/" + this.getAttribute("server") +
									         "/" + this.getAttribute("id") +
									         "_" + this.getAttribute("secret") +
									          "_m.jpg";
									          console.log(imgsrc);
									          /*Now that I have the image..Inject the css*/
										         var inject = 'document.getElementsByClassName("yog-wrap yom-art-bd")[0].firstElementChild.insertAdjacentHTML("afterbegin", \'<div id= "mediaarticlerelated" class="bd"><img src="'+imgsrc+'" style="width: 190px;height: 133px;"/></div>\');';
												 chrome.tabs.executeScript(null,{code:inject});    
					                    	 });
					                     }
					              	});
};
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var url = "https://access.alchemyapi.com/calls/text/TextGetRankedConcepts?apikey=4220000319dc9afe5b0017f6fdfcec9470577ca3&outputMode=json&jsonp=?";
  	var response = "Fuck you http";
  	$.ajax({
		  type: "POST",
		  url: url,
		  dataType: "json",
		  data: { text: request.greeting},
		  success: function (data) {
		  	response = data.concepts[0].text;
		  	console.log(request.greeting);
		  	console.log(data.concepts[0].text);
		  	sendResponse({farewell: response});
		  	loadimage(response);
		  }
		});

  return true;
});

});