define(['lib/news_special/bootstrap', 'bump-3'], function (news, bump) {

    var VideoLoader = function () {
        this.emp             = {};
        this.videoContainer  = '.cats__extended-panel__med';
        this.videoLoadedFlag = 'cats__extended-panel__med--videoLoaded';
    };

    VideoLoader.prototype = {

        getReady: function () {
            this.defineEvents();
            this.subscribeToEvents();
        },

        defineEvents: function () {
            news.pubsub.on('panelExtend', function (data) {
                setTimeout(function () {
                    var video = news.$('#newsspec_5380 .cats__panel__extended .cats__extended-panel__med');
                    news.pubsub.emit('videos:load', [video]);
                }, 1000);
            });
        },

        subscribeToEvents: function () {

            var VideoLoader = this;

            news.pubsub.on('videos:load', function (carouselLargeItem) {
                VideoLoader.removeVideos();
                VideoLoader.loadVideo(carouselLargeItem);
            });

            news.pubsub.on('view:updated',   function () { VideoLoader.removeVideos(); });
            news.pubsub.on('panel:changed', function () { VideoLoader.removeVideos(); });
        },

        loadVideo: function (video) {

            var playlist     = video.attr('data-playlist'),
                autoplay     = video.attr('data-autoplay') === 'true',
                uniqueKey    = 'ns-player--' + new Date().getTime();

            if (video.length > 0) {
                video.append('<div id="' + uniqueKey + '" class="ns_media_content"></div>');
                this.emp = {
                    elm: news.$('#' + uniqueKey),
                    player: bump('#' + uniqueKey).player({
                        product :      'news',
                        playerProfile: playlist,
                        responsive:    true,
                        autoplay:      autoplay
                    })
                };

                video.addClass(this.videoLoadedFlag);
                this.emp.player.load(playlist);
            }
        },

        removeVideos: function () {
            news.$('.' + this.videoLoadedFlag).removeClass(this.videoLoadedFlag);
            news.$('.ns_media_content').remove();
        }

    };

    return new VideoLoader();

});