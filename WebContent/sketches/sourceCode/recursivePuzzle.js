var recursivePuzzleSketch = function(p) {
	// Global variables
	var img = undefined;
	var puzzle = undefined;
	var step = undefined;
	var pieceSize = 64;
	var minPieceSize = pieceSize;
	var nSteps = 16;

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Sukanto Debnath
		// https://www.flickr.com/photos/sukanto_debnath/2181170020
		img = p.loadImage("img/smallGirl.jpg");
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvas;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (img.width > maxCanvasWidth) {
			img.resize(maxCanvasWidth, img.height * maxCanvasWidth / img.width);
		}

		// Resize the image again to fit the pieces size
		img.resize(pieceSize * Math.floor(img.width / pieceSize), pieceSize * Math.floor(img.height / pieceSize));

		// Create the canvas
		canvas = p.createCanvas(img.width, img.height);
		p.frameRate(20);

		// Initiate a new puzzle each time the mouse is pressed inside the canvas
		canvas.mousePressed(newPuzzle);

		// Initiate a new puzzle
		newPuzzle();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(255);

		// Paint the puzzle
		puzzle.paint();

		// Move the puzzle piece and all its sub-puzzles
		puzzle.movePiece(nSteps);
		step++;

		// Calculate the next movement
		if (step === nSteps) {
			puzzle.nextMove();
			step = 0;
		}
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
		puzzle = new Puzzle(p.createVector(0, 0), pieceSize, img);
		puzzle.nextMove();
		step = 0;
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
			if (this.pos.x + this.size >= maxPos.x || this.size === -this.movementDir.x) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(this.size, 0);
			}

			break;
		case 1:
			if (this.pos.y + this.size >= maxPos.y || this.size === -this.movementDir.y) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(0, this.size);
			}

			break;
		case 2:
			if (this.pos.x - this.size < minPos.x || this.size === this.movementDir.x) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(-this.size, 0);
			}

			break;
		case 3:
			if (this.pos.y - this.size < minPos.y || this.size === this.movementDir.y) {
				this.nextMove(minPos, maxPos);
			} else {
				this.movementDir.set(0, -this.size);
			}

			break;
		}
	};

	//
	// Move the hole to the next position
	//
	Hole.prototype.move = function() {
		this.pos.add(this.movementDir);
	};

	//
	// Move the hole by a given amount
	//
	Hole.prototype.shiftPos = function(delta) {
		this.pos.add(delta);
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
	Piece.prototype.shiftPos = function(delta) {
		this.pos.add(delta);

		if (this.puzzle) {
			// Move the puzzle too
			this.puzzle.shiftPos(delta);
		}
	};

	//
	// Create a new puzzle inside the piece
	//
	Piece.prototype.createPuzzle = function(piecesPerSide) {
		// Limit the smaller piece size
		var newPieceSize = Math.floor(this.size / piecesPerSide);

		if (newPieceSize >= minPieceSize) {
			this.puzzle = new Puzzle(this.pos, newPieceSize, this.img);
		}
	};

	//
	// Paint the piece or the puzzle that it might contain
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
	function Puzzle(pos, pieceSize, img) {
		this.pos = pos.copy();
		this.width = img.width;
		this.height = img.height;
		this.pieces = [];
		this.movingPiece = undefined;
		this.hole = undefined;

		// Create the hole at a random position and create the other pieces
		var xHole, yHole, x, y, elementPos, pieceImg;
		xHole = Math.floor(Math.random() * this.width / pieceSize);
		yHole = Math.floor(Math.random() * this.height / pieceSize);

		for (x = 0; x < this.width / pieceSize; x++) {
			for (y = 0; y < this.height / pieceSize; y++) {
				elementPos = p.createVector(this.pos.x + x * pieceSize, this.pos.y + y * pieceSize);

				if (x === xHole && y === yHole) {
					this.hole = new Hole(elementPos, pieceSize);
				} else {
					pieceImg = img.get(x * pieceSize, y * pieceSize, pieceSize, pieceSize);
					this.pieces.push(new Piece(elementPos, pieceSize, pieceImg));
				}
			}
		}
	}

	//
	// Calculate the next puzzle move
	//
	Puzzle.prototype.nextMove = function() {
		// Move the hole
		this.hole.nextMove(this.pos, p.createVector(this.pos.x + this.width, this.pos.y + this.height));
		this.hole.move();

		// Get the piece that is over the hole
		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].pos.dist(this.hole.pos) === 0) {
				this.movingPiece = this.pieces[i];
				break;
			}
		}

		// Create a puzzle in that piece if it doesn't exist already
		if (!this.movingPiece.puzzle) {
			this.movingPiece.createPuzzle(4);
		}

		// Calculate the next puzzle move in all the sub-puzzles
		for (i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].puzzle) {
				this.pieces[i].puzzle.nextMove();
			}
		}
	};

	//
	// Shift the position of the puzzle and all its pieces by a given amount
	//
	Puzzle.prototype.shiftPos = function(delta) {
		this.pos.add(delta);
		this.hole.shiftPos(delta);

		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].shiftPos(delta);
		}
	};

	//
	// Move the moving piece one step of a total of nSteps
	// Propagate the movement to the sub-puzzles
	//
	Puzzle.prototype.movePiece = function(nSteps) {
		var shift = p.createVector(-this.hole.movementDir.x / nSteps, -this.hole.movementDir.y / nSteps);
		this.movingPiece.shiftPos(shift);

		// Move the other moving pieces in those pieces containing a puzzle
		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].puzzle) {
				this.pieces[i].puzzle.movePiece(nSteps);
			}
		}
	};

	//
	// Paint the puzzle pieces
	//
	Puzzle.prototype.paint = function() {
		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].paint();
		}
	};
};
