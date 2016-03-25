var drawingBallsSketch = function(p) {
	// Global variables
	var img = undefined;
	var balls = [];

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Sukanto Debnath
		// https://www.flickr.com/photos/sukanto_debnath/3081836966/
		img = p.loadImage("img/oldMan.jpg");
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvas;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (img.width > maxCanvasWidth) {
			img.resize(maxCanvasWidth, img.height * maxCanvasWidth / img.width);
		}

		// Create the canvas
		canvas = p.createCanvas(img.width, img.height);

		// Apply a force each time the mouse is pressed inside the canvas
		canvas.mousePressed(applyForce);

		// Draw setup
		p.ellipseMode(p.RADIUS);
		p.noStroke();

		// Load the image pixels, so we can access them later
		img.loadPixels();
	};

	// Execute the sketch
	p.draw = function() {
		var r, alpha, pos, vel, i, j;

		// Clean the canvas
		p.background(0);

		// Add a new ball in each frame up to certain limit
		if (balls.length < 2.5 * Math.sqrt(p.width * p.height)) {
			r = 30 * Math.random();
			alpha = p.TWO_PI * Math.random();
			pos = p.createVector(0.55 * p.width + r * Math.cos(alpha), 0.4 * p.height + r * Math.sin(alpha));
			vel = p.createVector(0, 0);
			balls[balls.length] = new Ball(pos, vel);
		}

		// Update the balls positions
		for (i = 0; i < balls.length; i++) {
			balls[i].update();
		}

		// Check if the balls are in contact and move them in that case
		for (i = 0; i < balls.length; i++) {
			for (j = 0; j < balls.length; j++) {
				if (j != i) {
					balls[i].checkContact(balls[j]);
				}
			}
		}

		// Paint the balls in the canvas
		for (i = 0; i < balls.length; i++) {
			balls[i].paint();
		}
	};

	/*
	 * This function applies a force to those balls that are near the cursor
	 */
	function applyForce() {
		for (var i = 0; i < balls.length; i++) {
			balls[i].force(p.mouseX, p.mouseY);
		}
	}
	;

	/*
	 * The Ball class
	 */
	function Ball(initPos, initVel) {
		// Set the ball properties
		this.pos = initPos.copy();
		this.vel = initVel.copy();
		this.col = p.color(0);
		this.rad = 3;
	}

	//
	// The update method
	//
	Ball.prototype.update = function() {
		// Calculate the new ball position and velocity
		this.pos.add(this.vel);
		this.vel.mult(0.999);

		// Check that the ball is not leaving the canvas
		if (this.pos.x > p.width - this.rad) {
			this.pos.x = p.width - this.rad;
			this.vel.x = -this.vel.x;
		} else if (this.pos.x < this.rad) {
			this.pos.x = this.rad;
			this.vel.x = -this.vel.x;
		}

		if (this.pos.y > p.height - this.rad) {
			this.pos.y = p.height - this.rad;
			this.vel.y = -this.vel.y;
		} else if (this.pos.y < this.rad) {
			this.pos.y = this.rad;
			this.vel.y = -this.vel.y;
		}

		// Calculate the new ball color and radius
		var pixel = 4 * (p.round(this.pos.x) + p.round(this.pos.y) * p.width);
		this.col = p.color(img.pixels[pixel], img.pixels[pixel + 1], img.pixels[pixel + 2]);
		this.rad = p.map(p.brightness(this.col), 0, 255, 3, 7);
	};

	//
	// This method checks if the ball is in contact with another ball, and if that is the case, will change their
	// positions and velocities
	//
	Ball.prototype.checkContact = function(b) {
		var xDiff, yDiff, diffSq, weight, xCenter, yCenter, diff;

		// Obtain the positions difference vector
		xDiff = b.pos.x - this.pos.x;
		yDiff = b.pos.y - this.pos.y;
		diffSq = p.sq(xDiff) + p.sq(yDiff);
	
		// Check if the balls are in contact
		if (diffSq < p.sq(this.rad + b.rad)) {
			// Calculate the center of gravity weighted by the ball radius
			weight = this.rad / (this.rad + b.rad);
			xCenter = this.pos.x + xDiff * weight;
			yCenter = this.pos.y + yDiff * weight;

			// Normalize the positions difference vector
			diff = Math.sqrt(diffSq);
			xDiff /= diff;
			yDiff /= diff;

			// Update the balls positions
			this.pos.set(xCenter - this.rad * xDiff, yCenter - this.rad * yDiff);
			b.pos.set(xCenter + b.rad * xDiff, yCenter + b.rad * yDiff);

			// Set the velocities to zero
			this.vel.set(0, 0);
			b.vel.set(0, 0);
		}
	};

	//
	// The paint method
	//
	Ball.prototype.paint = function() {
		p.fill(this.col);
		p.ellipse(this.pos.x, this.pos.y, this.rad - 0.5, this.rad - 0.5);
	};

	//
	// This method applies a repulsive force at the given position
	//
	Ball.prototype.force = function(x, y) {
		var xDiff, yDiff, diffSq, diff, deltaVel;
		xDiff = x - this.pos.x;
		yDiff = y - this.pos.y;
		diffSq = p.sq(xDiff) + p.sq(yDiff);

		if (diffSq < 1000) {
			diff = p.sqrt(diffSq);
			deltaVel = 15 * p.min(p.abs(this.rad / diff), 1);
			this.vel.add(-deltaVel * xDiff / diff, -deltaVel * yDiff / diff);
		}
	};
};
