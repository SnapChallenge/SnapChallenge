GAME.camera = (function () {
    'use strict';

    var started = false;

    function start(){
        var video = document.getElementById('video'),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};

        if(started == false){
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

            started = true;
        }

        document.getElementById('start').disabled = true;
        video.style.visibility = 'visible';
        video.style.width = 640;
        video.style.height = 480;
        GAME.graphics.canvas.style.display = 'none';

        var captureButton = document.getElementById('capture');
        captureButton.disabled = false;
    }

    function capture(){
        var startButton = document.getElementById('start');
        startButton.innerHTML = 'New Picture';
        startButton.disabled = false;

        var captureButton = document.getElementById('capture');
        captureButton.disabled = true;

        var video = document.getElementById('video');
        
        GAME.graphics.drawImage({
            image: video,
            x: video.width / 2,
            y: video.height / 2,
            width: video.width,
            height: video.height
        });
        video.style.width = 0;
        video.style.height = 0;
        GAME.graphics.canvas.style.display = 'block';
    }

    function restart(){
        var video = document.getElementById('video');
        video.style.width = 640;
        video.style.height = 480;
        GAME.graphics.canvas.style.display = 'none';
    }

    // this will probably move to another file at some point
    function load(){
        var img = new Image();
        img.src = GAME.graphics.canvas.toDataURL('image/png'); // this will come from the server
        img.onload = function(){
            GAME.graphics.drawImage({
                image: this,
                x: video.width / 2,
                y: video.height / 2,
                width: video.width,
                height: video.height
            });
            //GAME.screens['game'].run();
            GAME.screens['game'].sliceImage(this);
        }
    }

    function send(){
        var dataURL = GAME.graphics.canvas.toDataURL("image/png");
        console.log(dataURL);
        // send to server here
    }

    return {
        video: video,
        start: start,
    	capture: capture,
        send: send,
        restart: restart,
        load: load
    };

}());
