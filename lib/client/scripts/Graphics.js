GAME.graphics = (function () {
    'use strict';

    var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d');

    // Draws an image with the center at x, y
    function drawImage(spec) {
    	//console.log(spec);
        context.drawImage(spec.image, (spec.x - (spec.width / 2)), (spec.y - (spec.height / 2)), spec.width, spec.height);
    }

    function drawSubImage(spec){
        //console.log(spec);
        if(spec.isBlank === false){
            context.drawImage(
                spec.image,
                spec.subx, 
                spec.suby, 
                spec.width, 
                spec.height,
                spec.x, 
                spec.y, 
                spec.width, 
                spec.height
            );
        } else {
            spec.fillStyle = '#FFFFFF';
            drawNewRect(spec);
            var timeText = {
                x: spec.x + spec.width / 2,
                y: spec.y + spec.height / 2,
                width: spec.width,
                height: spec.height,
                fillStyle: "#4A4A4A",
                font: '50px Arial',
                textFill: "#000000",
                text: Math.ceil(spec.time)
            };
            drawText(timeText);
        }
    }

    // Draws an alternate image (used for selected items in a menu) with the center at x, y
    function drawAltImage(spec) {
        context.drawImage(spec.altImage, (spec.x - (spec.width / 2)), (spec.y - (spec.height / 2)), spec.width, spec.height);
    }

    // Draws a rect with the center at x, y
    function drawNewRect(spec) {
        context.fillStyle = spec.fillStyle;
        context.fillRect(spec.x, spec.y, spec.width, spec.height);
    }

    // Draws a rect with the center at x, y
    function drawRect(spec) {
        context.fillStyle = spec.fillStyle;
        context.fillRect((spec.x - (spec.width / 2)), (spec.y - (spec.height / 2)), spec.width, spec.height);
    }

    // Measures text height
    function getTextHeight(spec) {
        var height;

        context.save();
        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        height = context.measureText('m').width;
        context.restore();

        return height;
    }

    // Computes the width of a string in a certain style
    function getTextWidth(spec, key) {
        var width;

        context.save();
        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        if (spec.hasOwnProperty("multiline")) {
            width = context.measureText(spec.text[key]).width;
        } else {
            width = context.measureText(spec.text).width;
        }
        
        context.restore();

        return width;
    }

    // Draws text in the center
    function drawText(spec) {
        console.log(spec);
        var key, offset;
        context.textBaseline = "middle";
        context.font = spec.font;
        context.fillStyle = spec.textFill;
        if (spec.hasOwnProperty("multiline")) {
            offset = spec.height / getTextHeight(spec) + 7;
            for (key in spec.text) {
                context.fillText(spec.text[key], (spec.x - (getTextWidth(spec, key) / 2)), spec.y - (spec.height / 2) + offset);
                offset += getTextHeight(spec) + 10;
            }
        } else {
            context.fillText(spec.text, spec.x - (getTextWidth(spec) / 2), spec.y);
        }
    }

    function drawAltText(spec){
    	var key, offset;
        context.textBaseline = "middle";
        context.font = spec.font;
        context.fillStyle = spec.altFill;
        if (spec.hasOwnProperty("multiline")) {
            offset = spec.height / getTextHeight(spec) + 7;
            for (key in spec.text) {
                context.fillText(spec.text[key], (spec.x - (getTextWidth(spec, key) / 2)), spec.y - (spec.height / 2) + offset);
                offset += getTextHeight(spec) + 10;
            }
        } else {
            context.fillText(spec.text, spec.x - (getTextWidth(spec) / 2), spec.y);
        }
    }

    // Draws a special component (used in particle animations)
    function drawComponent(spec) {
        context.save();
        context.translate(spec.center.x, spec.center.y);
        if (spec.hasOwnProperty('rotation')) {
            context.rotate(spec.rotation * Math.PI / 180);
        }

        context.translate(-1 * spec.center.x, -1 * spec.center.y);

        if (spec.hasOwnProperty('size')) {
            context.drawImage(
                spec.image,
                spec.center.x - spec.size / 2,
                spec.center.y - spec.size / 2,
                spec.size,
                spec.size);
        }

        context.restore();
    }

    return {
    	canvas:canvas,
        context:context,
		drawImage:drawImage,
        drawSubImage:drawSubImage,
		drawAltImage:drawAltImage,
		drawRect:drawRect,
		drawText:drawText,
		drawAltText:drawAltText,
		drawComponent:drawComponent
    };

}());
