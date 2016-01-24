// Ce code est censé s'exécuter côté serveur (Documentation google). Pour le faire fonctionner côté client, on utilisera le plugin CORS pour google chrome.
$(document).ready(function(){

	// Petits ajustement côté front
	function absolutePos(element){
		var elH = $(element).height();
		var elW = $(element).width();
		$(element).css({'margin-top':-elH/2 , 'margin-left': -elW/2});
	}
	absolutePos($('#searchzone #searchform'));

	$('button').click(function(){
		$('#results').html(''); // On vide les précédents résultats
		_dist = $('select').val(); // Stocke la distance souhaitée dans la variable _dist
		getLocation();
		$('html, body').animate({ // On scroll vers les résultats
        	scrollTop: $("#results").offset().top
    	}, 1000);
	});
	var template = function(objectRestau){
		if(objectRestau.photoRestau){
			if(objectRestau.is_open){
				var _tpl = [
				'<div class="tiles">',
					'<img src="'+objectRestau.photoRestau+'" />',
					'<span>' + objectRestau.nomRestau + '</span>',
					'<div class="open">Open !</div>',
					'<div class="hover">',
					'<span>' + objectRestau.place + '</span>',
					'</div>',
				'</div>'
			]
			}
			else{
				var _tpl = [
				'<div class="tiles">',
					'<img src="'+objectRestau.photoRestau+'" />',
					'<span>' + objectRestau.nomRestau + '</span>',
					'<div class="closed">Closed</div>',
					'<div class="hover">',
					'<span>' + objectRestau.place + '</span>',
					'</div>',
				'</div>'
				]
			}
		}
		else{
			if(objectRestau.is_open){
				var _tpl = [
				'<div class="tiles">',
					'<img src="imgs/no.jpg" />',
					'<span>' + objectRestau.nomRestau + '</span>',
					'<div class="open">Open !</div>',
					'<div class="hover">',
					'<span>' + objectRestau.place + '</span>',
					'</div>',
				'</div>'
				]
			}
			else{
				var _tpl = [
				'<div class="tiles">',
					'<img src="imgs/no.jpg" />',
					'<span>' + objectRestau.nomRestau + '</span>',
					'<div class="closed">Closed</div>',
					'<div class="hover">',
					'<span>' + objectRestau.place + '</span>',
					'</div>',
				'</div>'
				]
			}
		}
		return  _tpl.join('');
	}
	function getLocation() { // Permmet de récupérer les coordonnées de positions avec HTML5 (marche mieux sur mobile, car présence d'un gps)
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(searchFood); // Si la geolocation est activé, on appel la fonction searchfood en lui passant les coordonnées en params
	    } else {
	        alert('Il faut activer la géolocalisation');
	    }
	}
	function searchFood(position){ 
		var _apiKey = 'AIzaSyBQhDxOenA3n9phuqjQ9-vQOVUEiezbXPo';
		var open;
		var _req = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+position.coords.latitude+","+position.coords.longitude+"&radius="+_dist+"&types=restaurant&key="+_apiKey;//On génère la requete pour trouver des restaurants
		$.get(_req,function(data){
			_result = data.results; // On récupère un array qui contient des objets (un restaurant = un objet). On le stocke dans results
			console.log(_result);
			for (i = 0; i < _result.length; i++){ // On parcours maintenant results pour récupérer chaque restaurant
				_reqPhoto = null;
				if(typeof _result[i].photos !== 'undefined'){ // Petite condition qui permet de récupérer la photo associée au restaurant, si elle existe
					 _photoRef = _result[i].photos[0].photo_reference;
					 _reqPhoto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference="+_photoRef+"&key="+_apiKey; // Nouvelle requete pour récupérer la photo associée
				}
				if(typeof _result[i].opening_hours !== 'undefined'){
					open = _result[i].opening_hours.open_now;
				}
				else{
					open = '';
				}
				restaurantBuilder(_result[i].name , _reqPhoto, open, _result[i].vicinity); // On appel la fonction restaurantBUilder à laquelle on passe des params
			}
		});
	}
	function restaurantBuilder(name, photo, open, adresse){ // Création d'un objet qui contiendra les attributs du restaurant et sera transféré au template
		_restaurant = {nomRestau: name, photoRestau: photo, is_open : open , place : adresse};	
		processTemplate(_restaurant);
	}
	function processTemplate(restaurant){
		$('#results').append(template(restaurant));
	}
});