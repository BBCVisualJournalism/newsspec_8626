define(['lib/news_special/bootstrap','module/constants'], function(news,constants) {


	var _loop = true,
		_positionPointer = 1,
		_noOfDestinations = constants.noPanels;


	_resolveDestination = function(direction) {
		if(direction === 'next'){
			if(_positionPointer + 1 > _noOfDestinations){
				if(_loop){
					_positionPointer = 1;
				}
			}else{
				_positionPointer = _positionPointer + 1;
			}
		}else if(direction === 'prev'){
			if(_positionPointer-1 < 1){
				if(_loop){
					_positionPointer = _noOfDestinations;
				}else{
					_positionPointer = 1;
				}
			}else{
				_positionPointer = _positionPointer - 1;
			}
		}else{
			_positionPointer = 1;
			throw new Error("Navigator: unable to determine direction of travel");
		}
		return _positionPointer;
	};

	_enableButtons = function(destination,currentDirection){
		if(currentDirection=== null || currentDirection === undefined){
			if(destination>_positionPointer){
				currentDirection = 'next';
			}else if(destination<_positionPointer){
				currentDirection = 'prev';
			}
		}
		if(currentDirection === 'next') {
			enable = document.getElementById('prev__button');
			enable.className = constants.shortname + '__prev__button';
			enable.className += ' ' + constants.shortname + '__button';
		} else if(currentDirection === 'prev') {
			enable = document.getElementById('next__button');
			enable.className = constants.shortname + '__next__button';
			enable.className += ' ' + constants.shortname + '__button';
		}
	};

	_handleDisableButtons = function(destination,currentDirection) {

			if (destination === 1 || destination === _noOfDestinations) {
			if(currentDirection === null || currentDirection === undefined){
				if(destination === 1){
					currentDirection = 'prev';
				}else{
					currentDirection = 'next';
				}
			}	
			if(!_loop) {
				// TODO - Button disable....CSS
				//console.log("TODO - Disable "+direction+"btn");
				disable = document.getElementById(currentDirection + '__button');
				disable.className = constants.shortname + '__' + currentDirection + '__button';
				disable.className += ' ' + constants.shortname + '__button';
				disable.className += ' ' + constants.shortname + '__' + currentDirection + '__button__disable';

			}
		}
	};

	_setPositionPointer = function(position) {
		_positionPointer = position;
		//_handleDisableButtons(position);
	};

	_handleNavigation = function(direction) {
		var enable,
			disable;

		currentPosition = _positionPointer;
		projectedDestination = _resolveDestination(direction);

		if (projectedDestination !== currentPosition ) {
			_enableButtons(projectedDestination,direction);
			news.pubsub.emit('moveToPosition',[projectedDestination]);
		}

		_handleDisableButtons(projectedDestination,direction);
	
	};

	_createNav = function(callback) {
		_createNavWrapper();
		_createButton('prev__button','Previous',true);
		_createTitle();
		_createCount();
		_createButton('next__button','Next');
		callback();
	};

	_createNavWrapper = function() {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname + '__navigation');
		el.className = constants.shortname + '__nav-wrapper';
		document.getElementById(constants.shortname + '__panel-container').appendChild(el);
	};

	_createButton = function(id,label,disable) {
		var el = document.createElement('BUTTON');
		el.setAttribute('id', id);
		el.className = constants.shortname+'__' + id;
		el.className += ' '+constants.shortname + '__button';
		if(disable){
			el.className += ' ' + constants.shortname + '__' + id + '__disable';
		}
		el.innerHTML = label;
		document.getElementById(constants.shortname + '__navigation').appendChild(el);
	};

	_createTitle = function() {
		var el = document.createElement('H2');
		el.setAttribute('id', constants.shortname + '__title');
		el.className = constants.shortname + '__title-header';
		document.getElementById(constants.shortname + '__navigation').appendChild(el);
	};

	_createCount = function() {
		var el = document.createElement('SPAN');
		el.setAttribute('id', constants.shortname + '__count');
		el.className = constants.shortname + '__title-count';
		document.getElementById(constants.shortname + '__navigation').appendChild(el);
	};

	var Navigator = function (loop) { 
		//constructor
		// if loop is passed as false then turn of looping through and enable end points.
		if (loop === false) {
			_loop = loop;
		}
		var projectedDestination,
			currentPosition;

		// Add listeners
		_createNav(function() {
			var nextBtn = document.getElementById('next__button'),
				prevBtn = document.getElementById('prev__button');
			
			nextBtn.onclick = function(ev) {
				_handleNavigation('next');
			};

			prevBtn.onclick = function(ev) {
				_handleNavigation('prev');
			};

			//hide to All for the first panel
			//console.log(document.getElementById('toAll'))//.style.display = 'none';


			news.pubsub.on('toAll', function() {
				_setPositionPointer(1);
				_handleNavigation('prev');
			});

			//responding to the top navigation clicked
			news.pubsub.on('topnavItemClicked', function(itemNumber) {
				_enableButtons(parseInt(itemNumber,10));
				_handleDisableButtons(parseInt(itemNumber,10));
				_setPositionPointer(parseInt(itemNumber,10));	
			});

			//responding to the viewer item clicked
			news.pubsub.on('viewerItemClicked', function(itemNumber) {
				_enableButtons(parseInt(itemNumber,10));
				_handleDisableButtons(parseInt(itemNumber,10));
				_setPositionPointer(parseInt(itemNumber,10));	
			});
		});
	};

	//TO DO probably no need for public functions here...
	Navigator.prototype = {


	};

    return Navigator;
		
});