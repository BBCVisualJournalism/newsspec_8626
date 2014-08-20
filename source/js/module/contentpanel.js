define(['lib/news_special/bootstrap','module/constants','module/journey'], function (news, constants, journey) {

	var target,
		header,
		image,
		panels,
		toAll,
		content,
		currentPanelNumber;

	_createPanelContentWrapper = function(callback) {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname + '__wrapper-panel');
		el.className = constants.shortname + '__content-wrapper';
		document.getElementById(constants.shortname + '__panel-container').appendChild(el);
		_createTextPanel();
		callback();
	};

	_createTextPanel =  function(callback) {
		target = document.createElement('DIV');
		target.setAttribute('id', constants.shortname + '__panel');
		target.className = constants.shortname + '__text-panel';
		document.getElementById(constants.shortname + '__wrapper-panel').appendChild(target);
		_createImageHolder();	
	};

	_createImageHolder =  function() {
		image = document.createElement('DIV');
		image.setAttribute('id', constants.shortname + '__image-cta');
		image.className = constants.shortname + '__image-cta-holder';
		document.getElementById(constants.shortname + '__wrapper-panel').appendChild(image);
		_createShareToolsEl();
	};

	_createShareToolsEl = function() {
		var container = news.$('#' + constants.shortname + '__wrapper-panel');
		var sharetools = news.$('.ns__desktop .share');
		sharetools.appendTo(container);
		_createReturnToAllEl();
	};

	_createReturnToAllEl = function() {
		toAll = document.createElement('DIV');
		toAll.setAttribute('id', 'toAll');
		toAll.className = 'toAll';
		document.getElementById(constants.shortname + '__wrapper-panel').appendChild(toAll);
		document.getElementById('toAll').innerHTML = 'Return to all cats';
	};

	_swapPanel = function (nextPanel) {
		currentPanelNumber = nextPanel;

		document.getElementById('cats__panel-container').className = 'cats__panel cats__panel--' + currentPanelNumber;

		var thisItem = journey['point_'+nextPanel];
		news.pubsub.emit('removeExtended');
		content = document.getElementById('panel-' + nextPanel).innerHTML;
		target.innerHTML = content;

		if(nextPanel===1) {
			document.getElementById('toAll').style.display = 'none';
		} else {
			document.getElementById('toAll').style.display = 'block';
			news.pubsub.emit('personal-share', [thisItem.header]);
		}
		_swapHeader(nextPanel);

	};

	_swapHeader = function(nextPanel) {
		var imgSize, count;
			content = document.getElementById('header-' + nextPanel).innerHTML;
		
			header.innerHTML = content;
			count = document.getElementById(constants.shortname + '__count');
			count.innerHTML = '(' + nextPanel + ' of ' + constants.noPanels + ')';

		_swapImage(nextPanel,imgSize);
	};
	
	_swapImage = function(nextPanel,imgSize) {
		content = document.getElementById('image-' + nextPanel).innerHTML;
		image.setAttribute('id',constants.shortname + '__image-cta-' + nextPanel);
		if(imgSize === 'small'){
			image.className = constants.shortname + '__image-cta-holder ' + constants.shortname + '__image-cta-holder__small';
		} else {
			image.className = constants.shortname + '__image-cta-holder';
		}
		image.innerHTML = content;
		news.pubsub.emit('shouldRespond');
	};

	_addFullScreenPanel = function() {
		document.body.appendChild(panels);
	};

	var Contentpanel = function () { 
		
		//constructor
		_createPanelContentWrapper (function() {
			panels = document.getElementById('osd__panel-list');
			header = document.getElementById(constants.shortname + '__title');
			news.pubsub.on('movePanel', function(){_addFullScreenPanel(); });	
			
			news.pubsub.on('moveToPosition', function(target) {
				_swapPanel(target);
			});
			
			news.pubsub.on('topnavItemClicked',function(itemNumber) {
				_swapPanel(parseInt(itemNumber,10));
			});

			news.pubsub.on('viewerItemClicked',function(itemNumber) {
				_swapPanel(parseInt(itemNumber,10));
			});

			news.pubsub.on('panelShouldExtend', function() {
				news.pubsub.emit('panelExtend',[currentPanelNumber]);
			});

			image.onclick = function(ev) {
				if(!ev) {ev = window.event; }
				var thistarget = ev.target || ev.srcElement;
				var data = thistarget.parentElement.id.split(constants.shortname + '__image-cta-');
				news.pubsub.emit('panelExtend',[data[1]]);
			};

			toAll.onclick = function(e) {
				news.pubsub.emit('toAll');
				news.pubsub.emit('moveToPosition',[1]);
			};
		});
	};

	Contentpanel.prototype = {


	};

    return Contentpanel;
		
});