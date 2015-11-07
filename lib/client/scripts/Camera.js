GAME.camera = (function () {
    'use strict';

    var started = false;

    function start(){
        console.log('starting...');
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
        video.style.width = 400;
        video.style.height = 400;
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
        GAME.graphics.drawRect({
            x:GAME.graphics.canvas.width / 2,
            y:GAME.graphics.canvas.height / 2,
            fillStyle:"#000033",
            width:GAME.graphics.canvas.width,
            height:GAME.graphics.canvas.height
        });
        GAME.graphics.drawImage({
            image: video,
            x: video.width / 2,
            y: video.height / 2,
            width: 400,
            height: 300
        });
        video.style.width = 0;
        video.style.height = 0;
        GAME.graphics.canvas.style.width = video.width;
        GAME.graphics.canvas.style.height = video.height;
        GAME.graphics.canvas.style.display = 'block';
    }

    function restart(){
        var video = document.getElementById('video');
        video.style.width = 400;
        video.style.height = 400;
        GAME.graphics.canvas.style.display = 'none';
    }

    // This will probably move to another file at some point
    function load(){
        var img = new Image();
        GAME.api.getSnap('fakeid').then(function (snap) {
            //console.log('/getSnap response:', snap);
            //img.src = snap.image;
            img.src = GAME.graphics.canvas.toDataURL("image/png"); // temporary
            img.onload = function(){
                GAME.graphics.drawImage({
                    image: this,
                    x: video.width / 2,
                    y: video.height / 2,
                    width: video.width,
                    height: video.height
                });
                GAME.screens['game'].sliceImage(this);
            }
        }).catch(function (error) {
            console.log(error);
        });

    }

    function send(){
        var dataURL = GAME.graphics.canvas.toDataURL("image/png");
        console.log(dataURL);
        GAME.api.sendSnap(dataURL, 'fakeid', 10/*fake duration*/).then(function (res) {
            console.log('/sendSnap status:', res.status);
        }).catch(function (error) {
            console.log(error);
        });
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
