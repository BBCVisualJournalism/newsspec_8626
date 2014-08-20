/*
 * Module is responsible for the top navigation
 * emitting events: topnav item clicked
 * listening to events: TODO...
*/
define(['lib/news_special/bootstrap', 'module/desktop/svg-cats', 'module/constants'],
	function(news, svgCats, constants) {

		var that = this;

		that.catsLookup = {
			1: 'intro',
			2: 'Ginger',
			3: 'Chip',
			4: 'Sooty',
			5: 'Orlando',
			6: 'Hermie',
			7: 'Phoebe',
			8: 'Deebee',
			9: 'Kato',
			10: 'Coco',
			11: 'Rosie',
			'intro' :1,
			'Ginger' :2,
			'Chip' :3,
			'Sooty' :4,
			'Orlando' :5,
			'Hermie' :6,
			'Phoebe' :7,
			'Deebee' :8,
			'Kato' :9,
			'Coco' :10,
			'Rosie' :11
		};

    var _createTopNavigationWrapper = function(callback) {
      var el = document.createElement('DIV'),
          container = document.getElementById(constants.project);
      el.setAttribute('id', constants.shortname + '__top-nav');
      el.className = constants.shortname + '__top-nav__svg';
      
      if (container !== null) {
        container.appendChild(el);
      }
      callback();
    };


		var _draw = function () {
      var w = 980, h = 330;
      that.paper = new Raphael(constants.shortname+'__top-nav', w, h);
      that.bg = paper.rect(0,0, w, h).attr({fill: '#ffffff', opacity: 0}); // add a bg element to pick up off-target mouse events
      that.catRef = {};
      that.cats = paper.set();
      for (var i = 0; i < svgCats.length; i++) {
        var e = svgCats[i];
        var n = e.name.replace("On", "");

        paper.setStart();
        paper.add(e.paths["layer_0"]);
        var on = paper.setFinish().hide(); // Start with the "on" state hidden

        paper.setStart();
        paper.add(e.paths["layer_1"]);
        var off = paper.setFinish();

        paper.setStart();
        paper.add(e.paths["layer_2"]);
        var label = paper.setFinish().hide();

        var cat = paper.set(); // Make a set comprising the on and off states of a single cat
        cat.push(on, off, label);
        cat.data({
          "set": cat,
          "on": on,
          "off": off,
          "label": label,
          "name": n,
          "hovered": false,
          "active": false,
          "visible": false
        });
        cat.attr("cursor", "pointer");
        that.cats.push(cat);
        that.catRef[n] = cat;
      }
		};

		var _bind = function () {
      that.activeSet = null;
      that.hoveredSet = null;
      that.introActive = true;

      that.getElement = function (set) {
        // Data is stored on the actual elements, NOT the set itself - return the first element of a set to access the data
        return set[0][0][0];
      };

      that.swap = function (el) {
          // Logic for controlling visibily of cats
          if (el.data("visible")) {
            el.data("on").hide();
            el.data("off").show();
            el.data("visible", false);
          } else {
            el.data("off").hide();
            el.data("on").show();
            el.data("visible", true);
          }
      };

      that.label = function (el, on) {
        if (on) {
          el.data("label").show();
        } else {
          el.data("label").hide();
        }
      };

      that.bg.mousemove(function () {
        if (that.hoveredSet) {
          that.label(that.getElement(that.hoveredSet), false);
          if (that.getElement(that.hoveredSet).data("visible") && that.hoveredSet !== that.activeSet && !that.introActive) {
            that.swap(that.getElement(that.hoveredSet));
          }
          //maybe here
          that.hoveredSet = null;
        }
      });

      // Hovers
      that.cats.mousemove(function (event) {
        var oldSet = that.hoveredSet || false;
        that.hoveredSet = this.data('set');

        if (that.hoveredSet !== oldSet) {
          // ALWAYS labels on hover
          if (oldSet) {
            that.label(that.getElement(oldSet), false);
          }
          that.label(that.getElement(that.hoveredSet), true);

          if (!that.introActive) {
            // NOT currently active && currently visible -> swap
            if (oldSet && oldSet !== that.activeSet) {
              that.swap(that.getElement(oldSet));
            }

            // Currently hovered and NOT active -> swap
            if (that.hoveredSet !== that.activeSet){
              that.swap(that.getElement(that.hoveredSet));
            }
          }
        }
      });

      // Clicks
      that.cats.forEach(function (e, i) {
        e[0][0].click(function (event) { // Bind on the set elements for individual SVG oaths of single cats
          var set = this.data("set");
          if (!this.data("active")) {

            // Turn off intro
            if (that.introActive) {
              for (i = 0; i < that.cats.length; i++) {
                that.swap(that.getElement(that.cats[i]));
              }
              that.introActive = false;
            }

            // turn off old
            if (that.activeSet) {
              that.swap(that.getElement(that.activeSet));
              that.activeSet.data("active", false);
            }

            set.data("active", true);
            that.activeSet = set;
            if (that.getElement(that.activeSet).data("visible") === false) {
              that.swap(that.getElement(that.activeSet));
            }
            // EVENT HOOK FOR CAT ***ON*** HERE
            news.pubsub.emit('topnavItemClicked', [that.catsLookup[this.data("name")]]);
          }
        });
      });
		};

		var _select = function (cat) {
      // Select a cat base on name...
      var ref = that.catRef[cat], i;
			if (ref || cat === "intro") {
        if (cat === "intro") {
          // Special case, light up all cats
          for (i = 0; i < that.cats.length; i++) {
            var c = that.getElement(that.cats[i]);
            if (c.data("visible") === false) {
              that.swap(c);
            }
          }
          that.introActive = true;
          that.activeSet = null;
        } else {
          if (that.introActive) {
            for (i = 0; i < that.cats.length; i++) {
              that.swap(that.getElement(that.cats[i]));
            }
            that.introActive = false;
          }
          var set = ref.data("set");
          if (!that.getElement(ref).data("active")) {
            if (that.activeSet) {
              that.swap(that.getElement(that.activeSet));
              that.activeSet.data("active", false);
            }
            that.swap(that.getElement(ref));
            that.activeSet = ref;
          }
        }
			}
		};

    var TopNav = function() { 

      _createTopNavigationWrapper(function(){
        _draw();
        _bind();

        //Public API
        news.pubsub.on('moveToPosition', function(position) {
          _select(that.catsLookup[position]);
          //console.log(position)
        });

        news.pubsub.on('viewerItemClicked', function(position) {
          _select(that.catsLookup[position]);
        });

        news.pubsub.on('navMouseOut', function(position) {
          if (that.hoveredSet) {
            var el = that.getElement(that.hoveredSet);
            if (el.data("visible") && !that.introActive && that.hoveredSet !== that.activeSet) {
              that.swap(el);
            }
            that.label(el, false);
            that.hoveredSet = null;
          }
        });
      });
    };

    TopNav.prototype = {


    };

    return TopNav;

});