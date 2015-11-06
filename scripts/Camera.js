GAME.camera = (function () {
    'use strict';

    function start(){
        var video = document.getElementById('video'),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};

        // Put video listeners into place
	    if(navigator.getUserMedia) { // Standard
	    	console.log("USER MEDIA");
		    navigator.getUserMedia(videoObj, function(stream) {
			    video.src = stream;
			    video.play();
		    }, errBack);
	    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		    navigator.webkitGetUserMedia(videoObj, function(stream){
			    video.src = window.webkitURL.createObjectURL(stream);
			    video.play();
		    }, errBack);
	    }
	    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		    navigator.mozGetUserMedia(videoObj, function(stream){
			    video.src = window.URL.createObjectURL(stream);
			    video.play();
		    }, errBack);
	    }
    }

    function capture(){
        var video = document.getElementById('video');
        GAME.graphics.drawImage({
            image: video,
            x: video.width / 2,
            y: video.height / 2,
            width: video.width,
            height: video.height
        });
        console.log('on canvas');
    }

    function send(){
        var dataURL = GAME.graphics.canvas.toDataURL("image/png");
        console.log(dataURL);
    }

    return {
        video: video,
        start: start,
    	capture: capture,
        send: send
    };

}());
