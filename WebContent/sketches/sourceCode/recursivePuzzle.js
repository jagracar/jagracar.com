var recursivePuzzleSketch = function(p) {
	// Global variables
	var pieceSize = 64;
	var minPieceSize = pieceSize;
	var img, puzzle;

	// Creates and adds the canvas element
	function addCanvas(canvasWidth, canvasHeight) {
		var referenceElement, maxCanvasWidth, canvas;

		// Calculate the canvas dimensions
		referenceElement = document.getElementById("widthRef");
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = maxCanvasWidth * canvasHeight / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Resize the canvas if necessary
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			p.resizeCanvas(maxCanvasWidth, maxCanvasWidth * canvasHeight / canvasWidth, true);
		}

		return canvas;
	}

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Sukanto Debnath
		// https://www.flickr.com/photos/sukanto_debnath/2181170020
		img = p.loadImage("img/smallGirl.jpg");
	};

	// Initial setup
	p.setup = function() {
		// Add the canvas element
		var canvas = addCanvas(img.width, img.height);

		// Resize the image to fit the pieces size
		img.resize(pieceSize * Math.floor(p.width / pieceSize), pieceSize * Math.floor(p.height / pieceSize));

		// Resize the canvas again
		p.resizeCanvas(img.width, img.height, true);

		// Initiate a new puzzle each time the mouse is pressed inside the canvas
		canvas.mousePressed(newPuzzle);

		// Set the frame rate
		p.frameRate(20);

		// Initiate a new puzzle
		newPuzzle();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(255);

		// Paint the puzzle
		puzzle.paint();

		// Move the puzzle piece
		puzzle.movePiece();
	};

	//
	// This function starts a new puzzle
	//
	function newPuzzle() {
		// Decrease or increment the minimum piece size
		minPieceSize /= 4;

		if (minPieceSize < 4) {
			minPieceSize = 64;
		}

		// Initiate the puzzle and start the step counter
		puzzle = new Puzzle(p.createVector(0, 0), pieceSize, minPieceSize, img);
	}

	//
	// The Hole class
	//
	function Hole(pos, size) {
		this.pos = pos.copy();
		this.size = size;
		this.movementDir = p.createVector();
	}

	//
	// Calculate the next hole position
	//
	Hole.prototype.nextMove = function(minPos, maxPos) {
		switch (Math.floor(4 * Math.random())) {
		case 0:
			if (this.pos.x + this.size >= maxPos.x || this.movementDir.x === -1) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(1, 0);
			}

			break;
		case 1:
			if (this.pos.y + this.size >= maxPos.y || this.movementDir.y === -1) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(0, 1);
			}

			break;
		case 2:
			if (this.pos.x - this.size < minPos.x || this.movementDir.x === 1) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(-1, 0);
			}

			break;
		case 3:
			if (this.pos.y - this.size < minPos.y || this.movementDir.y === 1) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(0, -1);
			}

			break;
		}
	};

	//
	// Move the hole to the next position
	//
	Hole.prototype.move = function() {
		this.pos.add(this.size * this.movementDir.x, this.size * this.movementDir.y);
	};

	//
	// Move the hole by a given amount
	//
	Hole.prototype.shiftPos = function(shift) {
		this.pos.add(shift);
	};

	//
	// The Piece class. It can contain a puzzle inside
	//
	function Piece(pos, size, img) {
		this.pos = pos.copy();
		this.size = size;
		this.img = img;
		this.puzzle = undefined;
	}

	//
	// Move the piece by a given amount
	//
	Piece.prototype.shiftPos = function(shift) {
		this.pos.add(shift);

		// Move the inner puzzle too if it exists
		if (this.puzzle) {
			this.puzzle.shiftPos(shift);
		}
	};

	//
	// Create a new puzzle inside the piece if it's not too small
	//
	Piece.prototype.createPuzzle = function(piecesPerSide, minPieceSize) {
		// Limit the smaller piece size
		var newPieceSize = Math.floor(this.size / piecesPerSide);

		if (newPieceSize >= minPieceSize) {
			this.puzzle = new Puzzle(this.pos, newPieceSize, minPieceSize, this.img);
		}
	};

	//
	// Paint the piece or the inner puzzle on the screen
	//
	Piece.prototype.paint = function() {
		if (this.puzzle) {
			this.puzzle.paint();
		} else {
			p.image(this.img, this.pos.x, this.pos.y);
		}
	};

	//
	// The Puzzle class
	//
	function Puzzle(pos, pieceSize, minPieceSize, img) {
		this.pos = pos.copy();
		this.pieceSize = pieceSize;
		this.minPieceSize = minPieceSize;
		this.width = img.width;
		this.height = img.height;
		this.pieces = [];
		this.movingPiece = undefined;
		this.hole = undefined;
		this.nSteps = 16;
		this.step = 0;

		// Create the hole at a random position and create the other pieces
		var xHole, yHole, x, y, elementPos, pieceImg;
		xHole = Math.floor(Math.random() * this.width / this.pieceSize) * this.pieceSize;
		yHole = Math.floor(Math.random() * this.height / this.pieceSize) * this.pieceSize;

		for (x = 0; x < this.width; x += this.pieceSize) {
			for (y = 0; y < this.height; y += this.pieceSize) {
				elementPos = p.createVector(this.pos.x + x, this.pos.y + y);

				if (x === xHole && y === yHole) {
					this.hole = new Hole(elementPos, this.pieceSize);
				} else {
					pieceImg = img.get(x, y, this.pieceSize, this.pieceSize);
					this.pieces.push(new Piece(elementPos, this.pieceSize, pieceImg));
				}
			}
		}

		// Calculate the puzzle next move
		this.nextMove();
	}

	//
	// Calculate the next puzzle move
	//
	Puzzle.prototype.nextMove = function() {
		// Move the hole
		this.hole.nextMove(this.pos, p.createVector(this.pos.x + this.width, this.pos.y + this.height));
		this.hole.move();

		// Get the piece that is over the hole
		this.movingPiece = undefined;

		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].pos.dist(this.hole.pos) === 0) {
				this.movingPiece = this.pieces[i];
				break;
			}
		}

		// Create a puzzle in that piece if it doesn't exist already
		if (!this.movingPiece.puzzle) {
			this.movingPiece.createPuzzle(4, this.minPieceSize);
		}
	};

	//
	// SMoves the puzzle position by a given amount
	//
	Puzzle.prototype.shiftPos = function(shift) {
		// Shift the puzzle global position
		this.pos.add(shift);

		// Shift the hole and pieces positions
		this.hole.shiftPos(shift);

		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].shiftPos(shift);
		}
	};

	//
	// Move the puzzle piece
	//
	Puzzle.prototype.movePiece = function() {
		// Shift the position of the moving piece
		this.movingPiece.shiftPos(this.hole.movementDir.copy().mult(-this.pieceSize / this.nSteps));
		this.step++;

		// Move the other moving pieces in those pieces containing a puzzle
		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].puzzle) {
				this.pieces[i].puzzle.movePiece();
			}
		}

		// Start a new puzzle move every nSteps
		if (this.step % this.nSteps === 0) {
			this.nextMove();
		}
	};

	//
	// Paint the puzzle
	//
	Puzzle.prototype.paint = function() {
		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].paint();
		}
	};
};
