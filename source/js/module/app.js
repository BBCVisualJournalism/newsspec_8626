define(['lib/news_special/bootstrap', 'module/top_nav', 'module/viewer','module/panel', 'module/video_loader', 'module/constants','module/istat-tracking','lib/range'], 
	function (news, TopNav, InteractiveViewer, Panel, VideoLoader, constants, track) {

    _shouldRespond = function(viewer){
		if(viewer.changeViewportWidth() === true){
			news.pubsub.emit('panelShouldExtend');
		}else{
			news.pubsub.emit('removeExtended');
		}
	};   

	var Cats = function (view) { 
		var viewer,
			topnav;

		topnav = new TopNav(view);
		viewer = new InteractiveViewer(view);
		news.pubsub.on('panelInitialised', function() {
			news.pubsub.emit('moveToPosition',[1]);
			news.pubsub.emit('showPanelContainer');
		});
		VideoLoader.getReady();
		new Panel(view);

		_shouldRespond(viewer);

		news.pubsub.on('shouldRespond', function() {
			_shouldRespond(viewer);
		});

		window.onresize = function(){
			_shouldRespond(viewer);
		};
	};

	Cats.prototype = {



	};

	return Cats;
		
});