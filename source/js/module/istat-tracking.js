define(['lib/news_special/bootstrap'], function(news) {

    news.pubsub.on('moveToPosition', function (target) {
        news.pubsub.emit('istats', ['navigation', 'newsspec-interaction', 'Moved to position ' + target]);
    });

    news.pubsub.on('panelExtend', function (target) {
        news.pubsub.emit('istats', ['extendedContent', 'newsspec-interaction', 'Media panel shown for ' + target]);
    });

    //cats navigation is clicked
    news.pubsub.on('topnavItemClicked', function (target) {
        news.pubsub.emit('istats', ['topNavUsed', 'newsspec-interaction', 'Top nav item clicked for ' + target]);
    });

    //extended panel opened from viewer (labels)
    news.pubsub.on('labelClicked', function (target) {
        news.pubsub.emit('istats', ['extendedContentFiredFromLabel', 'newsspec-interaction', 'Media panel from label shown for ' + target]);
    });

    //interaction started from viewer
    news.pubsub.on('introImageMapClicked', function () {
        news.pubsub.emit('istats', ['interactionStartedFromViewer', 'newsspec-interaction', 'Intro imagemap used']);
    });

});