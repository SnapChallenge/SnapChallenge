GAME.screens['game'] = (function () {
    'use strict';

    var factor = 4,
        lost = false,
        background = {
            x:0,
            y:0,
            width:0,
            height:0,
            fillStyle:"#CCCCCC"
        },
        timeText = {
            x: 0,
            y: 0,
            width: 150,
            height: 50,
            fillStyle: "#4A4A4A",
            font: '30px Arial',
            textFill: "#1F116A",
            text: ""
        },
        movesText = {
            x: 0,
            y: 0,
            width: 150,
            height: 50,
            fillStyle: "#4A4A4A",
            font: '30px Arial',
            textFill: "#1F116A",
            text: "Moves: "
        },
        gameOverScreen = {
            x:0,
            y:0,
            width:0,
            height:0,
            fillStyle:"#FFFFFF",
            font:"20px Arial",
            textFill:"#000000",
            multiline:true,
            text:{
                "0":"",
                "1":"",
                "2":"Good try! :(",
                "3":"",
                "4":"Now challenge your friend!",
                "5":"Click on the New Picture button"
            }
        },
        gameBoard = {
            x:0,
            y:0,
            width:0,
            height:0,
            fillStyle:"#4A4A4A"
        },
        grid,
        gridSize = 4,
        blankTileId = gridSize * gridSize - 1,
        count,
        //keyboard = GAME.Input.Keyboard,
        currentIndex = 0,
        id,
        newX,
        newY,
        oldX,
        oldY,
        midX,
        midY,
        delta,
        deltaX,
        deltaPositive,
        currentImage,
        correctIndex,
        paused,
        gameOver,
        animatingTile,
        lastTime,
        score,
        resetKeys,
        moves,
        slices = [],
        cancelled;

    function initialize() {
        var canvasWidth = GAME.graphics.canvas.width,
            canvasHeight = GAME.graphics.canvas.height,
            yOffset = canvasHeight / 6;
    }

    function swap(blankIndex, i){
        var blank = slices[blankIndex];
        var next = slices[i];
        var swapx = blank.x;
        var swapy = blank.y;
        blank.x = next.x;
        blank.y = next.y;
        next.x = swapx;
        next.y = swapy;
        slices[i] = blank;
        slices[blankIndex] = next;
        if(verify() == true){
            cancelled = true;
            slices[i].isBlank = false;
            console.log('Cancelled: ' + cancelled);
        }
    }

    function setup(blankIndex, i){
        var blank = slices[blankIndex];
        var next = slices[i];
        var swapx = blank.x;
        var swapy = blank.y;
        blank.x = next.x;
        blank.y = next.y;
        next.x = swapx;
        next.y = swapy;
        slices[i] = blank;
        slices[blankIndex] = next;
    }

    function verify(){
        for(var i = 0; i < slices.length; i++){
            if(slices[i].id != i){
                return false;
            }
        }

        return true;
    }

    function onClick(e){
        // Pattern for finding click coordinates found at:
        // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
        var rect = GAME.graphics.canvas.getBoundingClientRect(),
            x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * GAME.graphics.canvas.width),
            y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * GAME.graphics.canvas.height),
            i,
            j,
            index,
            blankIndex,
            blankRow,
            blankCol,
            startX,
            step = gameBoard.width / gridSize,
            startY = gameBoard.y - (gameBoard.height / 2) + (gameBoard.height / (gridSize * 2)),
            initialY = startY,
            initialX = gameBoard.x - (gameBoard.width / 2) + (gameBoard.width / (gridSize * 2));

        for(var i = 0; i < slices.length; i++){
            if((x >= slices[i].x && x <= slices[i].x + slices[i].width) && 
                (y >= slices[i].y && y <= slices[i].y + slices[i].height)){
                var blankId = factor * factor - 1;
                var blankIndex = -1;
                for(var j = 0; j < slices.length; j++){
                    if(slices[j].id == blankId){
                        blankIndex = j;
                        break;
                    }
                }

                var up = true, down = true, left = true, right  = true;

                if ((i + 1) % factor == 0){
                    right = false;
                }

                if(i % factor == 0){
                    left = false;
                }

                if(i < factor){
                    up = false;
                }

                if(i >= factor * (factor - 1)){
                    down = false;
                }
                
                if(i + factor == blankIndex && down == true){
                    swap(blankIndex, i);
                } else if(i - factor == blankIndex && up == true){
                    swap(blankIndex, i);
                } else if(i - 1 == blankIndex && left == true){
                    swap(blankIndex, i);
                } else if(i + 1 == blankIndex && right == true){
                    swap(blankIndex, i);
                }

                break;
            }
        }
    }

    function findBlank(){
        var blankId = factor * factor - 1;
        for(var j = 0; j < slices.length; j++){
            if(slices[j].id == blankId){
                return j;
                break;
            }
        }
    }

    function run() {
        GAME.graphics.canvas.addEventListener('mousedown', onClick, false);
        
        // shuffles the tiles
        var blankId = factor * factor - 1, lastMove = '';
        var stack = [];
        for (var p = 0; p < factor * factor; p++) {
            stack.push(p);
        }

        while(stack.length > 0) {
            var blankIndex = findBlank();
            console.log('Blank: ' + blankIndex);
            var moves = [];

            if (blankIndex - factor >= 0 && lastMove != 'down') {
                moves.push({
                    'move':blankIndex - 3,
                    'title':'up'
                });
            }

            if (blankIndex + factor < factor * factor && lastMove != 'up') {
                moves.push({
                    'move':blankIndex + 3,
                    'title':'down'
                });
            }
            
            if (blankIndex - 1 >= 0 && blankIndex % factor != 0 && lastMove != 'right') {
                moves.push({
                    'move':blankIndex - 1,
                    'title':'left'
                });
            }

            if (blankIndex + 1 < factor * factor && (blankIndex + 1) % factor != 0 && lastMove != 'left') {
                moves.push({
                    'move':blankIndex + 1,
                    'title':'right'
                });
            }

            var index = -1;
            while (stack.indexOf(index) == -1) {
                if (moves.length > 1) {
                    index = Random.getRandomInteger(moves.length - 1);
                } else {
                    index = 0;
                }
            }
            
            console.log('Index: ' + index);
            var toRemove = stack.indexOf(index);
            if (toRemove == -1){
                break;
            } else {
                stack.splice(toRemove, 1);
            }

            setup(blankIndex, moves[index]['move']);
        }

        /*
        for (var t = 0; t < 500; t++){
            var blankIndex = -1;
            for(var j = 0; j < slices.length; j++){
                if(slices[j].id == blankId){
                    blankIndex = j;
                    break;
                }
            }

            var moves = [];

            if (blankIndex - factor >= 0 && lastMove != 'down') {
                moves.push({
                    'move':blankIndex - 3,
                    'title':'up'
                });
            }

            if (blankIndex + factor < factor * factor && lastMove != 'up') {
                moves.push({
                    'move':blankIndex + 3,
                    'title':'down'
                });
            }
            
            if (blankIndex - 1 >= 0 && blankIndex % factor != 0 && lastMove != 'right') {
                moves.push({
                    'move':blankIndex - 1,
                    'title':'left'
                });
            }

            if (blankIndex + 1 < factor * factor && (blankIndex + 1) % factor != 0 && lastMove != 'left') {
                moves.push({
                    'move':blankIndex + 1,
                    'title':'right'
                });
            }

            var index = 0;
            if (moves.length > 1) {
                index = Random.getRandomInteger(moves.length - 1);
            }
            
            setup(blankIndex, moves[index]['move']);
            lastMove = moves[index].title;
        }
        */

        cancelled = false;
        lastTime = performance.now();
        id = window.requestAnimationFrame(gameLoop);
    }

    function restart(){
        keyboard.registerCommand(KeyEvent.DOM_VK_BACK_SPACE, onPause);

        GAME.graphics.canvas.addEventListener('mousedown', onClick, false);

        cancelled = false;
        paused = false;

        lastTime = performance.now();
        id = window.requestAnimationFrame(gameLoop);
    }

    function onGameOver(){
        render();

        gameOverScreen.text["1"] = "Total Moves: " + moves
        gameOverScreen.text["2"] = " Total Time: " + Math.floor(count);
        
        gameOver = true;
        cancelled = true;

        keyboard.clearCommands(),
        keyboard.registerCommand(KeyEvent.DOM_VK_Y, goBack);
        keyboard.registerCommand(KeyEvent.DOM_VK_N, run);

        GAME.graphics.canvas.removeEventListener('mousedown', onClick, false);

        addScores();
        showGameOver();
    }

    function update(elapsedTime) {
        var blankId = factor * factor - 1;
        for(var j = 0; j < slices.length; j++){
            if(slices[j].id == blankId){
                slices[j].time -= elapsedTime;
                if(slices[j].time < 0){
                    cancelled = true;
                    lost = true;
                    console.log('Cancelled: ' + cancelled);
                }
                break;
            }
        }
    }

    function render() {
        
        for(var p = 0; p < slices.length; p++){
            GAME.graphics.drawSubImage(slices[p]);
        }

        if (cancelled === true && lost === false){
            alert('Congrats, you solved the puzzle!');
        }

        if(lost == true){
            gameOverScreen.x = GAME.graphics.canvas.width / 2;
            gameOverScreen.y = GAME.graphics.canvas.height / 2;
            gameOverScreen.width = GAME.graphics.canvas.width;
            gameOverScreen.height = GAME.graphics.canvas.height;

            GAME.graphics.drawRect(gameOverScreen);
            GAME.graphics.drawText(gameOverScreen);
        }
    }

    function gameLoop(timestamp) {
        var elapsedTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update(elapsedTime);
        render();
        if (cancelled === false) {
            id = window.requestAnimationFrame(gameLoop);
        }
    }

    function stop(){
        cancelled = true;
        lost = true;
    }

    function sliceImage(img, time){
        var size = img.width / factor,
        coords = [];
        for (var i = 0; i < factor; i++){
            for(var j = 0; j < factor; j++){
                coords.push({
                    id: factor * i + j,
                    x: size * j,
                    y: size * i
                });
                slices.push({
                    id: factor * i + j,
                    image: img,
                    x: size * j,
                    y: size * i,
                    subx: size * j,
                    suby: size * i,
                    width: size,
                    height: size,
                    isBlank: false,
                    time: time
                });
            }
        }

        slices[slices.length - 1].isBlank = true;

        for(var p = 0; p < slices.length; p++){
            slices[p].x = coords[p].x;
            slices[p].y = coords[p].y;
        }

        run();
    }

    return {
        stop: stop,
        initialize: initialize,
        run: run,
        sliceImage: sliceImage
    };
}());
