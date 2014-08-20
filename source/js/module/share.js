// @TODO - remove this and use the new share tools





define(['lib/news_special/bootstrap'], function(news) {
    
    
    news.pubsub.on('personal-share', function(e){
        //personalisedSharing([e]);
    });

    function personalisedSharing(message) {
        var displayStr = "What%20DO%20cats%20get%20up%20to%3F%20I%20followed%20" + message + "%20to%20find%20out.%20How%20about%20you%3F%20%23horizoncats";
        var SHARETOOLS_URL = 'http://static.bbc.co.uk/modules/sharetools/share';
        var APP_ID = 'SecretLifeOfCats';
        var FULL_URL = 'http://www.bbc.co.uk/news/science-environment-22567526';
        var queryStr = "?url=" + FULL_URL + "&title=" + displayStr + '&appId='+APP_ID;
        var myfullShareUrl = SHARETOOLS_URL + queryStr;
        var shareHtml = '<script src="http://static.bbc.co.uk/modules/sharetools/v1/script/sharetools.js" type="text/javascript"></script><div class="bbc-st"><a href="'+myfullShareUrl+'">Share your results</a></div>';

        news.$("div#shareTools").html(shareHtml);
        
        if (window.bbc){
            sharetools = sharetools || {}; 
            // Use existing object or create a new one if sharetools isn't loaded
            // call cleanUpSharetools() to remove duplicate share buttons and to edit the sharetool title. IE handles this differently to Chrome and firefox so call the function twice
            // in IE the onReady event gets called before the line above - the first time this function is called IE does not execute the onReady event and duplicate share buttons appear
            // In chrome and firefox the duplicate buttons appear if not in an onReady event
            sharetools.onReady = function() {
                cleanUpSharetools(message);
            };
            cleanUpSharetools(message);
        }
    }
    
    function cleanUpSharetools(message) {
        // HACK to remove duplicate share buttons from #top-share-toolbar and #bottom-share-toolbar
        news.$("div#bottom-share-toolbar div.bbc-st-wrapper").each(function(indx){
            if (indx !== 0) { news.$(this).hide(); }
        });
        
        news.$("div#top-share-toolbar div.bbc-st-wrapper").each(function(indx) {
            if (indx !== 0) { news.$(this).hide();}
        });
        // change heading next to share buttons
        news.$("div#shareTools h2").html("Share " + message + "'s journey");
    }
        
});