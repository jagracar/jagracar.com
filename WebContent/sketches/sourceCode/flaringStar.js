var flaringStarSketch = function(p) {
	// Global variables
	var star = undefined;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight;
		var position, radius, fadingFactor, flaresActivity, imageWidth;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 300;
		canvasHeight = 300;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		p.createCanvas(canvasWidth, canvasHeight);

		// Create the star
		position = p.createVector(p.width / 2, p.height / 2);
		radius = 40;
		fadingFactor = 0.2;
		flaresActivity = 0.8;
		imageWidth = Math.max(p.width, p.height);
		star = new Star(position, radius, fadingFactor, flaresActivity, imageWidth);
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(0);

		// Update the star flaring effect depending on the mouse position
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			star.setFadingFactor(0.7 * (1 - p.mouseX / p.width));
			star.setFlaresActivity(0.1 + 0.9 * p.mouseY / p.height);
		}

		// Update the star
		star.update();

		// Paint the star
		star.paint();
	};

	/*
	 * The Star class
	 */
	function Star(position, radius, fadingFactor, flaresActivity, imageWidth) {
		this.position = position;
		this.radius = radius;
		this.fadingFactor = fadingFactor;
		this.flaresActivity = flaresActivity;
		this.imageWidth = imageWidth;
		this.body = p.createImage(this.imageWidth, this.imageWidth);
		this.flares = p.createImage(this.imageWidth, this.imageWidth);
		this.timeCounter = 0;

		// Initialize the star's body image
		var radiusSq, center, x, y, pixel, distanceSq;
		radiusSq = p.sq(this.radius);
		center = this.imageWidth / 2;

		this.body.loadPixels();

		for (x = 0; x < this.imageWidth; x++) {
			for (y = 0; y < this.imageWidth; y++) {
				pixel = 4 * (x + y * this.imageWidth);
				distanceSq = p.sq(x - center) + p.sq(y - center);
				this.body.pixels[pixel] = 255;
				this.body.pixels[pixel + 1] = 255;
				this.body.pixels[pixel + 2] = 255;
				this.body.pixels[pixel + 3] = 255 * (0.95 - distanceSq / radiusSq);
			}
		}

		this.body.updatePixels();
	}

	//
	// The update method
	//
	Star.prototype.update = function() {
		var radiusSq, center, nPixels, x, y, deltaX, deltaY, pixel, distanceSq;
		var relativeAngle, dx, dy, sumColor, counter, pixelColor, i;
		radiusSq = p.sq(this.radius);
		center = this.imageWidth / 2;
		nPixels = p.sq(this.imageWidth);

		// Create the flares in the star's body (save the result in the red
		// channel)
		this.flares.loadPixels();

		for (x = 0; x < this.imageWidth; x++) {
			for (y = 0; y < this.imageWidth; y++) {
				deltaX = x - center;
				deltaY = y - center;
				distanceSq = p.sq(deltaX) + p.sq(deltaY);

				if (distanceSq < radiusSq) {
					relativeAngle = p.atan2(deltaY, deltaX) / p.TWO_PI;

					if (relativeAngle < 0) {
						relativeAngle++;
					}

					pixel = 4 * (x + y * this.imageWidth);
					this.flares.pixels[pixel] = 255 * p.noise(0.1 * (Math.sqrt(distanceSq) - this.timeCounter),
							10 * relativeAngle);
				}
			}
		}

		// Smooth the flares (save the result in the blue and alpha channels)
		for (x = 2; x < this.imageWidth - 2; x++) {
			for (y = 2; y < this.imageWidth - 2; y++) {
				pixel = 4 * (x + y * this.imageWidth);
				deltaX = x - center;
				deltaY = y - center;
				distanceSq = p.sq(deltaX) + p.sq(deltaY);
				sumColor = 0;
				counter = 0;

				// Loop over nearby pixels
				for (dx = -2; dx <= 2; dx++) {
					for (dy = -2; dy <= 2; dy++) {
						if (p.sq(deltaX + dx) + p.sq(deltaY + dy) < distanceSq) {
							sumColor += this.flares.pixels[pixel + 4 * (dx + dy * this.imageWidth)];
							counter++;
						}
					}
				}

				if (counter > 0) {
					this.flares.pixels[pixel + 2] = sumColor / counter;
					this.flares.pixels[pixel + 3] = 255 * (1 - this.fadingFactor) * radiusSq / distanceSq;
				} else {
					this.flares.pixels[pixel + 2] = 0;
					this.flares.pixels[pixel + 3] = 0;
				}
			}
		}

		// Update the flares image (i.e. the red and green channels)
		for (i = 0; i < nPixels; i++) {
			pixel = 4 * i;
			pixelColor = this.flares.pixels[pixel + 2];
			this.flares.pixels[pixel] = pixelColor;
			this.flares.pixels[pixel + 1] = pixelColor;
		}

		this.flares.updatePixels();

		// Increase the time counter
		this.timeCounter += this.flaresActivity;
	};

	//
	// The paint method
	//
	Star.prototype.paint = function() {
		p.push();
		p.translate(this.position.x - this.imageWidth / 2, this.position.y - this.imageWidth / 2);
		p.image(this.flares, 0, 0);
		p.image(this.body, 0, 0);
		p.pop();
	};

	//
	// Update the fading factor parameter
	//
	Star.prototype.setFadingFactor = function(fadingFactor) {
		this.fadingFactor = fadingFactor;
	};

	//
	// Update the flares activity parameter
	//
	Star.prototype.setFlaresActivity = function(flaresActivity) {
		this.flaresActivity = flaresActivity;
	};
};
