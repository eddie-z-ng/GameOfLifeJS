/*
	Conway's Game of Life
		ported from gameoflife.c
		
	09/03/13 
	Author: Eddie Ng 
	Contributor: Thomas Ballinger
	
	Features: 
	-Pause game via "Stop Game"
	-Start/resume game via "Start Game"
	-Clear game via "Clear Game"
	-User can add a live cell (or remove) when game is paused
	Intervals happen every 100 ms
	
	Possible todos: 
	-lots and lots of refactoring!
	-configurable board size, cell size, interval time, colors, etc... more configurable stuff
	 as most of this is hardcoded at the moment
*/

var GOLJS = { };

//500 x 500 pixel canvas
//50 x 50 board (10x10 block to represent a cell)
function initBoard () {
	var canvas = document.getElementById("golCanvas");
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	GOLJS.canvas = canvas;
	GOLJS.canvasContext = canvas.getContext("2d");
	
	function Cell(liveneighbors, alive) {
		this.liveneighbors = liveneighbors;
		this.alive = alive;
	}
	
	function createBoard () {
		var board = new Array(50);
		for (var columns = 0; columns < 50; columns++) {
			board[columns] = new Array(50);
			for (var rows = 0; rows < 50; rows++) {
				// generate a number between 0 and 10 inclusive
				var alive = ((Math.floor(Math.random()*11)%2)===0)? true : false;
				board[columns][rows] = new Cell(0, alive);
			}
		}
		return board;
	}	
	
	GOLJS.board = createBoard();
	GOLJS.gameover = true;
};

function clearDisplayBoard (canvas) {
	//Reset width to clear board
	canvas.width = canvas.width;
};

// x and y correspond to the 50x50 board
function drawCell (x, y, context, style) {
	context.fillStyle=style;
	context.fillRect(x*10, y*10, 10, 10);
};

function playGame() {
	var columns = 50;
	var rows = 50;
	var board = GOLJS.board;
	var context = GOLJS.canvasContext;
	
	/* Count liveneighbors */
    for (var x = 0; x < columns; x++) {
		for (var y = 0; y < rows; y++) {
            board[x][y].liveneighbors = 0;

            // Count up all the live cells in a 3x3 square (includes this cell itself)
            for (var xn = x-1; xn <= x+1; xn++) {
				for (var yn = y-1; yn <= y+1; yn++) {
					if (xn < 0 || yn < 0 || xn >= columns || yn >= rows)
						continue;

					if (board[xn][yn].alive === true)
						board[x][y].liveneighbors++;
                }
            }
            // We counted ourself as a live neighbor so decrement once
            if (board[x][y].alive === true)
                board[x][y].liveneighbors--;
        }
    }

    /* Spawn, keep, or kill the cells -- then display */
    for (var x = 0; x < columns; x++) {
		for (var y = 0; y < rows; y++) {
            // Rules:
            // 1. Spawn/Keep live cell if surrounded by 3
            // 2. Keep live cell with 2 neighbors 
            // 3. Kill cell otherwise 
            board[x][y].alive = ( (board[x][y].liveneighbors === 3) ||
                    ((board[x][y].liveneighbors === 2) && (board[x][y].alive === true)) );
					
			if (board[x][y].alive === true) {
				// Use a random color style for each block!
				//var rgb = Math.floor(Math.random()*256*256*256); // This would include white and other hard-to-discern colors
				var rgb = Math.floor(Math.random()*250*250*250);
				var style =	rgb.toString(16);
				drawCell(x, y, context, style);
			}
        }
    }
};
	
$(function () {
	initBoard();
	
	function gameTick() {
		if (GOLJS.gameover !== true){
			clearDisplayBoard(GOLJS.canvas);
			playGame();
		}
	};
	
	GOLJS.setInterval = function (time) {
		GOLJS.intID = setInterval(gameTick, time);
	};
	
	GOLJS.clearInterval = function () {
		if (GOLJS.intID !== undefined)
			clearInterval(GOLJS.intID);
	};

	$('#golCanvas').bind ("mousedown", function (e) {
		if (GOLJS.gameover === true) {
			var x = e.offsetX;
			var y = e.offsetY;

			var xC = Math.floor(x/10);
			var yC = Math.floor(y/10);

			GOLJS.board[xC][yC].alive = !GOLJS.board[xC][yC].alive; // toggle	
			if (GOLJS.board[xC][yC].alive === true)
				drawCell (xC, yC, GOLJS.canvasContext, "#d30"); //white cell = dead
			else
				drawCell (xC, yC, GOLJS.canvasContext, "#fff"); //white cell = dead
		}
	});
	
	$("#startButton").click(function () {
		if (GOLJS.gameover === true) {
			GOLJS.gameover = false;
			GOLJS.clearInterval();
			GOLJS.setInterval(100);
		}
	});
	
	$("#stopButton").click(function () {
		GOLJS.gameover = true;
		GOLJS.clearInterval();
	});
	
	$("#clearButton").click(function () {
		GOLJS.gameover = true;
		GOLJS.clearInterval();
		initBoard();
		clearDisplayBoard(GOLJS.canvas);
	});
});