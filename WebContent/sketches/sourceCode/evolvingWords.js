var evolvingWordsSketch = function(p) {
	// Global variables
	var positions = undefined;
	var step = 0;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 600;
		canvasHeight = 400;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		p.createCanvas(canvasWidth, canvasHeight);

		// Calculate the trajectory positions for every particle
		positions = calculateTrajectories("This is not a LOVE story", 2 * canvasWidth);
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(0, 100);

		// Paint the trajectories step by step
		if (step < positions[0].length) {
			p.noStroke();
			p.fill(0, 150, 200, 100);

			// Draw all the particles
			for (var i = 0; i < positions.length; i++) {
				p.ellipse(positions[i][step].x, positions[i][step].y, 5, 5);
			}
		} else if (step > positions[0].length + 20) {
			// Stop the sketch
			p.noLoop();
		}

		step++;
	};

	//
	// Calculates the particles trajectories
	//
	calculateTrajectories = function(text, nParticles) {
		var words, limits, trajectories, nSteps, i;

		// Split the text into words
		words = p.splitTokens(text, " ");

		// Calculate the words limits
		limits = [];

		for (i = 0; i < words.length; i++) {
			limits[i] = wordLimits(words[i]);
		}

		// Calculate the particle trajectories
		trajectories = [];
		nSteps = 80;

		for (i = 0; i < nParticles; i++) {
			trajectories[i] = trajectory(limits, nSteps);
		}

		return trajectories;
	};

	//
	// Calculates the word limits
	//
	wordLimits = function(word) {
		var textSize, limits, x, y, dx, dy, px, py, pixelDensity, pixelDensitySq, isLimit;

		// Paint the background
		p.background(0);

		// Paint the text
		textSize = 0.25 * p.width;
		p.push();
		p.textFont("Helvetica");
		p.textAlign(p.CENTER);
		p.textSize(textSize);
		p.textStyle(p.BOLD);
		p.noStroke();
		p.fill(255);
		p.text(word, 0.5 * p.width, 0.5 * p.height + 0.25 * textSize);
		p.pop();

		// Calculate the limits
		limits = [];
		pixelDensity = p.displayDensity();
		pixelDensitySq = pixelDensity * pixelDensity;

		p.loadPixels();

		for (y = 0; y < p.height; y++) {
			for (x = 0; x < p.width; x++) {
				isLimit = false;

				if (p.pixels[4 * (x * pixelDensity + y * p.width * pixelDensitySq)] === 255) {
					// Check the nearby pixels for a color change
					for (dx = -1; dx <= 1; dx++) {
						for (dy = -1; dy <= 1; dy++) {
							// Don't calculate more if we already know that it's
							// a limit
							if (!isLimit) {
								px = x + dx;
								py = y + dy;

								if (px >= 0 && px < p.width && py >= 0 && py < p.height) {
									if (p.pixels[4 * (px * pixelDensity + py * p.width * pixelDensitySq)] !== 255) {
										isLimit = true;
									}
								}
							}
						}
					}
				}

				if (isLimit) {
					limits.push(new toxi.geom.Vec2D(x, y));
				}
			}
		}

		p.updatePixels();

		// Clean the canvas
		p.background(0);

		return limits;
	};

	//
	// Calculates the particle trajectory
	//
	trajectory = function(limits, steps) {
		var positionInWords, i, spline, center;

		// Calculate the particle position in the different words
		positionInWords = [];

		for (i = 0; i < limits.length; i++) {
			positionInWords[i] = limits[i][Math.floor(limits[i].length * Math.random())];
		}

		// Add the spline points
		spline = new toxi.geom.Spline2D();
		spline.setTightness(0.2);
		minDim = Math.min(p.width, p.height);
		maxDim = Math.max(p.width, p.height);
		center = new toxi.geom.Vec2D(0.5 * p.width, 0.5 * p.height);

		for (i = 0; i < positionInWords.length - 1; i++) {
			spline.add(positionInWords[i]);
			spline.add(randomVector(0, 15).add(center));
			spline.add(randomVector(0, 0.2 * minDim).add(positionInWords[i + 1]));
			spline.add(randomVector(0, 0.02 * minDim).add(positionInWords[i + 1]));
		}

		spline.add(positionInWords[positionInWords.length - 1]);
		spline.add(randomVector(0, 15).add(center));
		spline.add(center);
		spline.add(randomVector(maxDim, 3 * maxDim).add(center));

		return spline.computeVertices(steps);
	};

	//
	// Returns a random vector within the given radius limits
	//
	randomVector = function(minRadius, maxRadius) {
		var angle = p.TWO_PI * Math.random();
		var radius = minRadius + (maxRadius - minRadius) * p.randomGaussian();
		return new toxi.geom.Vec2D(radius * Math.cos(angle), radius * Math.sin(angle));
	};
};
