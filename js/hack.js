$(document).ready(function () {
/*Presets*/	
$("#container").hide();
$("#loader").hide();
/*Function for loading images from flickr*/
function loadimages(params){
	var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&" +
							       "api_key=a2282a6e140e07e7689570dd1463330a&" +
							        "text="+encodeURIComponent(params)+"&" +
							        "safe_search=1&" +  // 1 is "safe"
							        "content_type=1&" +  // 1 is "photos only"
							        "sort=relevance&" +  // another good one is "interestingness-desc"
							         "per_page=5&" +
									 "page=1";
									 var photos;
									 $.ajax({type: "GET",url: url,dataType: "html",
					             	success: function (xml) {
					                        //console.log(xml);
					                        photos = $(xml).find('photo');
					                        console.log(photos);
					           				$.each(photos, function() {
					                         var imgsrc = "http://farm" + this.getAttribute("farm") +
									         ".static.flickr.com/" + this.getAttribute("server") +
									         "/" + this.getAttribute("id") +
									         "_" + this.getAttribute("secret") +
									          "_m.jpg";
									          console.log(imgsrc);
									         $(".alert").alert("Successfully loaded some images..");
									         $("#loader").hide();
									         $("#subbutton").button('reset');
									         $("#container").show();
					                         $("#container").append( '<img src="'+imgsrc+'" alt="Lawl"  class="img-thumbnail">' );					                         
					                    	 });
					                     }
					              	});

};

/*Main code executed when search form submitted*/
    			$("#searchform").submit(function() {
    			$("#container").hide();
    			$("#container").html('');
    			$("#subbutton").button('loading');
    			$("#loader").show();
    			var query = $("#query").val();
          		query = query.replace(/\s{2,}/g, ' ');
          		var url = query;
				var q = encodeURIComponent('select div from html where url="'+url+'" and xpath='+"'//"+'div[contains(@id,"mediaarticlebody")]'+"'");
	            var yql = 'http://query.yahooapis.com/v1/public/yql?q=';
	            var text;
	            var alchemy;
	            var cap = "";
	            $.ajax({type: "GET",url: yql+q,dataType: "html",
	             	success: function (xml) {
	                       //console.log(xml);
	                       text = $(xml).find('div.bd').text();
	                       console.log("News content:"+text);
	                       
	                       /*Find yahoo content analysis results as well*/
	                       poop = 'select * from contentanalysis.analyze where text="'+text+'"';
					             

	                       url = "http://access.alchemyapi.com/calls/text/TextGetRankedConcepts?apikey=4220000319dc9afe5b0017f6fdfcec9470577ca3&outputMode=json&jsonp=?";
	                       $.post(url, { "text": text },
							  function(data){
							    console.log("Made the call:"+data.concepts[0].text); // John
							    alchemy = data.concepts[0].text;
							    /*Fall back to the yahoo content analysis api as well!*/
								
								/*End of cap results, send both.*/
							    loadimages(alchemy);
							  }, "json");							
							
							$.post("http://query.yahooapis.com/v1/public/yql" , { "q": poop },
									function(data){
									result = $(data).find('entity');
									console.log("Yahoo content analysis: "+result.first().find("text").text());
									cap = result.first().find("text").text();
									loadimages(cap);
									}, "xml");
				           }
	             });
          		console.log("Form was submitted");   			
       			return false;
    		});
			
    	});