//
// This sketch takes a picture as input and simulates an oil paint. It has many optional parameters, 
// but only some combinations produce optimal results.
//
// Credits: Javier Gracia Carpio
// License: Creative Commons Attribution-ShareAlike (CC BY-SA)
// Inspiration: Some of the works by Sergio Albiac
//
var oilPaintingSketch = function(p) {
	// The picture file name in the img directory
	var pictureFile = "me.jpg";
	// The maximum RGB color difference to consider the pixel correctly painted
	var maxColorDiff = [ 40, 40, 40 ];
	// Compare the oil paint with the original picture
	var comparisonMode = false;
	// Show additional debug images
	var debugMode = false;
	// Paint the traces step by step, or in one go
	var paintStepByStep = false;
	// The smaller brush size allowed
	var smallerBrushSize = 4;
	// The brush size decrement ratio
	var brushSizeDecrement = 1.3;
	// The maximum number of invalid trajectories allowed before the brush size is reduced
	var maxInvalidTrajectories = 5000;
	// The maximum number of invalid trajectories allowed for the smaller brush size before the painting is stopped
	var maxInvalidTrajectoriesForSmallerSize = 10000;
	// The maximum number of invalid traces allowed before the brush size is reduced
	var maxInvalidTraces = 250;
	// The maximum number of invalid traces allowed for the smaller brush size before the painting is stopped
	var maxInvalidTracesForSmallerSize = 350;
	// The trace speed
	var traceSpeed = 2;
	// The typical trace length, relative to the brush size
	var relativeTraceLength = 2.3;
	// The minimum trace length allowed
	var minTraceLength = 16;

	// Global variables
	var originalImg;
	var imgWidth;
	var imgHeight;
	var backgroundColor;
	var similarColorPixels;
	var visitedPixels;
	var badPaintedPixels;
	var nBadPaintedPixels;
	var averageBrushSize;
	var trace;
	var traceStep;
	var nTraces;
	var startTime;

	//
	// Load the image before the sketch is run
	//
	p.preload = function() {
		originalImg = p.loadImage("img/" + pictureFile);
	};

	//
	// Initial setup
	//
	p.setup = function() {
		var maxCanvasWidth, nPixels, pixel;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (originalImg.width > maxCanvasWidth) {
			originalImg.resize(maxCanvasWidth, originalImg.height * maxCanvasWidth / originalImg.width);
		}

		imgWidth = originalImg.width;
		imgHeight = originalImg.height;

		// Load the original image pixels. This way they will be all the time available
		originalImg.loadPixels();

		// Create the sketch canvas
		if (comparisonMode) {
			p.createCanvas(2 * imgWidth, imgHeight);
		} else if (debugMode) {
			p.createCanvas(3 * imgWidth, imgHeight);
		} else {
			p.createCanvas(imgWidth, imgHeight);
		}

		// Sketch setup
		backgroundColor = p.color(255);
		p.strokeCap(p.SQUARE);
		p.background(backgroundColor);

		// Initialize the pixel arrays
		nPixels = imgWidth * imgHeight;
		similarColorPixels = [];
		visitedPixels = [];
		badPaintedPixels = [];
		nBadPaintedPixels = nPixels;

		for (pixel = 0; pixel < nPixels; pixel++) {
			similarColorPixels[pixel] = false;
			visitedPixels[pixel] = false;
			badPaintedPixels[pixel] = pixel;
		}

		// Initialize the rest of the sketch variables
		averageBrushSize = Math.max(smallerBrushSize, Math.max(imgWidth, imgHeight) / 6);
		trace = undefined;
		traceStep = 0;
		nTraces = 0;
		startTime = p.millis();
	};

	//
	// Draw method
	//
	p.draw = function() {
		// Get a new valid trace if we are not painting one already
		if (typeof trace === "undefined") {
			trace = getValidTrace();
			traceStep = 0;
		}

		// Check if we should stop painting because there are no more valid traces
		if (typeof trace === "undefined") {
			// Stop the sketch
			p.noLoop();
		} else {
			// Paint the trace step by step or in one go
			if (paintStepByStep) {
				trace.paintStep(traceStep, visitedPixels, imgWidth, imgHeight);
				traceStep++;

				// Check if we finished painting the trace
				if (traceStep === trace.getNSteps()) {
					trace = undefined;
				}
			} else {
				trace.paint(visitedPixels, imgWidth, imgHeight);
				trace = undefined;
			}

			// Draw the additional images if necessary
			if (comparisonMode) {
				p.image(originalImg, imgWidth, 0);
			} else if (debugMode) {
				drawDebugImages();
			}
		}
	};

	//
	// Obtains a valid trace, ready to be painted
	//
	function getValidTrace() {
		var trace, traceNotFound, invalidTrajectoriesCounter, invalidTracesCounter, startingPosition, nPixels, pixel;
		var validTrajectory, brushSize, nSteps;

		// Update the similar color and bad painted pixel arrays
		updatePixelArrays();

		// Obtain a new valid trace
		trace = undefined;
		traceNotFound = true;
		invalidTrajectoriesCounter = 0;
		invalidTracesCounter = 0;
		startingPosition = p.createVector(0, 0);

		while (traceNotFound) {
			// Check if we should stop painting
			if (averageBrushSize === smallerBrushSize && (invalidTrajectoriesCounter > maxInvalidTrajectoriesForSmallerSize || invalidTracesCounter > maxInvalidTracesForSmallerSize)) {
				console.log("Total number of painted traces: " + nTraces);
				console.log("Processing time = " + (p.millis() - startTime) / 1000 + " seconds");

				// Stop the while loop
				trace = undefined;
				traceNotFound = false;
			} else {
				// Change the average brush size if there were too many invalid traces
				if (averageBrushSize > smallerBrushSize && (invalidTrajectoriesCounter > maxInvalidTrajectories || invalidTracesCounter > maxInvalidTraces)) {
					averageBrushSize = Math.max(smallerBrushSize, Math.min(averageBrushSize / brushSizeDecrement,
							averageBrushSize - 2));

					console.log("Frame = " + p.frameCount + ", traces = " + nTraces + ", new average brush size = " + averageBrushSize);

					// Reset some of the variables
					invalidTrajectoriesCounter = 0;
					invalidTracesCounter = 0;

					// Reset the visited pixels array
					visitedPixels = [];
					nPixels = imgWidth * imgHeight;

					for (pixel = 0; pixel < nPixels; pixel++) {
						visitedPixels[pixel] = false;
					}
				}

				// Create new traces until one of them has a valid trajectory or we exceed a number of tries
				validTrajectory = false;
				brushSize = Math.max(smallerBrushSize, averageBrushSize * p.random(0.95, 1.05));
				nSteps = Math.round(Math.max(minTraceLength, relativeTraceLength * brushSize * p.random(0.9, 1.1)) / traceSpeed);

				while (!validTrajectory && invalidTrajectoriesCounter % 500 !== 499) {
					// Create the trace starting from a bad painted pixel
					pixel = badPaintedPixels[Math.floor(p.random(nBadPaintedPixels))];
					startingPosition.set(pixel % imgWidth, pixel / imgWidth);
					trace = new Trace(startingPosition, nSteps, traceSpeed);

					// Check if it has a valid trajectory
					validTrajectory = trace.hasValidTrajectory(similarColorPixels, visitedPixels, originalImg);

					// Increase the counter
					invalidTrajectoriesCounter++;
				}

				// Check if we have a valid trajectory
				if (validTrajectory) {
					// Reset the invalid trajectories counter
					invalidTrajectoriesCounter = 0;

					// Set the trace brush size
					trace.setBrushSize(brushSize);

					// Calculate the trace colors and check that painting the trace will improve the painting
					if (trace.calculateColors(maxColorDiff, similarColorPixels, originalImg, backgroundColor)) {
						// Test passed, the trace is good enough to be painted
						traceNotFound = false;
						nTraces++;
					} else {
						// The trace is not good enough, try again in the next loop step
						invalidTracesCounter++;
					}
				} else {
					// The trace is not good enough, try again in the next loop step
					invalidTrajectoriesCounter++;
					invalidTracesCounter++;
				}
			}
		}

		// Return the trace
		return trace;
	}

	//
	// Updates the similar color and bad painted pixel arrays
	//
	function updatePixelArrays() {
		var pixelDensity, redBg, greenBg, blueBg, x, y, wellPainted, pixel, imgPixel, canvasPixel;
		var redPainted, greenPainted, bluePainted;

		// Load the screen pixels
		p.loadPixels();
		pixelDensity = p.displayDensity();

		// Update the arrays
		nBadPaintedPixels = 0;
		redBg = p.red(backgroundColor);
		greenBg = p.green(backgroundColor);
		blueBg = p.blue(backgroundColor);

		for (x = 0; x < imgWidth; x++) {
			for (y = 0; y < imgHeight; y++) {
				// Check if the pixel is well painted
				wellPainted = false;
				pixel = x + y * imgWidth;
				imgPixel = 4 * pixel;
				canvasPixel = 4 * (x + y * p.width * pixelDensity) * pixelDensity;
				redPainted = p.pixels[canvasPixel];
				greenPainted = p.pixels[canvasPixel + 1];
				bluePainted = p.pixels[canvasPixel + 2];

				if (redPainted !== redBg && greenPainted !== greenBg && bluePainted !== blueBg) {
					wellPainted = (Math.abs(originalImg.pixels[imgPixel] - redPainted) < maxColorDiff[0]);
					wellPainted = wellPainted && (Math.abs(originalImg.pixels[imgPixel + 1] - greenPainted) < maxColorDiff[1]);
					wellPainted = wellPainted && (Math.abs(originalImg.pixels[imgPixel + 2] - bluePainted) < maxColorDiff[2]);
				}

				similarColorPixels[pixel] = wellPainted;

				if (!wellPainted) {
					badPaintedPixels[nBadPaintedPixels] = pixel;
					nBadPaintedPixels++;
				}
			}
		}

		// Update the screen pixels
		p.updatePixels();
	}

	//
	// Draws on the screen the visited pixels and similar color arrays
	//
	function drawDebugImages() {
		var pixelDensity, x, y, pixel, visitedCol, similarCol, canvasPixel1, canvasPixel2;

		// Load the screen pixels
		p.loadPixels();
		pixelDensity = p.displayDensity();

		// Draw the arrays
		for (x = 0; x < imgWidth; x++) {
			for (y = 0; y < imgHeight; y++) {
				pixel = x + y * imgWidth;
				visitedCol = visitedPixels[pixel] ? 255 : 0;
				similarCol = similarPixels[pixel] ? 255 : 0;
				canvasPixel1 = 4 * (x + y * p.width * pixelDensity + imgWidth) * pixelDensity;
				canvasPixel2 = 4 * (x + y * p.width * pixelDensity + 2 * imgWidth) * pixelDensity;
				p.pixels[canvasPixel1] = visitedCol;
				p.pixels[canvasPixel1 + 1] = visitedCol;
				p.pixels[canvasPixel1 + 2] = visitedCol;
				p.pixels[canvasPixel2] = similarCol;
				p.pixels[canvasPixel2 + 1] = similarCol;
				p.pixels[canvasPixel2 + 2] = similarCol;
			}
		}

		// Update the screen pixels
		p.updatePixels();
	}

	//
	// This class simulates the movement of a bristle
	//
	// Credits: Javier Graciá Carpio
	// License: Creative Commons Attribution-ShareAlike (CC BY-SA)
	//
	function Bristle(nElements, thickness) {
		var thicknessDecrement, i;

		this.nPositions = nElements + 1;
		this.positions = [];
		this.lengths = [];
		this.thicknesses = [];

		// Fill the arrays
		thicknessDecrement = thickness / nElements;

		for (i = 0; i < this.nPositions; i++) {
			this.positions[i] = p.createVector(0, 0);
			this.lengths[i] = this.nPositions - i;
			this.thicknesses[i] = thickness - (i - 1) * thicknessDecrement;
		}
	}

	//
	// Moves all the bristle elements to a new position
	//
	Bristle.prototype.setPosition = function(newPosition) {
		var i, pos;

		for (i = 0; i < this.nPositions; i++) {
			pos = this.positions[i];
			pos.x = newPosition.x;
			pos.y = newPosition.y;
		}
	};

	//
	// Updates the bristle position
	//
	Bristle.prototype.updatePosition = function(newPosition) {
		var previousPos, i, pos, length, ang;

		// Set the first position to the provided position
		previousPos = this.positions[0];
		previousPos.x = newPosition.x;
		previousPos.y = newPosition.y;

		// Update the other positions
		for (i = 1; i < this.nPositions; i++) {
			pos = this.positions[i];
			length = this.lengths[i];
			ang = p.atan2(previousPos.y - pos.y, previousPos.x - pos.x);
			pos.x = previousPos.x - length * Math.cos(ang);
			pos.y = previousPos.y - length * Math.sin(ang);
			previousPos = pos;
		}
	};

	//
	// Paints the bristle on the screen
	//
	Bristle.prototype.paintOnScreen = function(col) {
		var i, pos, previousPos;

		// Set the stroke color
		p.stroke(col);

		// Paint the bristle elements
		previousPos = this.positions[0];

		for (i = 1; i < this.nPositions; i++) {
			pos = this.positions[i];

			p.strokeWeight(this.thicknesses[i]);
			p.line(previousPos.x, previousPos.y, pos.x, pos.y);

			previousPos = pos;
		}
	};

	//
	// This class simulates a brush composed of several bristles
	//
	// Credits: Javier Graciá Carpio
	// License: Creative Commons Attribution-ShareAlike (CC BY-SA)
	//
	function Brush(size) {
		var bristleLength, nElements, bristleThickness, bristle;

		// The maximum bristle length
		this.maxBristleLength = 15;
		// The maximum bristle thickness
		this.maxBristleThickness = 5;
		// The number of positions to use to calculate the brush average position
		this.positionsForAverage = 4;
		// The noise range to add to the bristles vertical position on the brush
		this.bristleVerticalNoise = 8;
		// The maximum noise range to add in each update to the bristles horizontal position on the brush
		this.maxBristleHorizontalNoise = 4;
		// Controls the bristles horizontal noise speed
		this.noiseSpeedFactor = 0.04;

		this.position = p.createVector(0, 0);
		this.nBristles = Math.round(size * p.random(1.6, 1.9));
		this.bristles = [];
		this.bOffsets = [];
		this.bPositions = [];
		this.positionsHistory = [];
		this.averagePosition = this.position.copy();
		this.noiseSeed = p.random(1000);
		this.updatesCounter = 0;
		this.bristleHorizontalNoise = Math.min(0.3 * size, this.maxBristleHorizontalNoise);

		// Populate the bristles arrays
		bristleLength = Math.min(size, this.maxBristleLength);
		nElements = Math.round(Math.sqrt(2 * bristleLength));
		bristleThickness = Math.min(0.8 * bristleLength, this.maxBristleThickness);

		for (bristle = 0; bristle < this.nBristles; bristle++) {
			this.bristles[bristle] = new Bristle(nElements, bristleThickness);
			this.bOffsets[bristle] = p.createVector(size * p.random(-0.5, 0.5), this.bristleVerticalNoise * p.random(-0.5, 0.5));
			this.bPositions[bristle] = p.createVector(0, 0);
		}
	}

	//
	// Moves the brush to a new position and resets some internal counters
	//
	Brush.prototype.init = function(newPosition) {
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
		this.positionsHistory = [];
		this.averagePosition.x = this.position.x;
		this.averagePosition.y = this.position.y;
		this.updatesCounter = 0;
	};

	//
	// Updates the brush properties
	//
	Brush.prototype.update = function(newPosition, updateBristleElements) {
		var historySize, pos, xNewAverage, yNewAverage, i, directionAngle, bristle;

		// Update the position
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;

		// Add the new position to the positions history
		historySize = this.positionsHistory.length;

		if (historySize < this.positionsForAverage) {
			this.positionsHistory[historySize] = newPosition.copy();
			historySize++;
		} else {
			pos = this.positionsHistory[this.updatesCounter % this.positionsForAverage];
			pos.x = newPosition.x;
			pos.y = newPosition.y;
		}

		// Calculate the new average position
		xNewAverage = 0;
		yNewAverage = 0;

		for (i = 0; i < historySize; i++) {
			pos = this.positionsHistory[i];
			xNewAverage += pos.x;
			yNewAverage += pos.y;
		}

		xNewAverage /= historySize;
		yNewAverage /= historySize;

		// Calculate the direction angle
		directionAngle = p.HALF_PI + p.atan2(yNewAverage - this.averagePosition.y, xNewAverage - this.averagePosition.x);

		// Update the average position
		this.averagePosition.x = xNewAverage;
		this.averagePosition.y = yNewAverage;

		// Update the bristles positions array
		this.updateBristlePositions(directionAngle);

		// Update the bristles elements to their new positions
		if (updateBristleElements) {
			if (historySize === this.positionsForAverage) {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].updatePosition(this.bPositions[bristle]);
				}
			} else if (historySize === this.positionsForAverage - 1) {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].setPosition(this.bPositions[bristle]);
				}
			}
		}

		// Increment the updates counter
		this.updatesCounter++;
	};

	//
	// Update the bristle positions array
	//
	Brush.prototype.updateBristlePositions = function(directionAngle) {
		var cos, sin, noisePos, bristle, offset, x, y, pos;

		if (this.positionsHistory.length >= this.positionsForAverage - 1) {
			// This saves some calculations
			cos = Math.cos(directionAngle);
			sin = Math.sin(directionAngle);
			noisePos = this.noiseSeed + this.noiseSpeedFactor * this.updatesCounter;

			for (bristle = 0; bristle < this.nBristles; bristle++) {
				// Add some noise to make it look more realistic
				offset = this.bOffsets[bristle];
				x = offset.x + this.bristleHorizontalNoise * (p.noise(noisePos + 0.1 * bristle) - 0.5);
				y = offset.y;

				// Rotate the offset vector and add it to the position
				pos = this.bPositions[bristle];
				pos.x = this.position.x + (x * cos - y * sin);
				pos.y = this.position.y + (x * sin + y * cos);
			}
		}
	};

	//
	// Paints the brush on the screen using the provided bristle colors
	//
	Brush.prototype.paintOnScreen = function(colors) {
		var bristle;

		if (this.positionsHistory.length === this.positionsForAverage) {
			for (bristle = 0; bristle < this.nBristles; bristle++) {
				this.bristles[bristle].paintOnScreen(colors[bristle]);
			}
		}
	};

	//
	// Returns the total number of bristles in the brush
	//
	Brush.prototype.getNBristles = function() {
		return this.nBristles;
	};

	//
	// Returns the current bristles positions
	//
	Brush.prototype.getBristlesPositions = function() {
		if (this.positionsHistory.length === this.positionsForAverage) {
			return this.bPositions;
		}
	};

	//
	// This class simulates the movement of a brush on the canvas
	//
	// Credits: Javier Graciá Carpio
	// License: Creative Commons Attribution-ShareAlike (CC BY-SA)
	//
	function Trace(position, nSteps, speed) {
		var pos, initAng, noiseSeed, step, ang;

		// Sets how random the trace movement is
		this.noiseFactor = 0.007;
		// The maximum allowed fraction of pixels in the trace trajectory with colors similar to the original image
		this.maxSimilarColorFractionInTrajectory = 0.6;
		// The maximum allowed fraction of pixels in the trace trajectory that have been visited before
		this.maxVisitsFractionInTrajectory = 0.35;
		// The minimum fraction of pixels in the trace trajectory that should fall inside the canvas
		this.minInsideFractionInTrajectory = 0.4;
		// The maximum allowed value of the colors standard deviation along the trace trajectory
		this.maxColorStDevInTrajectory = 45;
		// The maximum allowed fraction of pixels in the trace with colors similar to the original image
		this.maxSimilarColorFraction = 0.8;
		// The minimum fraction of pixels in the trace that should fall inside the canvas
		this.minInsideFraction = 0.7;
		// The minimum fraction of trace that needs to be painted already to consider it painted
		this.minPaintedFraction = 0.65;
		// The minimum color improvement factor of the already painted pixels required to paint the trace on the canvas
		this.minColorImprovementFactor = 0.6;
		// The minimum improvement fraction in the number of well painted pixels to consider to paint the trace even if
		// there is not a significant color improvement
		this.bigWellPaintedImprovementFraction = 0.3;
		// The minimum reduction fraction in the number of bad painted pixels required to paint the trace on the canvas
		this.minBadPaintedReductionFraction = 0.45;
		// The maximum allowed fraction of pixels in the trace that were previously well painted and will be now bad
		// painted
		this.maxWellPaintedDestructionFraction = 0.4;
		// The maximum color change between the bristles
		this.colorChange = 12;
		// The typical step when the color mixing starts
		this.typicalMixStartingStep = 5;
		// The color mixing strength
		this.mixStrength = 0.012;
		// The minimum alpha value to be considered for the trace average color calculation
		this.minAlpha = 20;

		this.nSteps = nSteps;
		this.positions = [];
		this.colors = [];
		this.alphas = [];
		this.brush = undefined;
		this.nBristles = 0;

		// Fill the positions array
		pos = position.copy();
		this.positions[0] = pos;
		initAng = p.random(p.TWO_PI);
		noiseSeed = p.random(1000);

		for (step = 1; step < this.nSteps; step++) {
			ang = initAng + p.TWO_PI * (p.noise(noiseSeed + this.noiseFactor * step) - 0.5);
			pos = p.createVector(pos.x + speed * Math.cos(ang), pos.y + speed * Math.sin(ang));
			this.positions[step] = pos;
		}
	}

	//
	// Checks if the trace trajectory is valid. To be valid it should fall on a region that was not painted correctly
	// before, the fraction of visited pixels in the trace trajectory should be small, it should not fall most of the
	// time outside the canvas, and the color changes should not be too high.
	//
	Trace.prototype.hasValidTrajectory = function(similarColor, visitedPixels, originalImg) {
		var insideCounter, similarColorCounter, visitedPixelsCounter, redSum, redSqSum, greenSum, greenSqSum;
		var blueSum, blueSqSum, width, height, step, pos, x, y, pixel, imgPixel, red, green, blue, redStDev;
		var greenStDev, blueStDev, insideCanvas, badPainted, notVisited, smallColorChange;

		// Obtain some pixel statistics along the trajectory
		insideCounter = 0;
		similarColorCounter = 0;
		visitedPixelsCounter = 0;
		redSum = 0;
		redSqSum = 0;
		greenSum = 0;
		greenSqSum = 0;
		blueSum = 0;
		blueSqSum = 0;
		width = originalImg.width;
		height = originalImg.height;

		for (step = 0; step < this.nSteps; step++) {
			pos = this.positions[step];
			x = Math.round(pos.x);
			y = Math.round(pos.y);

			// Check that it's inside the picture
			if (x >= 0 && x < width && y >= 0 && y < height) {
				// Increase the counters
				insideCounter++;
				pixel = x + y * width;

				if (similarColor[pixel]) {
					similarColorCounter++;
				}

				if (visitedPixels[pixel]) {
					visitedPixelsCounter++;
				}

				// Extract the pixel color properties
				imgPixel = 4 * pixel;
				red = originalImg.pixels[imgPixel];
				green = originalImg.pixels[imgPixel + 1];
				blue = originalImg.pixels[imgPixel + 2];
				redSum += red;
				redSqSum += red * red;
				greenSum += green;
				greenSqSum += green * green;
				blueSum += blue;
				blueSqSum += blue * blue;
			}
		}

		// Obtain the colors standard deviation along the trajectory
		redStDev = 0;
		greenStDev = 0;
		blueStDev = 0;

		if (insideCounter > 1) {
			redStDev = Math.sqrt((redSqSum - redSum * redSum / insideCounter) / (insideCounter - 1));
			greenStDev = Math.sqrt((greenSqSum - greenSum * greenSum / insideCounter) / (insideCounter - 1));
			blueStDev = Math.sqrt((blueSqSum - blueSum * blueSum / insideCounter) / (insideCounter - 1));
		}

		// Check if it's a valid trajectory
		insideCanvas = insideCounter >= this.minInsideFractionInTrajectory * this.nSteps;
		badPainted = similarColorCounter <= this.maxSimilarColorFractionInTrajectory * insideCounter;
		notVisited = visitedPixelsCounter <= this.maxVisitsFractionInTrajectory * insideCounter;
		smallColorChange = redStDev < this.maxColorStDevInTrajectory && greenStDev < this.maxColorStDevInTrajectory && blueStDev < this.maxColorStDevInTrajectory;

		return insideCanvas && badPainted && notVisited && smallColorChange;
	};

	//
	// Defines the brush size that should be used to paint the trace
	//
	Trace.prototype.setBrushSize = function(brushSize) {
		this.brush = new Brush(brushSize);
		this.brush.init(this.positions[0]);
		this.nBristles = this.brush.getNBristles();
	};

	//
	// Calculates the trace colors. Returns false if the region covered by the trace was already painted with similar
	// colors, most of the trace is outside the canvas, or drawing the trace will not improve considerably the painting.
	//
	Trace.prototype.calculateColors = function(maxColorDiff, similarColor, originalImg, bgColor) {
		var alphaDecrement, alpha, step, bristle, pixelDensity, redAverage, greenAverage, blueAverage, insideCounter;
		var outsideCounter, similarColorCounter, originalColors, similarColorBool, width, height, redBg, greenBg;
		var blueBg, bristlesPositions, pos, x, y, loc, canvasPixel, redPainted, greenPainted, bluePainted, pixel;
		var redOriginal, greenOriginal, blueOriginal, wellPainted, outsideCanvas, wellPaintedCounter;
		var destroyedWellPaintedCounter, alreadyPaintedCounter, colorImprovement, redDiff, greenDiff, blueDiff;
		var wellPaintedImprovement, previousBadPainted, averageMaxColorDiff, alreadyPainted, colorImproves;
		var bigWellPaintedImprovement, reducedBadPainted, lowWellPaintedDestruction, improves, noiseSeed, deltaColor;
		var mixStartingStep, locPrev, f;

		// Initialize the colors and alphas arrays
		alphaDecrement = Math.min(255 / (this.nSteps), 25);
		alpha = 255 + alphaDecrement;

		for (step = 0; step < this.nSteps; step++) {
			alpha -= alphaDecrement;
			this.alphas[step] = p.constrain(Math.round(alpha), 2, 255);

			for (bristle = 0; bristle < this.nBristles; bristle++) {
				this.colors[3 * (bristle + step * this.nBristles)] = -1;
			}
		}

		// Load the screen pixels
		p.loadPixels();
		pixelDensity = p.displayDensity();

		// Calculate the trace average color and obtain some trace statistics
		redAverage = 0;
		greenAverage = 0;
		blueAverage = 0;
		insideCounter = 0;
		outsideCounter = 0;
		similarColorCounter = 0;
		originalColors = [];
		similarColorBool = [];
		width = originalImg.width;
		height = originalImg.height;
		redBg = p.red(bgColor);
		greenBg = p.green(bgColor);
		blueBg = p.blue(bgColor);

		for (step = 0; step < this.nSteps; step++) {
			// Move the brush and get the bristles positions
			this.brush.update(this.positions[step], false);
			bristlesPositions = this.brush.getBristlesPositions();

			// Check if the alpha value it's high enough for the average color calculation
			if (this.alphas[step] > this.minAlpha && typeof bristlesPositions !== "undefined") {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);

					// Check that the bristle is inside the canvas
					pos = bristlesPositions[bristle];
					x = Math.round(pos.x);
					y = Math.round(pos.y);

					if (x >= 0 && x < width && y >= 0 && y < height) {

						// Save the already painted color if it's not the background color
						canvasPixel = 4 * (x + y * p.width * pixelDensity) * pixelDensity;
						redPainted = p.pixels[canvasPixel];
						greenPainted = p.pixels[canvasPixel + 1];
						bluePainted = p.pixels[canvasPixel + 2];

						if (redPainted !== redBg && greenPainted !== greenBg && bluePainted !== blueBg) {
							this.colors[loc] = redPainted;
							this.colors[loc + 1] = greenPainted;
							this.colors[loc + 2] = bluePainted;
						}

						// Save the original image color
						pixel = 4 * (x + y * width);
						redOriginal = originalImg.pixels[pixel];
						greenOriginal = originalImg.pixels[pixel + 1];
						blueOriginal = originalImg.pixels[pixel + 2];
						originalColors[loc] = redOriginal;
						originalColors[loc + 1] = greenOriginal;
						originalColors[loc + 2] = blueOriginal;

						// Add the original image color to the average
						redAverage += redOriginal;
						greenAverage += greenOriginal;
						blueAverage += blueOriginal;

						// Increment the counters
						insideCounter++;

						if (similarColor[pixel / 4]) {
							similarColorBool[loc / 3] = true;
							similarColorCounter++;
						} else {
							similarColorBool[loc / 3] = false;
						}
					} else {
						originalColors[loc] = -1;
						outsideCounter++;
					}
				}
			}
		}

		if (insideCounter > 0) {
			redAverage /= insideCounter;
			greenAverage /= insideCounter;
			blueAverage /= insideCounter;
		}

		// Update the screen pixels
		p.updatePixels();

		// Reset the brush to the initial position
		this.brush.init(this.positions[0]);

		// Check if the trace region was painted before with similar colors or falls outside the image
		wellPainted = similarColorCounter >= this.maxSimilarColorFraction * insideCounter;
		outsideCanvas = insideCounter < this.minInsideFraction * (insideCounter + outsideCounter);

		if (wellPainted || outsideCanvas) {
			// The trace is not valid, don't paint it
			return false;
		}

		// Check that drawing the trace will improve the accuracy of the painting
		wellPaintedCounter = 0;
		destroyedWellPaintedCounter = 0;
		alreadyPaintedCounter = 0;
		colorImprovement = 0;

		for (step = 0; step < this.nSteps; step++) {
			// Check if the alpha value is high enough
			if (this.alphas[step] >= this.minAlpha) {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					// Check that the bristle position is inside the canvas
					loc = 3 * (bristle + step * this.nBristles);

					if (originalColors[loc] >= 0) {
						// Count the number of well painted pixels, and how many are not well painted anymore
						redOriginal = originalColors[loc];
						greenOriginal = originalColors[loc + 1];
						blueOriginal = originalColors[loc + 2];
						redDiff = Math.abs(redOriginal - redAverage);
						greenDiff = Math.abs(greenOriginal - greenAverage);
						blueDiff = Math.abs(blueOriginal - blueAverage);

						if ((redDiff < maxColorDiff[0]) && (greenDiff < maxColorDiff[1]) && (blueDiff < maxColorDiff[2])) {
							wellPaintedCounter++;
						} else if (similarColorBool[loc / 3]) {
							destroyedWellPaintedCounter++;
						}

						// Count previously painted pixels and calculate their color improvement
						if (this.colors[loc] >= 0) {
							alreadyPaintedCounter++;

							// Calculate the color improvement
							colorImprovement += Math.abs(redOriginal - this.colors[loc]) - redDiff;
							colorImprovement += Math.abs(greenOriginal - this.colors[loc + 1]) - greenDiff;
							colorImprovement += Math.abs(blueOriginal - this.colors[loc + 2]) - blueDiff;
						}
					}
				}
			}
		}

		wellPaintedImprovement = wellPaintedCounter - similarColorCounter;
		previousBadPainted = insideCounter - similarColorCounter;
		averageMaxColorDiff = (maxColorDiff[0] + maxColorDiff[1] + maxColorDiff[2]) / 3;

		alreadyPainted = alreadyPaintedCounter >= this.minPaintedFraction * insideCounter;
		colorImproves = colorImprovement >= this.minColorImprovementFactor * averageMaxColorDiff * alreadyPaintedCounter;
		bigWellPaintedImprovement = wellPaintedImprovement >= this.bigWellPaintedImprovementFraction * insideCounter;
		reducedBadPainted = wellPaintedImprovement >= this.minBadPaintedReductionFraction * previousBadPainted;
		lowWellPaintedDestruction = destroyedWellPaintedCounter <= this.maxWellPaintedDestructionFraction * wellPaintedImprovement;
		improves = (colorImproves || bigWellPaintedImprovement) && reducedBadPainted && lowWellPaintedDestruction;

		if (alreadyPainted && !improves) {
			// Don't use this trace, we are not going to improve the painting
			return false;
		}

		// The trace is good enough for painting!
		// Set the first step bristle colors to the original image average color
		noiseSeed = p.random(1000);

		for (bristle = 0; bristle < this.nBristles; bristle++) {
			// Add some color changes to make it more realistic
			loc = 3 * bristle;
			deltaColor = this.colorChange * (p.noise(noiseSeed + 0.4 * bristle) - 0.5);
			this.colors[loc] = p.constrain(redAverage + deltaColor, 0, 255);
			this.colors[loc + 1] = p.constrain(greenAverage + deltaColor, 0, 255);
			this.colors[loc + 2] = p.constrain(blueAverage + deltaColor, 0, 255);
		}

		// Extend the colors to the step where the mixing starts
		mixStartingStep = p.constrain(this.typicalMixStartingStep, 1, this.nSteps);

		for (step = 1; step < mixStartingStep; step++) {
			for (bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				locPrev = loc - 3 * this.nBristles;
				this.colors[loc] = this.colors[locPrev];
				this.colors[loc + 1] = this.colors[locPrev + 1];
				this.colors[loc + 2] = this.colors[locPrev + 2];
			}
		}

		// Mix the previous step colors with the already painted colors
		f = 1 - this.mixStrength;

		for (step = mixStartingStep; step < this.nSteps; step++) {
			// Check if the alpha value is high enough for mixing
			if (this.alphas[step] >= this.minAlpha) {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					locPrev = loc - 3 * this.nBristles;

					// Check if there is a canvas color at that position
					if (this.colors[loc] >= 0) {
						// Mix the previous step color with the canvas color
						this.colors[loc] = f * this.colors[locPrev] + this.mixStrength * this.colors[loc];
						this.colors[loc + 1] = f * this.colors[locPrev + 1] + this.mixStrength * this.colors[loc + 1];
						this.colors[loc + 2] = f * this.colors[locPrev + 2] + this.mixStrength * this.colors[loc + 2];
					} else {
						// Use the previous step colors
						this.colors[loc] = this.colors[locPrev];
						this.colors[loc + 1] = this.colors[locPrev + 1];
						this.colors[loc + 2] = this.colors[locPrev + 2];
					}
				}
			} else {
				// Copy the previous step colors
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					locPrev = loc - 3 * this.nBristles;
					this.colors[loc] = this.colors[locPrev];
					this.colors[loc + 1] = this.colors[locPrev + 1];
					this.colors[loc + 2] = this.colors[locPrev + 2];
				}
			}
		}

		// The trace is ready for painting
		return true;
	};

	//
	// Paints the trace on the screen
	//
	Trace.prototype.paint = function(visitedPixels, width, height) {
		var bristlesColors, step, alpha, bristle, loc, bristlesPositions, pos, x, y;

		// Check that the trace colors have been initialized
		if (typeof this.colors !== "undefined") {
			// Paint the brush step by step
			bristlesColors = [];

			for (step = 0; step < this.nSteps; step++) {
				// Calculate the bristles colors
				alpha = this.alphas[step];

				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2],
							alpha);
				}

				// Move the brush position and paint it
				this.brush.update(this.positions[step], true);
				this.brush.paintOnScreen(bristlesColors);

				// Fill the visited pixels array if alpha is high enough
				if (alpha > this.minAlpha) {
					bristlesPositions = this.brush.getBristlesPositions();

					if (typeof bristlesPositions !== "undefined") {
						for (bristle = 0; bristle < this.nBristles; bristle++) {
							pos = bristlesPositions[bristle];
							x = Math.round(pos.x);
							y = Math.round(pos.y);

							if (x >= 0 && x < width && y >= 0 && y < height) {
								visitedPixels[x + y * width] = true;
							}
						}
					}
				}
			}

			// Reset the brush to the initial position
			this.brush.init(this.positions[0]);
		}
	};

	//
	// Paints the trace on the screen for a given trace step
	//
	Trace.prototype.paintStep = function(step, visitedPixels, width, height) {
		var bristlesColors, alpha, bristle, loc, bristlesPositions, pos, x, y;

		// Check that the trace colors have been initialized
		if (typeof this.colors !== "undefined") {
			// Calculate the bristles colors
			bristlesColors = [];
			alpha = this.alphas[step];

			for (bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2], alpha);
			}

			// Move the brush position and paint it
			this.brush.update(this.positions[step], true);
			this.brush.paintOnScreen(bristlesColors);

			// Fill the visitCounts array if alpha is high enough
			if (alpha > this.minAlpha) {
				bristlesPositions = this.brush.getBristlesPositions();

				if (typeof bristlesPositions !== "undefined") {
					for (bristle = 0; bristle < this.nBristles; bristle++) {
						pos = bristlesPositions[bristle];
						x = Math.round(pos.x);
						y = Math.round(pos.y);

						if (x >= 0 && x < width && y >= 0 && y < height) {
							visitedPixels[x + y * width] = true;
						}
					}
				}
			}

			// Check if we are at the last step
			if (step === this.nSteps - 1) {
				// Reset the brush to the initial position
				this.brush.init(this.positions[0]);
			}
		}
	};

	//
	// Returns the number of steps in the trace trajectory
	//
	Trace.prototype.getNSteps = function() {
		return this.nSteps;
	};
};
