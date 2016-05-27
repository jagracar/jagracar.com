var wordLimitsSketch = function(p) {
	// Global variables
	var nParticles = 300;
	var particles = [];
	var bgColor = 255;
	var obstacleColor = 130;
	var inclination = p.random(-0.05, 0.05);
	var limits = undefined;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight, canvas;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 400;
		canvasHeight = 600;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Reset the sketch each time the mouse is pressed inside the canvas
		canvas.mousePressed(resetSketch);

		// General sketch properties
		p.noStroke();

		// Calculate the obstacle limits
		limits = obtainLimits(bgColor, obstacleColor, inclination);
	};

	// Execute the sketch
	p.draw = function() {
		// Paint the obstacles
		paintObstacles(bgColor, obstacleColor, inclination);

		// Add new particles if necessary
		if (particles.length < nParticles) {
			var pos = p.createVector(p.random(0.4, 0.6) * p.width, 0.1 * p.height);
			var velMag = p.random(1, 3);
			var ang = p.random(-Math.PI, 0);
			var vel = p.createVector(velMag * p.cos(ang), velMag * p.sin(ang));
			var diameter = 5;
			var color = p.color(255, 0, 0);
			particles.push(new Particle(pos, vel, diameter, color));
		}

		// Paint the particles and update their position and velocity
		for (var i = 0; i < particles.length; i++) {
			particles[i].paint();
			particles[i].update(limits);
		}
	};

	//
	// This function resets the sketch
	//
	function resetSketch() {
		// Change the noise seed and the inclination angle
		p.noiseSeed(p.random(0, 1000));
		inclination = p.random(-0.05, 0.05);

		// Obtain the new limits
		limits = obtainLimits(bgColor, obstacleColor, inclination);

		// Start with new particles
		particles = [];
	}

	//
	// Calculates the limits of the painted obstacles
	//
	obtainLimits = function(bgColor, obstacleColor, inclination) {
		// Paint the obstacles
		paintObstacles(bgColor, obstacleColor, inclination);

		// Calculate the obstacle limits
		var x, y, dx, dy, px, py, pixel, isLimit;
		var limits = [];
		var pixelDensity = p.displayDensity();
		var pixelDensitySq = pixelDensity * pixelDensity;

		p.loadPixels();

		for (y = 0; y < p.height; y++) {
			for (x = 0; x < p.width; x++) {
				isLimit = false;

				if (p.pixels[4 * (x * pixelDensity + y * p.width * pixelDensitySq)] === obstacleColor) {
					// Check the nearby pixels for a color change
					for (dx = -1; dx <= 1; dx++) {
						for (dy = -1; dy <= 1; dy++) {
							// Don't calculate more if we already know that it's
							// a limit
							if (!isLimit) {
								px = x + dx;
								py = y + dy;

								if (px >= 0 && px < p.width && py >= 0 && py < p.height) {
									if (p.pixels[4 * (px * pixelDensity + py * p.width * pixelDensitySq)] !== obstacleColor) {
										isLimit = true;
									}
								}
							}
						}
					}
				}

				limits[x + y * p.width] = isLimit;
			}
		}

		p.updatePixels();

		return limits;
	};

	//
	// Paints the obstacles in the canvas
	//
	paintObstacles = function(bgColor, obstacleColor, inclination) {
		p.push();

		// Paint the background
		p.background(p.color(obstacleColor, obstacleColor, obstacleColor));

		// Rotate the scene a bit
		p.translate(p.width / 2, p.height / 2);
		p.rotate(inclination);
		p.translate(-p.width / 2, -p.height / 2);

		// Paint the inner rectangle
		p.fill(p.color(bgColor, bgColor, bgColor));
		p.rect(0.1 * p.width, 0.05 * p.height, 0.8 * p.width, 0.9 * p.height);

		// Paint the floor
		p.fill(p.color(obstacleColor, obstacleColor, obstacleColor));
		p.beginShape();
		p.vertex(0, p.height);

		for (var i = 0; i < p.width; i++) {
			p.vertex(i, p.height * (0.95 - 0.1 * p.noise(i * 0.013)));
		}

		p.vertex(p.width, p.height);
		p.endShape(p.CLOSE);

		// Paint the text
		var txt = "Only\nWords\nHave\nLimits";
		var textSize = 0.25 * p.width;
		p.textFont("Helvetica");
		p.textAlign(p.CENTER);
		p.textSize(textSize);
		p.textLeading(textSize);
		p.textStyle(p.BOLD);
		p.noStroke();
		p.fill(p.color(obstacleColor, obstacleColor, obstacleColor));
		p.text(txt, 0.5 * p.width, 0.55 * p.height);

		p.pop();
	};

	/*
	 * The Particle class
	 */
	function Particle(pos, vel, diameter, color) {
		this.pos = pos.copy();
		this.vel = vel.copy();
		this.diameter = diameter;
		this.color = color;
	}

	//
	// Paint the particle
	//
	Particle.prototype.paint = function() {
		p.fill(this.color);
		p.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
	};

	//
	// Update the particle position and velocity
	//
	Particle.prototype.update = function(limits) {
		// Calculate the box center and box size where we should search for collisions
		var boxCenterX = Math.round(this.pos.x + 0.5 * this.vel.x);
		var boxCenterY = Math.round(this.pos.y + 0.5 * this.vel.y);
		var boxHalfSizeX = Math.abs(Math.ceil(0.5 * this.vel.x)) + 1;
		var boxHalfSizeY = Math.abs(Math.ceil(0.5 * this.vel.y)) + 1;

		// Check for the closest collision
		var x, y, dx, dy, distX, distY, colX, colY, dotProduct, parallelDistSq, perpDistSq;
		var velMag = this.vel.mag();
		var minParallelDistSq = Number.MAX_VALUE;
		var minPerpDistSq = 0.5;
		var collides = false;

		for (dx = -boxHalfSizeX; dx <= boxHalfSizeX; dx++) {
			for (dy = -boxHalfSizeY; dy <= boxHalfSizeY; dy++) {
				x = boxCenterX + dx;
				y = boxCenterY + dy;

				// Check if there is a limit in that pixel
				if (x >= 0 && x < p.width && y >= 0 && y < p.height && limits[x + y * p.width]) {
					// Calculate the parallel and perpendicular distances to the
					// velocity direction
					distX = x - this.pos.x;
					distY = y - this.pos.y;
					dotProduct = this.vel.x * distX + this.vel.y * distY;
					parallelDistSq = p.sq(dotProduct / velMag);
					perpDistSq = p.sq(distX) + p.sq(distY) - parallelDistSq;

					if (dotProduct >= 0 && perpDistSq <= minPerpDistSq && parallelDistSq < minParallelDistSq) {
						colX = x;
						colY = y;
						collides = true;
						minParallelDistSq = parallelDistSq;
					}
				}
			}
		}

		if (collides) {
			// Calculate the two next closest limits
			var l1x, l1y, l2x, l2y, distSq;
			var l1DistSq = Number.MAX_VALUE;
			var l2DistSq = Number.MAX_VALUE;

			for (dx = -1; dx <= 1; dx++) {
				for (dy = -1; dy <= 1; dy++) {
					if (!(dx === 0 && dy === 0)) {
						x = colX + dx;
						y = colY + dy;

						// Check if there is a limit in that pixel
						if (x >= 0 && x < p.width && y >= 0 && y < p.height && limits[x + y * p.width]) {
							distSq = p.sq(x - this.pos.x) + p.sq(y - this.pos.y);

							if (l1DistSq >= l2DistSq) {
								if (distSq < l1DistSq) {
									l1x = x;
									l1y = y;
									l1DistSq = distSq;
								}
							} else if (distSq < l2DistSq) {
								l2x = x;
								l2y = y;
								l2DistSq = distSq;
							}
						}
					}
				}
			}

			// Change the velocity direction and magnitude due to the collision
			var lx = l1x - l2x;
			var ly = l1y - l2y;
			var lDistSq = p.sq(lx) + p.sq(ly);
			var dotProd = this.vel.x * lx + this.vel.y * ly;
			this.vel.x = 2 * dotProd * lx / lDistSq - this.vel.x;
			this.vel.y = 2 * dotProd * ly / lDistSq - this.vel.y;

			// Decelerate due to friction
			this.vel.mult(0.5);
		} else {
			// Accelerate due to gravity
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
			this.vel.y += 0.2;
		}
	};
};
