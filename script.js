			$(document).ready(function(){
				$('button').click(function(){
					_dist = $('select').val();

					getLocation();
				});
				var template = function(objectRestau){
					if(objectRestau.photoRestau){
						var _tpl = [
							'<div>',
								'<img src="'+objectRestau.photoRestau+'" />',
								'<span>' + objectRestau.nomRestau + '</span>',
							'</div>'
						]
					}
					else{
						var _tpl = [
							'<div>',
								'Pas de photo lol',
								'<span>' + objectRestau.nomRestau + '</span>',
							'</div>'
						]
					}
					return  _tpl.join('');
				}
				function getLocation() {
				    if (navigator.geolocation) {
				        navigator.geolocation.getCurrentPosition(searchFood);
				    } else {
				        alert('Il faut activer la géolocalisation');
				    }
				}
				function searchFood(position){
					var _apiKey = 'AIzaSyA9alxy1i0sVNd23KiSwB_t906yRGnCj9M';
					var _req = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+position.coords.latitude+","+position.coords.longitude+"&radius="+_dist+"&types=food&key="+_apiKey;
					$.get(_req,function(data){
						console.log(data);
						_result = data.results;
						for (i = 0; i < _result.length; i++){
							_reqPhoto = null;
							if(typeof _result[i].photos !== 'undefined'){
								 _photoRef = _result[i].photos[0].photo_reference;
								 _reqPhoto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference="+_photoRef+"&key="+_apiKey;
							}
							restaurantBuilder(_result[i].name , _reqPhoto);
						}
					});
				}
				function restaurantBuilder(name, photo){ // Création d'un objet qui contiendra les attributs du restaurant et sera transféré au template
					_restaurant = {nomRestau: name, photoRestau: photo};	
					processTemplate(_restaurant);
				}
				function processTemplate(restaurant){
					$('#results').append(template(restaurant));
				}
			});