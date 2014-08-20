define(['lib/news_special/bootstrap','module/constants', 'module/journey'], function(news,constants, journey) {

	var _id,
		_journey,
		_nsInt,
		autoplay;

	_createExtendedPanel =  function(id,callback) {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname+'__extended-panel-'+id);
		el.className = constants.shortname+'__panel__extended';
		document.getElementById(constants.shortname+'__panel-container').appendChild(el);
		_createHeader(id);
		callback();
	};

	_createHeader = function(id){
		var el = document.createElement('H2');
		el.setAttribute('id', constants.shortname+'__panel-header');
		el.className = constants.shortname+'__extended-panel__header';
		el.innerHTML = _journey.header;
		document.getElementById(constants.shortname+'__extended-panel-'+id).appendChild(el);
		_createCloseButton(id);
	};

	_createCloseButton = function(id){
		var el = document.createElement('A');
		el.setAttribute('id', constants.shortname+'__close');
		el.className = constants.shortname+'__extended-panel__button';
		el.innerHTML = 'close';
		el.onclick = function(){news.pubsub.emit('removeExtended');};
		document.getElementById(constants.shortname+'__extended-panel-'+id).appendChild(el);
		_createMediaHolder(id);		
	};
	_createCtaButton = function(id){
		var caption,
			el = document.createElement('A');
		el.setAttribute('id', constants.shortname+'__link');
		el.className = constants.shortname+'__extended-link';
		el.href = _journey.link;
		document.getElementById(constants.shortname+'__extended-panel-'+id).appendChild(el);
		if(_journey.video !== undefined){
			//el.innerHTML = 'TODO embed emp for '+_journey.video;
			caption = _journey.caption;
			news.pubsub.emit('NS_embedEMP',[_journey.video]);
		}else if(_journey.image !== undefined){
			caption = _journey.caption;
			news.pubsub.emit('NS_embedImg',[_journey.image]);
		}else if(_journey.carousel !== undefined){
			caption = _journey.carousel[0].caption;
			news.pubsub.emit('NS_embedCar',[_journey.carousel]);
		}
		_createMediaCaption(id,caption);
	};

	_createMediaHolder = function(id){
		el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname+'__med');
		el.setAttribute('data-playlist', journey['point_' + id].video);
		el.setAttribute('data-autoplay', autoplay ? 'true' : 'false');
		el.className = constants.shortname+'__extended-panel__med';
		document.getElementById(constants.shortname+'__extended-panel-'+id).appendChild(el);
		_createCtaButton(id);
	};

	_createMediaCaption = function(id, caption){
		var el = document.createElement('P');
		el.setAttribute('id', constants.shortname+'__caption');
		el.className = constants.shortname+'__text-panel__text';
		el.innerHTML = caption;
		document.getElementById(constants.shortname+'__extended-panel-'+id).appendChild(el);
	};

	_removeExtended = function() {
		var el = document.getElementById(constants.shortname+'__extended-panel-'+_id);
		if(el !== null){
			el.parentNode.removeChild(el);
			news.pubsub.emit('showPanelContainer');
		}
		_nsInt = null;

		news.pubsub.emit('destroyExtended');
	};


	var ExtendedPanel = function (id, autoplaySetting) { 
		autoplay = autoplaySetting;
		_id = id;
		_journey = journey['point_'+id];
		// Check for extended content
		if(_journey.image === undefined && _journey.video === undefined && _journey.carousel === undefined){
			//console.log('no extended content');
		}else{
			_createExtendedPanel(_id,function(){
				news.pubsub.on('removeExtended', function(){_removeExtended();});
			});	
			news.pubsub.emit('hidePanelContainer');
		}
	};

	ExtendedPanel.prototype = {


	};

    return ExtendedPanel;
		
});