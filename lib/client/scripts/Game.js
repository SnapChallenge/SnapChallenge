GAME.screens['game'] = (function () {
    'use strict';

    var background = {
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
            fillStyle:"#46E89C",
            font:"20px Arial",
            textFill:"#663199",
            multiline:true,
            text:{
                "0":"WINNER!",
                "1":"Moves ",
                "2":"Time",
                "3":"Press Y to exit or N to start a new game"
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
        keyboard = GAME.Input.Keyboard,
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
        cancelled;

    function initialize() {
        var canvasWidth = GAME.graphics.canvas.width,
            canvasHeight = GAME.graphics.canvas.height,
            yOffset = canvasHeight / 6;

        background.x = canvasWidth / 2;
        background.y = canvasHeight / 2;
        background.width = canvasWidth;
        background.height = canvasHeight;

        gameBoard.x = canvasWidth / 2;
        gameBoard.y = canvasHeight / 2;
        gameBoard.width = canvasHeight / 1.4;
        gameBoard.height = canvasHeight / 1.4;

        timeText.y = canvasWidth / 2 + canvasHeight / 8;
        timeText.x = yOffset / 2 + canvasWidth / 3;

        movesText.y = timeText.y + canvasHeight / 8;
        movesText.x = timeText.x;

        gameOverScreen.x = canvasWidth / 2;
        gameOverScreen.y = canvasHeight / 2;
        gameOverScreen.width = canvasWidth / 2;
        gameOverScreen.height = canvasHeight / 4;
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

        if((x <= gameBoard.x + gameBoard.width / 2) &&
            (x >= gameBoard.x - gameBoard.width / 2) &&
            (y <= gameBoard.y + gameBoard.height / 2) &&
            (y >= gameBoard.y - gameBoard.height / 2)){
                for(i = 0; i < gridSize; i++){
                    startX = initialX;
                    for(j = 0; j < gridSize; j++){
                        if((x <= startX + (step * 0.9 / 2)) &&
                            (x >= startX - (step * 0.9 / 2)) &&
                            (y <= startY + (step * 0.9 / 2)) &&
                            (y >= startY - (step * 0.9 / 2))){
                                if(canMoveTile(i * gridSize + j)){
                                    blankIndex = findBlankTile();
                                    blankRow = Math.floor(blankIndex / gridSize);
                                    blankCol = blankIndex - (blankRow * gridSize);

                                    oldX = startX;
                                    oldY = startY;

                                    newX = initialX + (step * blankCol);
                                    newY = initialY + (step * blankRow);

                                    currentImage = grid[i][j].image;

                                    moveTile(i * gridSize + j);
                                }
                        }
                        startX += step;
                    }
                    startY += step;
                }
        }
    }

    function findBlankTile(){
        var i, j;

        for(i = 0; i < gridSize; i++){
            for(j = 0; j < gridSize; j++){
                if(grid[i][j].index === blankTileId){
                    return i * gridSize + j;
                }
            }
        }
    }

    function canMoveTile(index){
        var selectedTileRow,
            selectedTileCol,
            blankTileIndex,
            blankTileRow,
            blankTileCol;

        selectedTileRow = Math.floor(index / gridSize);
        selectedTileCol = index - (selectedTileRow * gridSize);

        blankTileIndex = findBlankTile();
        blankTileRow = Math.floor(blankTileIndex / gridSize);
        blankTileCol = blankTileIndex - (blankTileRow * gridSize);

        if(selectedTileRow === blankTileRow){
            if(selectedTileCol === blankTileCol - 1){
                return true;
            } else if(selectedTileCol === blankTileCol + 1){
                return true;
            }
        } else if(selectedTileCol === blankTileCol){
            if(selectedTileRow === blankTileRow - 1){
                return true;
            } else if(selectedTileRow === blankTileRow + 1){
                return true;
            }
        }

        return false;
    }

    function createImageObject(index){
        return {
            index:index,
            image:GAME.images["images/Tile128-" + index + ".png"]
        }
    }

    function resetGrid(){
        var i, j, arr;
        grid = [];

        for(i = 0; i < gridSize; i++){
            arr = [];

            for(j = 0; j < gridSize; j++){
                arr.push(createImageObject(gridSize * i + j));
            }

            grid.push(arr);
        }
    }

    function drawGrid(){
        var i, j, startX, startY = gameBoard.y - (gameBoard.height / 2) + (gameBoard.height / (gridSize * 2)), 
            step = gameBoard.width / gridSize, 
            initialX = gameBoard.x - (gameBoard.width / 2) + (gameBoard.width / (gridSize * 2));

        for(i = 0; i < gridSize; i++){
            startX = initialX;
            for(j = 0; j < gridSize; j++){
                GAME.graphics.drawImage({
                    image:grid[i][j].image,
                    x:startX,
                    y:startY,
                    width:step * 0.9,
                    height:step * 0.9
                });
                startX += step;
            }

            startY += step;
        }

        if(animatingTile === true){
            GAME.graphics.drawRect({
                x:newX,
                y:newY,
                fillStyle:"#FFFFFF",
                width:0.9*step,
                height:0.9*step
            });
        }
    }

    function shuffleTiles(){
        var count = gridSize * gridSize,
            newPositions = [],
            index,
            row,
            col,
            newRow,
            newCol,
            temp,
            i;
        
        // Shuffle code partially adapted from here:
        // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
        while(count > 0){
            index = Random.getRandomInteger(count) - 1;

            count -= 1;

            newPositions.push(index);
        }

        for(i = 0; i < newPositions.length; i++){
            index = newPositions[i];

            row = Math.floor(index / gridSize);
            col = index - (row * gridSize);

            newRow = Math.floor(i / gridSize);
            newCol = i - (newRow * gridSize);

            temp = grid[row][col];
            grid[row][col] = grid[newRow][newCol];
            grid[newRow][newCol] = temp;
        }
    }

    function checkTiles(){
        var i, j, index;

        for(i = 0; i < gridSize; i++){
            for(j = 0; j < gridSize; j++){
                index = i * gridSize + j;
                if(grid[i][j].index != index){
                    return false;
                }
            }
        }

        return true;
    }

    function moveTile(index){
        var tileRow = Math.floor(index / gridSize),
            tileCol = index - (tileRow * gridSize),
            blankTileIndex = findBlankTile(),
            blankTileRow = Math.floor(blankTileIndex / gridSize),
            blankTileCol = blankTileIndex - (blankTileRow * gridSize),
            temp;

        correctIndex = false;

        cancelled = true;
        animatingTile = true;

        temp = grid[tileRow][tileCol];
        grid[tileRow][tileCol] = grid[blankTileRow][blankTileCol];
        grid[blankTileRow][blankTileCol] = temp;

        if(grid[blankTileRow][blankTileCol].index === blankTileIndex){
            correctIndex = true;
        }

        moves += 1;
        movesText.text = "Moves: " + moves;

        GAME.graphics.canvas.removeEventListener('mousedown', onClick, false);
        keyboard.clearCommands();
    }

    function startTileAnimation(){
        var xDistance = newX - oldX,
            yDistance = newY - oldY;

        midX = oldX;
        midY = oldY;

        if(xDistance === 0){
            delta = yDistance;
            deltaX = false;
        } else {
            delta = xDistance;
            deltaX = true;
        }

        if(delta < 0){
            deltaPositive = false;
        } else {
            deltaPositive = true;
        }

        lastTime = performance.now();
        id = window.requestAnimationFrame(tileAnimationLoop);
    }

    function updateTileAnimation(elapsedTime){
        GAME.particles.update(elapsedTime);

        count += elapsedTime;

        timeText.text = "Time: " + Math.floor(count);
        
        elapsedTime *= 200;
        
        if(deltaPositive === true){
            if(deltaX === true){
                midX += elapsedTime;
                if(midX >= newX){
                    return false;
                }
            } else {
                midY += elapsedTime;
                if(midY >= newY){
                    return false;
                }
            }
        } else {
            if(deltaX === true){
                midX -= elapsedTime;
                if(midX <= newX){
                    return false;
                }
            } else {
                midY -= elapsedTime;
                if(midY <= newY){
                    return false;
                }
            }
        }

        return true;
    }

    function renderTileAnimation(){
        var step = (0.9) * (gameBoard.width / gridSize);

        render();

        GAME.graphics.drawRect({
            x:oldX,
            y:oldY,
            fillStyle:"#FFFFFF",
            width:step,
            height:step
        });

        GAME.graphics.drawRect({
            x:newX,
            y:newY,
            fillStyle:"#FFFFFF",
            width:step,
            height:step
        });

        GAME.graphics.drawRect({
            fillStyle:"#FFFFFF",
            x:midX,
            y:midY,
            width:step,
            height:step 
        });

        GAME.graphics.drawImage({
           image:currentImage,
           x:midX,
           y:midY,
           width:step,
           height:step 
        });
    }

    function tileAnimationLoop(timestamp){
        var elapsedTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        animatingTile = updateTileAnimation(elapsedTime);
        renderTileAnimation(elapsedTime);

        if (animatingTile === true) {
            id = window.requestAnimationFrame(tileAnimationLoop);
        } else {
            GAME.graphics.canvas.addEventListener('mousedown', onClick, false);
            keyboard.registerCommand(KeyEvent.DOM_VK_BACK_SPACE, onPause);
            
            if(checkTiles()){
                onGameOver();
            } else {

                if(correctIndex === true){
                    addParticles(newX, newY);
                }

                cancelled = false;
                lastTime = performance.now();
                id = window.requestAnimationFrame(gameLoop);
            }
        }
    }

    function run() {
        keyboard.clearCommands();
        keyboard.registerCommand(KeyEvent.DOM_VK_BACK_SPACE, onPause);

        GAME.graphics.canvas.addEventListener('mousedown', onClick, false);

        resetKeys = false;
        cancelled = false;
        keyboard.keys = {};

        score = 0;
        moves = 0;
        paused = false;
        gameOver = false;
        animatingTile = false;
        count = 0;

        movesText.text = "Moves: 0";
        
        GAME.particles.reset();
        
        resetGrid();

        shuffleTiles();
        shuffleTiles(); // extra shuffled!

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

    function onPause(){
        cancelled = true;
        paused = true;

        keyboard.clearCommands(),
        keyboard.registerCommand(KeyEvent.DOM_VK_Y, goBack);
        keyboard.registerCommand(KeyEvent.DOM_VK_N, restart);

        GAME.graphics.canvas.removeEventListener('mousedown', onClick, false);
    }

    function showPaused(){
        GAME.graphics.drawRect(pauseScreen);
        GAME.graphics.drawText(pauseScreen);
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

    function showGameOver(){
        GAME.graphics.drawRect(gameOverScreen);
        GAME.graphics.drawText(gameOverScreen);
    }

    function goBack() {
        GAME.graphics.canvas.removeEventListener('click', onClick, false);
        cancelled = true;
        if (id) {
            window.cancelAnimationFrame(id);
        }

        keyboard.clearCommands();
        GAME.Controller.showScreen('menu');
    }

    function addParticles(x, y){
        var i;

        for(i = 0; i < 15; i++){
            GAME.particles.createParticle({
                image:GAME.images['images/smoke.png'],
                size:25,
                x:x,
                y:y,
                dx:{
                    min:-5,
                    max:5
                },
                dy:{
                    min:-5,
                    max:5
                },
                duration:1.5
            });
        }

        for(i = 0; i < 15; i++){
            GAME.particles.createParticle({
                image:GAME.images['images/fire.png'],
                size:20,
                x:x,
                y:y,
                dx:{
                    min:-3,
                    max:3
                },
                dy:{
                    min:-3,
                    max:3
                },
                duration:1
            });
        }
    }

    function addScores(){
        Storage.add("TIME" + performance.now(), Math.floor(count));
        Storage.add("MOVES" + performance.now(), moves);
    }

    function collectInput(elapsedTime) {
        keyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        count += elapsedTime;

        timeText.text = "Time: " + Math.floor(count);
        
        GAME.particles.update(elapsedTime);
    }

    function render(elapsedTime) {
        GAME.graphics.drawRect(background);

        GAME.graphics.drawText(timeText);
        GAME.graphics.drawText(movesText);

        GAME.graphics.drawRect(gameBoard);

        //drawGrid();
        
        GAME.particles.render();
    }

    function gameLoop(timestamp) {
        var elapsedTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        collectInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);
        if (cancelled === false) {
            id = window.requestAnimationFrame(gameLoop);
        } else if (paused === true) {
            showPaused();
        } else if (gameOver === true){
            showGameOver();
        } else if (animatingTile === true){
            startTileAnimation();
        }
    }

    function sliceImage(img){
        console.log('SLICING');
        console.log(img);
    }

    return {
        initialize: initialize,
        run: run,
        sliceImage: sliceImage
    };
}());
