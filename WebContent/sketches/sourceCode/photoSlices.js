var photoSlicesSketch = function(p) {
	// Global variables
	var originalImg = undefined;
	var slices = undefined;
	var sliceSize = 8;

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Sukanto Debnath
		// https://www.flickr.com/photos/sukanto_debnath/2354607553
		originalImg = p.loadImage("img/boy.jpg");
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvas;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (originalImg.width > maxCanvasWidth / 1.5) {
			originalImg.resize(maxCanvasWidth / 1.5, originalImg.height * maxCanvasWidth / (1.5 * originalImg.width));
		}

		// Create the canvas
		canvas = p.createCanvas(1.5 * originalImg.width, originalImg.height);

		// Create new slices each time the mouse is pressed inside the canvas
		canvas.mousePressed(createNewSlices);

		// Create the slices
		slices = createSlices(originalImg);
	};

	// Execute the sketch
	p.draw = function() {
		var i, pushVel;

		// Clean the canvas
		p.background(0);

		// Update the slices positions and paint them on the screen
		for (i = 0; i < slices.length; i++) {
			slices[i].update();
			slices[i].paint();
		}

		// Check if the user pushed the slices
		if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY < p.height
				&& p.abs(p.mouseX - p.pmouseX) > 2) {
			pushVel = p.mouseX - p.pmouseX > 0 ? 5 : -5;

			for (i = 0; i < slices.length; i++) {
				slices[i].checkPush(p.mouseX, pushVel);
			}
		} else if (p.touchX >= 0 && p.touchX <= p.width && p.touchY >= 0 && p.touchY < p.height
				&& p.abs(p.touchX - p.ptouchX) > 2) {
			pushVel = p.touchX - p.ptouchX > 0 ? 5 : -5;

			for (i = 0; i < slices.length; i++) {
				slices[i].checkPush(p.touchX, pushVel);
			}
		}
	};

	/*
	 * This function creates a set of slices with a given slice size
	 */
	function createSlices(img) {
		var nSlices, s, i;
		nSlices = p.floor(img.width / sliceSize);
		s = [];

		for (i = 0; i < nSlices; i++) {
			s[i] = new Slice(i * sliceSize, sliceSize, img);
		}

		return s;
	}

	/*
	 * This function changes the slice size and creates a new set of slices
	 */
	function createNewSlices() {
		// Decrease the slice size by a factor of 2
		sliceSize /= 2;

		// If the size is too small, set it to a larger value
		if (sliceSize < 2) {
			sliceSize = 32;
		}

		// Create the new slices
		slices = createSlices(originalImg);
	}

	/*
	 * The Slice class
	 */
	function Slice(xImg, size, img) {
		// Create the slice image
		this.imgSlice = img.get(xImg, 0, size, img.height);

		// Calculate the slice position
		this.xWithoutNoise = (p.width - img.width) / 2 + xImg;
		this.x = this.xWithoutNoise;
		this.vel = 0;

		// Define the noise properties
		this.noiseDelta = p.random(0, 100);
		this.noiseSmallDelta = p.random(0, 100);
	}

	//
	// The update method
	//
	Slice.prototype.update = function() {
		// Move the global position
		this.xWithoutNoise += this.vel;

		// Add the noise
		this.x = this.xWithoutNoise + 400 * (p.noise(this.noiseDelta) - 0.5) + 200
				* (p.noise(this.noiseSmallDelta) - 0.5);
		this.noiseDelta += 0.002;
		this.noiseSmallDelta += 0.002;

		// Slow down the velocity
		this.vel *= 0.95;
	};

	//
	// The paint method
	//
	Slice.prototype.paint = function() {
		p.image(this.imgSlice, this.x, 0);
	};

	//
	// This method checks if the cursor is near the slice, and if it is, it gives it a push
	//
	Slice.prototype.checkPush = function(xPush, velPush) {
		if (xPush >= this.x && xPush <= (this.x + this.imgSlice.width)) {
			this.vel = velPush;
		}
	};
};
