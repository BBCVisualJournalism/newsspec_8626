define(['lib/news_special/bootstrap','module/viewer__desktop','module/viewer__mobile'], function (news, DesktopViewer, ResponsiveViewer) {
     
    var Viewer = function (view) {
        if (view === 'desktop') {
            return new DesktopViewer();
        }
        if (view === 'mobile') {
            return new ResponsiveViewer();
        }
    };


    Viewer.prototype = {

        foo: function () {

        }

    };

    return Viewer;

});