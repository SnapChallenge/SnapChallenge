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

        document.getElementById('new').disabled = false;
        document.getElementById('capture').disabled = true;

        var img = new Image();
        img.onload = function(){
            GAME.graphics.drawImage({
                image: this,
                x: GAME.graphics.canvas.width / 2,
                y: GAME.graphics.canvas.height / 2,
                width: GAME.graphics.canvas.width,
                height: GAME.graphics.canvas.height
            });
        }
        img.src = 'images/shuffled_ghost.png';
    }

    function capture(){
        GAME.screens['game'].stop();
        var startButton = document.getElementById('new');
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

    function show(){
        var video = document.getElementById('video');
        video.style.width = 400;
        video.style.height = 400;
        GAME.graphics.canvas.style.display = 'none';
        document.getElementById('new').disabled = true;
        document.getElementById('capture').disabled = false;
    }

    // This will probably move to another file at some point
    function load(){
        var img = new Image();
        var time = parseInt(this.getAttribute('data-duration'));
        img.src = this.getAttribute('data-image');
        img.onload = function(){
            GAME.graphics.drawImage({
                image: this,
                x: video.width / 2,
                y: video.height / 2,
                width: video.width,
                height: video.height
            });
            GAME.screens['game'].sliceImage(this, time);
        }
    }

    function send(event){
        var dataURL = GAME.graphics.canvas.toDataURL('image/png');
        var duration = parseInt(document.getElementById('dropdown').value);
        var recipient = this.getAttribute('data-recipient');
        GAME.api.sendSnap(dataURL, recipient, duration).then(function (res) {
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
        show: show,
        load: load
    };

}());
