define(['lib/news_special/bootstrap','module/top_nav__desktop','module/top_nav__mobile'], function (news, DesktopTopNav, ResponsiveTopNav) {
     
    var TopNav = function (view) {
        if (view === 'desktop') {
            return new DesktopTopNav();
        }
        if (view === 'mobile') {
            return new ResponsiveTopNav();
        }
    };


    TopNav.prototype = {

        foo: function () {

        }

    };

    return TopNav;

});