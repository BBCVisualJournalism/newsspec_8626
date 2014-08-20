define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'module/app'], function (news, shareTools, App) {

    return {
        init: function (storyPageUrl) {

            var view = news.$(window).width() >= 976 ? 'desktop' : 'mobile';
            
            news.$('#newsspec_5380').addClass('ns__' + view).removeClass('noJs');

            shareTools.init('.main', {
                storyPageUrl: 'http://www.bbc.co.uk/news/science-environment-22567526',
                header:       'Share this page',
                message:      'BBC News - Secret life of the cat: What do our feline companions get up to?',
                hashtag:      'horizoncats',
                template:     view === 'desktop' ? 'dropdown' : 'default'
            });

            new App(view);

            // fix for mobile - want share tools to appear BELOW content
            news.$('.ns__mobile .share').appendTo(news.$('.ns__mobile'));

            news.sendMessageToremoveLoadingImage();
        }
    };

});
