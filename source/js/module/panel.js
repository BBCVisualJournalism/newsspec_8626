define(['lib/news_special/bootstrap','module/constants','module/navigator','module/contentpanel','module/extendedpanel'],
	function(news,constants,Navigator,Contentpanel,Extendedpanel) {

	var extendedpanel,
		autoplay = false;

	_createPanel =  function(callback) {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname + '__panel-container');
		el.className = constants.shortname + '__panel';
		document.getElementById(constants.project).appendChild(el);
		callback();
	};

	_extendedPanel = function (id) {
		if(extendedpanel === null || extendedpanel === undefined){
			extendedpanel = new Extendedpanel(id, autoplay);
		}
	};

	_destroyExtended = function() {
		extendedpanel = null;
	};

	_hideThis = function() {
		document.getElementById(constants.shortname + '__panel-container').className += ' ' + constants.shortname + '__panel__responsive-hide';
	};

	_showThis = function() {
		document.getElementById(constants.shortname + '__panel-container').className = constants.shortname + '__panel';
	};

	var Panel = function (view) {
		//constructor
		var nav,
			info;

		if (view === 'desktop') {
			autoplay = true;
		}

		_createPanel(function() {
			nav =  new Navigator(false);
			info = new Contentpanel();
			news.pubsub.emit('panelInitialised');
			document.getElementById(constants.shortname + '__panel-container').onmouseover = function(){
				news.pubsub.emit('navMouseOut');
			};
		});
		news.pubsub.on('panelExtend', function (target) { _extendedPanel(target); });
		news.pubsub.on('destroyExtended', function() {_destroyExtended();});
		news.pubsub.on('hidePanelContainer',function() {_hideThis();});
		news.pubsub.on('showPanelContainer',function() {_showThis();});
		news.pubsub.on('topnavItemClicked',function(itemNumber) {

		});

	};

	Panel.prototype = {

		navigator: function() {
			return nav;
		},

		content: function(){
			return info;
		}

	};

    return Panel;

});
