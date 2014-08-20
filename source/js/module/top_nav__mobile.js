define(['lib/news_special/bootstrap','module/constants'], function(news,constants) {

	var _createTopNavigation = function(callback) {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname + '__top-nav');
		el.className = constants.shortname + '__top-nav__select';
		document.getElementById(constants.project).appendChild(el);
		_appendNavigationImage('nav-img',constants.shortname + '__top-nav',constants.navImage);
		_appendListBoxElement('FIELDSET','options',constants.shortname + '__top-nav');
		_appendListBoxElement('SELECT','selections','top-nav__options');
		for (var i = 1; i <= constants.noPanels; i++) {
			_appendListBoxElement('OPTION',i,'top-nav__selections');
		}
		callback();
	};

	var _appendNavigationImage = function(name,parent,src){
		var el = document.createElement('img');
		el.setAttribute('id', constants.shortname + '__' + name);
		
		//add no-replace class, so image is not redirected to hell by the mobile website
		el.className = 'no-replace ' + constants.shortname + '__' + name;
		el.setAttribute('src',src);
		document.getElementById(parent).appendChild(el);
	};

	var _appendListBoxElement = function(type,name,parent,text){
		var el = document.createElement(type);
		if(type === 'OPTION'){
			el.className = constants.shortname + '__top-nav__' + type;
			el.value = name;
			text = document.getElementById('header-' + name).innerHTML;
			el.innerHTML = text;
		} else {
			el.setAttribute('id', 'top-nav__' + name);
			el.className = constants.shortname + '__top-nav__' + name;
		}
		document.getElementById(parent).appendChild(el);
	};

	var _select = function(position){
		document.getElementById('top-nav__selections').selectedIndex = (position-1);
	};


	var TopNav = function() { 

		_createTopNavigation(function(){

		//listen to the panel change
		news.pubsub.on('moveToPosition', function(position) {
			_select(position);
		});

		//listen to the viewer change
		news.pubsub.on('viewerItemClicked', function(position) {
			_select(position);
		});

		var selectBox = document.getElementById('top-nav__selections');
		selectBox.onchange = function(){
			news.pubsub.emit('topnavItemClicked', [this.selectedIndex + 1]);
		};
		});
	};

	TopNav.prototype = {


	};

    return TopNav;
		
});