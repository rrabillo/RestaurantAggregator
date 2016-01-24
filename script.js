// Passage sur l'API foursquare car trop de problème avec celle de google (limitations, côté serveur etc...)
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
			if(objectRestau.open){
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
			if(objectRestau.open){
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
		var _clientID = 'VAUDV41YPWEJLMIVQOQNKBVS24C35UVH5ZXR3ZWA5QPYMMZN'; // Pour plus de commodité, on stocke les identifiants d'API
		var _clientSecret = 'S34HXKB0MLU0C1PRPZF3CON2BJTTTO1RLJAJ1IVIRAFKRQSN'
		var _req = "https://api.foursquare.com/v2/venues/search?client_id="+_clientID+"&client_secret="+_clientSecret+"&v=20130815&ll="+position.coords.latitude+","+position.coords.longitude+"&radius="+_dist+"&query=food"; // Requête générale pour trouver les restaurants aux alentours
		$.get(_req,function(data){
			_result = data.response.venues; // On récupère un array qui contient des objets (un restaurant = un objet). On le stocke dans results
			for (i = 0; i < _result.length; i++){ // On parcours maintenant results pour récupérer chaque restaurant
				_photo = null;
				_venueID = _result[i].id;
				var _req2 = "https://api.foursquare.com/v2/venues/"+_venueID+"?client_id="+_clientID+"%20&client_secret="+_clientSecret+"&v=20130815" // Seconde requete sur chaque restaurant pour obtenir des détails
				$.get(_req2,function(data){
					console.log(data);
					_restauObject = data.response.venue;
					if(_restauObject.bestPhoto){
					_photo = data.response.venue.bestPhoto.prefix+500+data.response.venue.bestPhoto.suffix;
					}
					else{
						_photo = null;
					}
					if(_restauObject.hours){
						_isOpen = _restauObject.hours.isOpen;
					}
					else{
						_isOpen = 'Aucune information'
					}
					restaurantBuilder(_restauObject.name ,_photo, _restauObject.location, _isOpen); // On appel la fonction restaurantBUilder à laquelle on passe des params
				});
			}
		});
	}

	function restaurantBuilder(name, photo ,adresse, isOpen){ // Création d'un objet qui contiendra les attributs du restaurant et sera transféré au template
		_restaurant = {nomRestau: name, photoRestau :photo , place : adresse, open : isOpen};	
		processTemplate(_restaurant);
	}
	function processTemplate(restaurant){
		$('#results').append(template(restaurant));
	}
});