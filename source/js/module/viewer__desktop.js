define(['lib/news_special/bootstrap','module/constants','module/desktop/cats-processed_mod'], function(news, constants, cats_outer) {

	var cats = cats_outer.cats;

	var embeddedViewport = false,
		viewer,
		viewerItems,
		countFrom = [0,0], tracer = [], path = [], pathStr = [], seconds, interval, paper, fadeTimer,
		secondsBox, secondsUnder, legendBox, legendLines = [], legendLabels = [], legendIntro, scaleBox, scaleLineMetres, scaleLineFeet, scaleLabelMetres, scaleLabelFeet, source,
        videoMarkerText, videoMarkerPath,
		width = 600, height = 600,
		timeStart = 0, timeMax = 86400;	
	
	var _moveToPosition = function(nextposition) {
		//console.log("I recieved an instruction to Move to" + nextposition);
		var image = document.getElementById('map-' + nextposition);
		catChanged(nextposition - 1);
		// Might be used to swap images into map container on Responsive
		//document.getElementById(constants.shortname+'__viewer__main').innerHTML = image.innerHTML;
	};

	var _createWrapper = function(callback) {
		var el = document.createElement('DIV');
		el.setAttribute('id', constants.shortname + '__wrapper');
		el.className = 'cats__wrapper';
		document.getElementById(constants.project).appendChild(el);
		_createCanvas();
		callback();
	};

	var _createCanvas = function() {
		_appendViewerElement('DIV','main',constants.shortname + '__wrapper');
		//for (var i = 2; i <= constants.noPanels; i++) {
		//	_appendViewerElement('A','map-' + i,constants.shortname + '__viewer__main','cat' + (i-1));
		//}
		_appendViewerElement('DIV','backgroundMap',constants.shortname + '__viewer__main');
		_appendViewerElement('DIV','svgContainer',constants.shortname + '__viewer__main');
        _appendViewerElement('DIV','clickable',constants.shortname + '__viewer__main');
        _appendClickableElements();
	};

	var _appendViewerElement = function(type,name,parent,text) {
		var el = document.createElement(type);
		el.setAttribute('id', constants.shortname + '__viewer__' + name);
		el.className = 'cats__map-item';
		if(type === 'a') {
			el.innerHTML = text;
		} else {
			el.className = constants.shortname + '__maps';
		}

		document.getElementById(parent).appendChild(el);
	};

    var _appendMarker = function(index) {
        var el = document.createElement('div');
        el.className = 'clickable_' + index;

        document.getElementById(constants.shortname + '__viewer__clickable').appendChild(el);

        if (index===0) {
            el.setAttribute('id', 'clickable_0');
        } else {
            el.onclick = function(e) {
                //play video for the current panel
                news.pubsub.emit('panelExtend',[index+1]);
                news.pubsub.emit('labelClicked',[index+1]);

            };
        }

        return el;
    };

    var _appendImageMapElement = function(index,catNumber) {
        var el = document.createElement('div');
        el.className = 'clickable_0';
        el.setAttribute('id', 'intro_' + index);

        document.getElementById('clickable_0').appendChild(el);
        
        el.onclick = function() {
            
            //open appropriate panel for catNumber
            news.pubsub.emit('viewerItemClicked', [catNumber]);
            news.pubsub.emit('introImageMapClicked');
            
            catChanged(catNumber-1);
            //not needed as we already swap content
            //news.pubsub.emit('moveToPosition', [catNumber]);
        };

        return el;
    };


    var _appendClickableElements = function() {

        var imageMapElementCats = [5,3,9,7,11,8,8,10,10,2,4,6,6,6];

        for (var i=0; i<11; i++) {
            _appendMarker(i);
            if (i===0) {
                for (var j=0; j < 14; j++) {
                    _appendImageMapElement(j,imageMapElementCats[j]);
                }
            }
        }
    };

	//change the style for now, swap maps in the future
	var _handleMaps = function(position) {
		var selectedViewerItem = document.getElementById('cats__viewer__map-' + position);

		for (var i=0; i < viewerItems.length; i++) {
			viewerItems[i].style.color = '#505050';
		}

		selectedViewerItem.style.color = '#000000';
	};

	var _viewerItemClicked = function(e){
		var position = this.id.substr(18, this.id.substr.length);
		news.pubsub.emit('viewerItemClicked', [position]);
		//_handleMaps(position);
	};

	var catChanged = function(selectedCatIndex) {

		seconds.attr({"text": ""});

		var catIndex = [selectedCatIndex-1,-1];

		legendLabels[0].hide();
		legendLines[0].hide();	
		legendLabels[1].hide();
		legendLines[1].hide();

		var pixelsPerMeter = (catIndex[0] === -1) ? 0.39239468361 : cats[catIndex[0]].pixelsPerMeter;
		var metersToShow = (catIndex[0] === -1) ? 240 : cats[catIndex[0]].metersToShow;

		var metreLineWidth =  pixelsPerMeter * metersToShow;			
		scaleLineMetres.attr({"width": metreLineWidth});
		scaleLineFeet.attr({"width": metreLineWidth/3.2808399});
		scaleLabelMetres.attr({"text": metersToShow + 'm'});	
		scaleLabelFeet.attr({"text": metersToShow + 'ft'});		

        var divs = document.getElementById(constants.shortname + "__viewer__clickable").getElementsByTagName("div");
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].className === 'clickable_'+(catIndex[0]+1) && divs[i].id !== 'clickable_0') {
                divs[i].style.display = 'block';    
            } else {
                divs[i].style.display = 'none';
            }               
        }

		if (catIndex[0] === -1) {
			seconds.attr({"text": "24:00"});
			document.getElementById(constants.shortname + '__viewer__backgroundMap').className = "intro";

			// need cats namespace
			fadeIn(document.getElementById("clickable_0"));
			legendIntro.show();

            videoMarkerPath.hide();
            videoMarkerText.hide();

		} else {
			document.getElementById(constants.shortname + '__viewer__backgroundMap').className = "cat"+catIndex[0];
			// need cats namespace

            var videoX = cats[catIndex[0]].videoLocation[0];
            var videoY = cats[catIndex[0]].videoLocation[1];
                        
            videoMarkerText.attr({"text": cats[catIndex[0]].videoLabel, "x": videoX, "y": videoY-18}).show();
            var videoMarkerBBox = videoMarkerText.getBBox();
            videoMarkerBBox.x -= 4;
            videoMarkerBBox.y -= 4;
            videoMarkerBBox.x2 += 4;
            videoMarkerBBox.y2 += 4;                

            var pathStr = "M" + [
                [videoX,videoY].join(","),
                [videoX - 6, videoMarkerBBox.y2].join(","),
                [videoMarkerBBox.x, videoMarkerBBox.y2].join(","),
                [videoMarkerBBox.x, videoMarkerBBox.y].join(","),
                [videoMarkerBBox.x2, videoMarkerBBox.y].join(","),
                [videoMarkerBBox.x2, videoMarkerBBox.y2].join(","),
                [videoX + 6, videoMarkerBBox.y2].join(",")
            ].join("L") + "Z";

            videoMarkerPath.attr({"path": pathStr}).show();

            var firstY = (catIndex[0] === 5 || catIndex[0] === 7) ? height - 35 : height - 26;
            legendIntro.hide();
            legendLabels[0].attr({"y": firstY}).show();
            legendLines[0].attr({"y": firstY-1}).show();

            //For Phoebe and Kato, need to draw two paths at once
            if (catIndex[0] === 5) {
                catIndex[1] = 7;
				legendLabels[1].show();
				legendLines[1].show();
            } else if (catIndex[0] === 7) {
				catIndex[1] = 5;
				legendLabels[1].show();
				legendLines[1].show();
            }

		}

        //TODO CLICKABLE MAP
        var a = document.getElementById('viewer__videoMarkerPath');
           

		startCat(catIndex);
		//event
	};

	var fadeIn = function(element) {
		var duration = 2000, steps = 50;
		if (element.style.display === 'none') {
			var op = 0;
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + (op * 100) + ")";		

			element.style.display = 'block';

			var fadeTimer = setInterval(function() {

				element.style.opacity = op;
				element.style.filter = 'alpha(opacity=' + (op * 100) + ")";

				op += 1/steps;

				if (op >= 1) {
					clearInterval(fadeTimer);
				}

			},duration/steps);

		}
	};

	var startCat = function(catIndex) {

		//Stop the previous timer
		clearInterval(interval);
		timeStart = 0;
		countFrom = [0,0];

		//Initialize the paths and tracers for the selected cat(s)
		initializeCat(catIndex,0);
		initializeCat(catIndex,1);

		if (catIndex[0] !== -1 || catIndex[1] !== -1) {

			//Start a new timer
			interval = setInterval(function() {

				if (timeStart < timeMax) {

					//Update the paths and the timer every 100 milliseconds
					timeStart = Math.min(timeStart+900,timeMax);
					seconds.attr({"text": Math.floor(timeStart/3600)+":00"});

					updatePath(catIndex,timeStart);

				} else {

					//The timer is done, stop it
					clearInterval(interval);

				}

			},100);
		}
	};

	var initializeCat = function(catIndex,z) {

		var ind = catIndex[z];

		if (ind === -1) {

			//Clear this cat out
			tracer[z].hide();
			path[z].hide();
			pathStr[z] = "";

		} else {

			//Place the tracer circle on the map
			tracer[z].attr({"cx": -10, "cy": -10}).show();
			var newTracer = cats[ind].points[0].projected.split(",");

			tracer[z].attr({"cx": newTracer[0],"cy": newTracer[1]}).show();

			len = cats[ind].points.length;

			cats[ind].points[0].displayed = true;

			//Mark all the segments for the cat as undisplayed
			for (var i = 1; i < len; i++) {
				cats[ind].points[i].displayed = false;
			}

			//Create the starting point for the path
			pathStr[z] = "M"+cats[ind].points[0].projected;

			path[z].attr({"path": pathStr[z],"stroke": cats[ind].color}).show();
			legendLines[z].attr({"fill": cats[ind].color}).show();
			legendLabels[z].attr({"text": cats[ind].name+"'s journey on "+cats[ind].readingDate}).show();

		}

	};


	var updatePath = function (catIndex,val) {

		var newTracer = "",len,ind;

		//For each cat index...
		for (z = 0; z < catIndex.length; z++) {

			ind = catIndex[z];

			if (ind !== -1) {

				newTracer = "";

				len = cats[ind].points.length;

				//Loop through the points in that cat's points, check the time
				for (var i = Math.max(1,countFrom[z]); i < len; i++) {

					if (cats[ind].points[i].secondsAfterStart <= val) {

						//If the point is before the current timer, add it to the path string
						if (!cats[ind].points[i].displayed) {
							pathStr[z] = pathStr[z] + " L"+cats[ind].points[i].projected;
							cats[ind].points[i].displayed = true;
							newTracer = cats[ind].points[i].projected;
						}

					} else {

						//Otherwise stop the loop, start at this point next time
						countFrom[z] = i;
						break;
					}

				}

				//If any new points have been added, update the path and the tracer position
				if (newTracer.length > 0) {
					newTracer = newTracer.split(",");
					path[z].attr({"path": pathStr[z]});
					tracer[z].attr({"cx": newTracer[0], "cy": newTracer[1]});
				}
			}
		}

	};

	var InteractiveViewer = function () {

		_createWrapper(function () {

			news.pubsub.on('moveToPosition', function(target){_moveToPosition(target); });
			news.pubsub.on('moveViewer', function(target){_moveViewer(target); });

			paper = new Raphael(constants.shortname+"__viewer__svgContainer", width, height);
			path[0] = paper.path("").attr({"stroke-linejoin": "round", "stroke-linecap": "round","stroke-width": 4, "stroke-opacity": 0.8});
			path[1] = paper.path("").attr({"stroke-linejoin": "round", "stroke-linecap": "round","stroke-width": 4, "stroke-opacity": 0.8});
			path[0].toFront();

			tracer[0] = paper.set();
			tracer[1] = paper.set();

			tracer[0].push(paper.circle(-10,-10,7).attr({"stroke-width": 0, "fill": "#c00"}));
			tracer[0].push(paper.circle(-10,-10,9.5).attr({"stroke-width": 2, "stroke": "#c00", "fill": "none"}));
			tracer[1].push(paper.circle(-10,-10,7).attr({"stroke-width": 0, "fill": "#c00"}));
			tracer[1].push(paper.circle(-10,-10,9.5).attr({"stroke-width": 2, "stroke": "#c00", "fill": "none"}));
			tracer[0].toFront().hide();
			tracer[1].hide();

            videoMarkerPath = paper.path("M0,0Z").attr({"fill": "#000", "stroke-width": 0, "fill-opacity": 0.7}).hide();
            videoMarkerText = paper.text(0,0,"").attr({"fill": "#fff", "font-size": "13px", "text-anchor": "middle", "font-family": "Arial, sans-serif"}).hide();
            
            videoMarkerPath.node.id = 'viewer__videoMarkerPath';
            videoMarkerText.node.id = 'viewer__videoMarkerText';

			//Create source label in lower-right corner
			source = paper.text(width,height,"ORDNANCE SURVEY").attr({"fill": "#fff", "text-anchor":"middle", "font-weight": "bold", "font-size": "11px", "font-family": "Arial, sans-serif"});
			var sourceBBox = source.getBBox();			
			source.attr({"x": width-(sourceBBox.width/2)-4, "y": height-(sourceBBox.height/2)-1});

			//Create the grey rectangle and clock in lower-left corner
			secondsBox = paper.rect(0,height-48,79,48).attr({"stroke-width": 0, "fill": "#fff","fill-opacity": 0.9});
			seconds = paper.text(39,height-34,"0:00").attr({"fill": "#d1700e", "text-anchor":"middle", "font-weight": "bold", "font-size": "22px", "font-family": "Arial, sans-serif"});
			secondUnder = paper.text(39,height-14,"HOURS").attr({"fill": "#d1700e", "text-anchor":"middle", "font-weight": "bold", "font-size": "16px", "font-family": "Arial, sans-serif"});

			//Create legend box
			legendBox = paper.rect(80,height-48,204,48).attr({"stroke-width": 0, "fill": "#fff","fill-opacity": 0.9});			
			legendIntro = paper.text(88,height-25,"Lines represent cat journeys,\ncoloured lines are featured cats").attr({"fill": "#333", "text-anchor":"start", "font-size": "13px", "font-family": "Arial, sans-serif"});


			legendLines[0] = paper.rect(88,height-35,14,3).attr({"fill": "#333", "stroke-width": "0px"}).hide();
			legendLines[1] = paper.rect(88,height-18,14,3).attr({"fill": "#333", "stroke-width": "0px"}).hide();
			legendLabels[0] = paper.text(106,height-35,"Orlando's journey on 00/00/13").attr({"fill": "#333", "text-anchor":"start", "font-size": "13px", "font-family": "Arial, sans-serif"}).hide();
			legendLabels[1] = paper.text(106,height-17,"Phoebe's journey on 00/00/13").attr({"fill": "#333", "text-anchor":"start", "font-size": "13px", "font-family": "Arial, sans-serif"}).hide();

			//Create scale box
			scaleBox = paper.rect(285,height-48,110,48).attr({"stroke-width": 0, "fill": "#fff","fill-opacity": 0.9});		
			scaleLabelMetres = paper.text(294,height-38,"30 metres").attr({"fill": "#333", "text-anchor":"start", "font-size": "13px", "font-family": "Arial, sans-serif"});			
			scaleLabelFeet = paper.text(294,height-11,"30 feet").attr({"fill": "#333", "text-anchor":"start", "font-size": "13px", "font-family": "Arial, sans-serif"});
			scaleLineMetres = paper.rect(294,height-28,0,2).attr({"fill": "#333", "stroke-width": "0px"});
			scaleLineFeet = paper.rect(294,height-22,0,2).attr({"fill": "#333", "stroke-width": "0px"});

			catChanged(0);

		});

		news.pubsub.on('topnavItemClicked', function(position) {
			_moveToPosition(position);
		});

	};

		// probably no need for public functions here?
	InteractiveViewer.prototype = {
	
	   changeViewportWidth: function(){	
			return false;
		} 
	
	};

    return InteractiveViewer;

});
