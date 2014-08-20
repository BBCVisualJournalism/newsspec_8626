module.exports = function (grunt) {

    // *************************************************************************
    // REQUIRE PATHS
    // Add any paths here you want shortened. Relative to the 'js' dir.
    // *************************************************************************

    var amdModulePaths = {
        'pubsub':       './lib/vendors/jquery/pubsub',
        'istats':       './lib/vendors/istats/istats',
        'bump-3':       './lib/vendors/bump-3/bump-3',
        // bump dependencies
        'swfobject-2':  './lib/vendors/swf/swfobject-2',
        'jquery-1.9':   './lib/vendors/jquery/jquery-1.9.1-version_for_bump'
    };

    // *************************************************************************
    // GRUNT CONFIG
    // You shouldn't need to edit anything below here
    // *************************************************************************

    var _ = require('lodash-node');
    
    var desktopAssets = grunt.config.get('config').desktopAssets;

    // override amdModulePaths for building the all.js without desktop assets
    var modulesPulledIntoAllJS = {};
    for (var i = 0; i < desktopAssets.length; i++) {
        modulesPulledIntoAllJS[desktopAssets[i]] = 'empty:';
    }

    // override amdModulePaths for requirejs config that is passed to host
    var requireJSConfig = {};
    for (var i = 0; i < desktopAssets.length; i++) {
        requireJSConfig[desktopAssets[i]] = './' + desktopAssets[i];
    }

    modulesPulledIntoAllJS = _.merge(modulesPulledIntoAllJS, amdModulePaths);
    requireJSConfig = _.merge(requireJSConfig, amdModulePaths);

    grunt.config(['amdModulePaths'], requireJSConfig);

    grunt.config(['requirejs', 'build'], {
        options: {
            baseUrl: './source/js',
            paths: modulesPulledIntoAllJS,
            optimize: 'uglify2',
            generateSourceMaps: true,
            preserveLicenseComments: false,
            name: './app',
            out: './content/<%= config.services.default %>/js/all.js'
        }
    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
};