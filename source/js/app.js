define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'module/app', 'module/journey'], function (news, shareTools, App, journey) {

    return {
        init: function (storyPageUrl) {

            var view = news.$(window).width() >= 976 ? 'desktop' : 'mobile';
            
            news.$('#newsspec_5380').addClass('ns__' + view).removeClass('noJs');

            shareTools.init('.main', {
                storyPageUrl: 'http://bbc.in/14WYuxQ',
                header:       'Share this page',
                message:      'BBC News - Secret life of the cat: What do our feline companions get up to?',
                hashtag:      'horizoncats',
                template:     view === 'desktop' ? 'dropdown' : 'default'
            });

            new App(view);

            // fix for mobile - want share tools to appear BELOW content
            news.$('.ns__mobile .share').appendTo(news.$('.ns__mobile'));

            news.pubsub.on('moveToPosition', updateShare);
            news.pubsub.on('topnavItemClicked', updateShare);

            function updateShare(position) {
                if (view === 'desktop') {
                    var cat = journey['point_' + position].header,
                        shareMessage = 'What DO cats get up to? I followed ' + cat + ' to find out. How about you?';

                    news.pubsub.emit('ns:share:message', [shareMessage]);
                    news.$('.ns__desktop .share .share__button p').html("Share " + cat + "'s journey");
                }
            }

            news.sendMessageToremoveLoadingImage();
        }
    };

});
