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
		// Clean the canvas
		p.background(0);

		// Update the slides positions and check if the mouse pushed them
		for (var i = 0; i < slices.length; i++) {
			slices[i].checkPush();
			slices[i].update();
			slices[i].paint();
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
		this.noiseRange = 400;
		this.noiseSeed = p.random(0, 100);
		this.noiseDelta = 0;
		this.noiseStep = 0.002;
		this.noiseSmallRange = 200;
		this.noiseSmallSeed = p.random(0, 100);
		this.noiseSmallDelta = 0;
		this.noiseSmallStep = 0.002;
	}

	//
	// The update method
	//
	Slice.prototype.update = function() {
		this.xWithoutNoise += this.vel;
		this.x = this.xWithoutNoise + this.noiseRange * (p.noise(this.noiseSeed + this.noiseDelta) - 0.5)
				+ this.noiseSmallRange * (p.noise(this.noiseSmallSeed + this.noiseSmallDelta) - 0.5);
		this.noiseDelta += this.noiseStep;
		this.noiseSmallDelta += this.noiseSmallStep;
		this.vel *= 0.95;
	};

	//
	// The paint method
	//
	Slice.prototype.paint = function() {
		p.image(this.imgSlice, this.x, 0);
	};

	//
	// This method checks if the cursor is near the slice,
	// and if it is, it gives it a push
	//
	Slice.prototype.checkPush = function() {
		if (p.mouseY >= 0 && p.mouseY < p.height && p.mouseX >= this.x && p.mouseX <= (this.x + this.imgSlice.width)
				&& p.abs(p.mouseX - p.pmouseX) > 2) {
			this.vel = (p.mouseX - p.pmouseX > 0) ? 5 : -5;
		} else if (p.touchY >= 0 && p.touchY < p.height && p.touchX >= this.x
				&& p.touchX <= (this.x + this.imgSlice.width) && p.abs(p.touchX - p.ptouchX) > 2) {
			this.vel = (p.touchX - p.ptouchX > 0) ? 5 : -5;
		}
	};
};
