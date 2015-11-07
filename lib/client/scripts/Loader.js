var GAME = {
    images: {},
    sounds: {},
    screens: [],

    status: {
        preloadRequest: 0,
        preloadComplete: 0
    }
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function () {
    console.log('Loading resources...');
    Modernizr.load([
        {
            load: [
                'preload!scripts/Random.js',
                'preload!scripts/Graphics.js',
                'preload!scripts/Input.js',
                'preload!scripts/Particles.js',
                'preload!scripts/Storage.js',
                'preload!scripts/Controller.js',
                'preload!scripts/Camera.js',
                'preload!scripts/api.js',
                'preload!scripts/data.js',
                'preload!scripts/Game.js'
            ],
            complete: function () {
                console.log('All files requested for loading...');
            }
        }
    ]);
}, false);
//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
// * Places sounds into the 'sounds' object
yepnope.addPrefix('preload', function (resource) {
    console.log('preloading: ' + resource.url);

    GAME.status.preloadRequest += 1;
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    var isSound = /.+\.(mp3|wav)$/i.test(resource.url);
    resource.noexec = isImage || isSound;
    resource.autoCallback = function (e) {
        if (isImage) {
            var image = new Image();
            image.src = resource.url;
            GAME.images[resource.url] = image;
        } else if (isSound) {
            var sound = new Audio(resource.url);
            console.log(resource.url);
            GAME.sounds[resource.url] = sound;
        }

    GAME.status.preloadComplete += 1;

        // Once loaded, start the controller
    if (GAME.status.preloadComplete === GAME.status.preloadRequest) {
            console.log('Preloading complete!');
            GAME.Controller.initialize();
        }
    };

    var start = document.getElementById('new');
    start.clickTime = null;
    start.addEventListener('click', function(){
        var currentTime = new Date();
        if (currentTime - start.clickTime < 1000) {
            return;
        };
        start.clickTime = currentTime;
        GAME.camera.show();
    });

    var capture = document.getElementById('capture');
    capture.clickTime = null;
    capture.addEventListener('click', function() {
        var currentTime = new Date();
        if (currentTime - capture.clickTime < 1000) {
            return;
        };
        capture.clickTime = currentTime;
    	GAME.camera.capture();
    });

    return resource;
});




