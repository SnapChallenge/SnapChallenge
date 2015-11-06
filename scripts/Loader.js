var GAME = {
    images: {},
    sounds: {},
    screens: {},

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
				// load other resources up here
				'preload!images/smoke.png',
				'preload!images/fire.png',

				'preload!images/Tile64-0.png',
				'preload!images/Tile64-1.png',
				'preload!images/Tile64-2.png',
				'preload!images/Tile64-3.png',
				'preload!images/Tile64-4.png',
				'preload!images/Tile64-5.png',
				'preload!images/Tile64-6.png',
				'preload!images/Tile64-7.png',
				'preload!images/Tile64-8.png',
				'preload!images/Tile64-9.png',
				'preload!images/Tile64-10.png',
				'preload!images/Tile64-11.png',
				'preload!images/Tile64-12.png',
				'preload!images/Tile64-13.png',
				'preload!images/Tile64-14.png',
				'preload!images/Tile64-15.png',
				'preload!images/Tile64-16.png',
				'preload!images/Tile64-17.png',
				'preload!images/Tile64-18.png',
				'preload!images/Tile64-19.png',
				'preload!images/Tile64-20.png',
				'preload!images/Tile64-21.png',
				'preload!images/Tile64-22.png',
				'preload!images/Tile64-23.png',
				'preload!images/Tile64-24.png',
				'preload!images/Tile64-25.png',
				'preload!images/Tile64-26.png',
				'preload!images/Tile64-27.png',
				'preload!images/Tile64-28.png',
				'preload!images/Tile64-29.png',
				'preload!images/Tile64-30.png',
				'preload!images/Tile64-31.png',
				'preload!images/Tile64-32.png',
				'preload!images/Tile64-33.png',
				'preload!images/Tile64-34.png',
				'preload!images/Tile64-35.png',
				'preload!images/Tile64-36.png',
				'preload!images/Tile64-37.png',
				'preload!images/Tile64-38.png',
				'preload!images/Tile64-39.png',
				'preload!images/Tile64-40.png',
				'preload!images/Tile64-41.png',
				'preload!images/Tile64-42.png',
				'preload!images/Tile64-43.png',
				'preload!images/Tile64-44.png',
				'preload!images/Tile64-45.png',
				'preload!images/Tile64-46.png',
				'preload!images/Tile64-47.png',
				'preload!images/Tile64-48.png',
				'preload!images/Tile64-49.png',
				'preload!images/Tile64-50.png',
				'preload!images/Tile64-51.png',
				'preload!images/Tile64-52.png',
				'preload!images/Tile64-53.png',
				'preload!images/Tile64-54.png',
				'preload!images/Tile64-55.png',
				'preload!images/Tile64-56.png',
				'preload!images/Tile64-57.png',
				'preload!images/Tile64-58.png',
				'preload!images/Tile64-59.png',
				'preload!images/Tile64-60.png',
				'preload!images/Tile64-61.png',
				'preload!images/Tile64-62.png',
				'preload!images/Tile64-63.png',

				'preload!images/Tile128-0.png',
				'preload!images/Tile128-1.png',
				'preload!images/Tile128-2.png',
				'preload!images/Tile128-3.png',
				'preload!images/Tile128-4.png',
				'preload!images/Tile128-5.png',
				'preload!images/Tile128-6.png',
				'preload!images/Tile128-7.png',
				'preload!images/Tile128-8.png',
				'preload!images/Tile128-9.png',
				'preload!images/Tile128-10.png',
				'preload!images/Tile128-11.png',
				'preload!images/Tile128-12.png',
				'preload!images/Tile128-13.png',
				'preload!images/Tile128-14.png',
				'preload!images/Tile128-15.png',

                'preload!scripts/Random.js',
				'preload!scripts/Graphics.js',
				'preload!scripts/Input.js',
				'preload!scripts/Particles.js',
				'preload!scripts/Storage.js',
				'preload!scripts/Credits.js',
				'preload!scripts/HighScores.js',
				'preload!scripts/EasyGame.js',
				'preload!scripts/HardGame.js',
				'preload!scripts/Menu.js',
				'preload!scripts/Game.js',
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

    return resource;
});
