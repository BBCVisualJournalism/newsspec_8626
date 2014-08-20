define(['lib/news_special/bootstrap', 'module/constants', 'module/journey'], function (news, constants, journey) {

	var _moveToPosition = function (nextposition) {
		var image = document.getElementById('map-' + nextposition);
		
		document.getElementById(constants.shortname + '__viewer__main').innerHTML = image.innerHTML;
		_appendViewerElement('div','caption', constants.shortname + '__viewer__main', journey['point_' + nextposition].mapsCaption);
		
		if (nextposition !== 1) {
			_appendViewerElement('span','color', 'cats__viewer__caption');
			document.getElementById('cats__viewer__color').style.borderColor = journey['point_' + nextposition].lineColor;
		} else {
			var caption = document.getElementById('cats__viewer__caption');
			caption.style.bottom = '43px';
			caption.style.paddingLeft = '8px';
			caption.style.width = '216px';

		}
	};

	var _createWrapper = function(callback) {
		var el = document.createElement('div');
		el.setAttribute('id', constants.shortname + '__wrapper');
		el.className = 'cats__wrapper';
		document.getElementById(constants.project).appendChild(el);
		_createCanvas();
		callback();
	};

	var _createCanvas = function() {
		_appendViewerElement('div','main',constants.shortname + '__wrapper');
	};

	var _appendViewerElement = function(type, name, parent, text) {
		var el = document.createElement(type);

		el.setAttribute('id', constants.shortname + '__viewer__' + name);
		el.innerHTML = text || '';
		document.getElementById(parent).appendChild(el);

	};

	var _viewerItemClicked = function(e) {
		var position = this.id.substr(18, this.id.substr.length);
		news.pubsub.emit('viewerItemClicked', [position]);
		_handleMaps(position);
	};

	 
	var InteractiveViewer = function () {

		_createWrapper(function() {
			news.pubsub.on('moveToPosition', function(target){_moveToPosition(target); });
			news.pubsub.on('moveViewer', function(target){_moveViewer(target); });
		});

		news.pubsub.on('topnavItemClicked', function(position) {
			_moveToPosition(position);
		});

	};


	InteractiveViewer.prototype = {

		changeViewportWidth: function(){
			var showExtended;
			if (window.matchMedia !== undefined) {
				var mq = window.matchMedia("(min-width: 768px)");
				showExtended = !mq.matches;
			} else {
				if (document.documentElement.clientWidth > 768){
					showExtended = false;
				} else {
					showExtended = true;
				}
			}
			if (showExtended) {
				return true;
			} else {
				return false;
			}
		}
	};

    return InteractiveViewer;

});
