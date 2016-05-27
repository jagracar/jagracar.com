//
// This sketch takes a picture as input and simulates an oil paint.
// It has many optional parameters, but only some combinations
// produce optimal results.
//
// Credits: Javier Gracia Carpio
// License: Creative Commons Attribution-ShareAlike (CC BY-SA)
// Inspiration: Some of the works by Sergio Albiac
//
var oilPaintingSketch = function(p) {
	// The picture file name in the data directory
	var pictureFile = "me.jpg";
	// The maximum RGB color difference to consider the pixel correctly painted
	var maxColorDiff = [ 40, 40, 40 ];
	// Compare the oil paint with the original picture
	var comparisonMode = false;
	// Show additional debug images
	var debugMode = false;
	// Draw the traces step by step, or in one go
	var drawStepByStep = false;
	// The smaller brush size allowed
	var smallerBrushSize = 4;
	// The brush size decrement ratio
	var brushSizeDecrement = 1.3;
	// The maximum bristle length
	var maxBristleLength = 12;
	// The maximum bristle thickness
	var maxBristleThickness = 10;
	// The maximum number of invalid traces allowed before the brush size is
	// reduced
	var maxInvalidTraces = 250;
	// The maximum number of invalid traces allowed for the smaller brush size
	// before the painting is stopped
	var maxInvalidTracesForSmallerSize = 350;
	// The trace speed
	var traceSpeed = 2;
	// The typical trace length, relative to the brush size
	var relativeTraceLength = 2.3;
	// The minimum trace length allowed
	var minTraceLength = 8;
	// The screen background color
	var bgColor = p.color(255);

	// Global variables
	var originalImg = undefined;
	var imgWidth = undefined;
	var imgHeight = undefined;
	var similarColor = undefined;
	var visitedPixels = undefined;
	var badPaintedPixels = undefined;
	var nBadPaintedPixels = undefined;
	var averageBrushSize = undefined;
	var trace = undefined;
	var nTraces = undefined;
	var invalidTracesCounter = undefined;
	var newTrace = undefined;
	var paint = undefined;
	var startTime = undefined;
	var lastChangeTime = undefined;
	var lastChangeFrameCount = undefined;
	var step = undefined;

	// Load the image before the sketch is run
	p.preload = function() {
		originalImg = p.loadImage("img/" + pictureFile);
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, nPixels, pixel;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (originalImg.width > maxCanvasWidth) {
			originalImg.resize(maxCanvasWidth, originalImg.height * maxCanvasWidth / originalImg.width);
		}

		// Load the original image pixels. This way they will be all the time available
		originalImg.loadPixels();
		imgWidth = originalImg.width;
		imgHeight = originalImg.height;

		// Create the pixel arrays
		nPixels = imgWidth * imgHeight;
		similarColor = [];
		visitedPixels = [];
		badPaintedPixels = []
		nBadPaintedPixels = nPixels;

		for (pixel = 0; pixel < nPixels; pixel++) {
			similarColor[pixel] = false;
			visitedPixels[pixel] = false;
			badPaintedPixels[pixel] = pixel;
		}

		// Create the sketch canvas
		if (comparisonMode) {
			p.createCanvas(2 * imgWidth, imgHeight);
		} else if (debugMode) {
			p.createCanvas(3 * imgWidth, imgHeight);
		} else {
			p.createCanvas(imgWidth, imgHeight);
		}

		// Sketch setup
		p.background(bgColor);
		p.strokeCap(p.SQUARE);
		p.frameRate(2000);

		// Initialize the rest of the sketch variables
		averageBrushSize = Math.max(smallerBrushSize, Math.sqrt(imgWidth * imgHeight) / 6);
		trace = undefined;
		nTraces = 0;
		invalidTracesCounter = 0;
		newTrace = true;
		paint = true;
		startTime = p.millis();
		lastChangeTime = startTime;
		lastChangeFrameCount = 0;
		step = 0;
	};

	// Execute the sketch
	p.draw = function() {
		var totalTime, ellapsedTime, nPixels, pixel, validTrajectory;
		var initPosition, brushSize, nSteps, nBristles, bristleLength, bristleThickness, brush, i;

		// Create a new trace or paint the current one
		if (newTrace) {
			// Check if we should stop painting
			if (averageBrushSize === smallerBrushSize && invalidTracesCounter > maxInvalidTracesForSmallerSize) {
				totalTime = (p.millis() - startTime) / 1000.0;

				console.log("Total number of painted traces: " + nTraces);
				console.log("Average frame rate = " + Math.round(p.frameCount / totalTime));
				console.log("Processing time = " + totalTime + " seconds");

				// Stop painting traces
				newTrace = false;
				paint = false;

				// Stop the sketch
				p.noLoop();
			} else {
				// Change the brush size if there were too many invalid traces
				if (averageBrushSize > smallerBrushSize && invalidTracesCounter > maxInvalidTraces) {
					averageBrushSize = Math.max(smallerBrushSize, Math.min(averageBrushSize / brushSizeDecrement,
							averageBrushSize - 2));
					ellapsedTime = (p.millis() - lastChangeTime) / 1000.0;

					console
							.log("Frame = " + p.frameCount + ", traces = " + nTraces + ", new brush size = "
									+ averageBrushSize);
					console.log("Average frame rate = "
							+ Math.round((p.frameCount - lastChangeFrameCount) / ellapsedTime));
					console.log("");

					// Reset some of the sketch variables
					invalidTracesCounter = 0;
					lastChangeTime = p.millis();
					lastChangeFrameCount = p.frameCount;

					// Reset the visited pixels array
					visitedPixels = [];
					nPixels = imgWidth * imgHeight;

					for (pixel = 0; pixel < nPixels; pixel++) {
						visitedPixels[pixel] = false;
					}
				}

				// Create new traces until one of them has a valid trajectory
				validTrajectory = false;
				initPosition = p.createVector(0, 0);
				brushSize = Math.max(smallerBrushSize, (0.95 + 0.1 * Math.random()) * averageBrushSize);
				nSteps = Math.max(minTraceLength, Math.round(relativeTraceLength * brushSize / traceSpeed));

				while (!validTrajectory) {
					// Create the trace
					pixel = badPaintedPixels[p.floor(nBadPaintedPixels * Math.random())];
					initPosition.set(pixel % imgWidth, pixel / imgWidth);
					trace = new Trace(initPosition, nSteps, traceSpeed);

					// Check if it has a valid trajectory
					validTrajectory = trace.hasValidTrajectory(similarColor, visitedPixels, imgWidth, imgHeight);
				}

				// Create the Brush
				nBristles = Math.round(brushSize * p.random(0.7, 1.0));
				bristleLength = Math.min(2 * brushSize, maxBristleLength);
				bristleThickness = Math.min(0.8 * brushSize, maxBristleThickness);
				brush = new Brush(initPosition, brushSize, nBristles, bristleLength, bristleThickness);

				// Add the brush to the trace
				trace.setBrush(brush);

				// Calculate the trace colors and check that painting the trace will improve the painting
				if (trace.calculateColors(maxColorDiff, similarColor, originalImg, bgColor)) {
					// Test passed, the trace is good enough to be painted
					newTrace = false;
					nTraces++;
					invalidTracesCounter = 0;
					step = 0;
				} else {
					// The trace is not good enough, try again in the next loop
					invalidTracesCounter++;
				}
			}
		} else if (paint) {
			// Paint the trace step by step or in one go
			if (drawStepByStep) {
				// Paint 2 steps per frame
				for (i = 0; i < 2; i++) {
					trace.paintByStep(step, visitedPixels, imgWidth, imgHeight);
					step++;

					if (step === trace.getNSteps()) {
						newTrace = true;
						break;
					}
				}
			} else {
				trace.paint(visitedPixels, imgWidth, imgHeight);
				newTrace = true;
			}

			// Update the pixel arrays if we finished to paint the trace
			if (newTrace) {
				updatePixelArrays();
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
	// Updates the similar color and bad painted pixel arrays
	//
	function updatePixelArrays() {
		var rBg, gBg, bBg, x, y, wellPainted, pixel, imgPixel, canvasPixel, rCanvas, gCanvas, bCanvas, rDiff, gDiff, bDiff;

		// Load the screen pixels
		p.loadPixels();

		// Update the arrays
		nBadPaintedPixels = 0;
		rBg = p.red(bgColor);
		gBg = p.green(bgColor);
		bBg = p.blue(bgColor);

		for (x = 0; x < imgWidth; x++) {
			for (y = 0; y < imgHeight; y++) {
				// Check if the pixel is well painted
				wellPainted = false;
				pixel = x + y * imgWidth;
				imgPixel = 4 * pixel;
				canvasPixel = 4 * (x + y * p.width);

				// Check if the pixel has been painted before
				rCanvas = p.pixels[canvasPixel];
				gCanvas = p.pixels[canvasPixel + 1];
				bCanvas = p.pixels[canvasPixel + 2];

				if (rCanvas !== rBg && gCanvas !== gBg && bCanvas !== bBg) {
					rDiff = Math.abs(originalImg.pixels[imgPixel] - rCanvas);
					gDiff = Math.abs(originalImg.pixels[imgPixel + 1] - gCanvas);
					bDiff = Math.abs(originalImg.pixels[imgPixel + 2] - bCanvas);
					wellPainted = (rDiff < maxColorDiff[0]) && (gDiff < maxColorDiff[1]) && (bDiff < maxColorDiff[2]);
				}

				similarColor[pixel] = wellPainted;

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
		var x, y, pixel, visitedCol, similarCol, canvasPixel1, canvasPixel2;

		// Load the screen pixels
		p.loadPixels();

		// Draw the arrays
		for (x = 0; x < imgWidth; x++) {
			for (y = 0; y < imgHeight; y++) {
				pixel = x + y * imgWidth;
				visitedCol = visitedPixels[pixel] ? 255 : 0;
				similarCol = similarPixels[pixel] ? 255 : 0;
				canvasPixel1 = 4 * (x + y * p.width + imgWidth);
				canvasPixel2 = 4 * (x + y * p.width + 2 * imgWidth);
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
	function Bristle(nParts, initLength, deltaLength, initThickness, deltaThickness) {
		this.nPositions = nParts + 1;
		this.positions = [];
		this.lengths = [];
		this.thicknesses = [];

		// Fill the arrays
		var i;

		for (i = 0; i < this.nPositions; i++) {
			this.positions[i] = p.createVector(0, 0);
			this.lengths[i] = Math.max(1, initLength - i * deltaLength);
			this.thicknesses[i] = Math.max(0.1, initThickness - i * deltaThickness);
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
	// Updates the position of the bristle elements
	//
	Bristle.prototype.updatePosition = function(newPosition) {
		var i, pos, previousPos, ang, length;

		// Set the first position to the provided position
		pos = this.positions[0];
		pos.x = newPosition.x;
		pos.y = newPosition.y;
		previousPos = pos;

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
	// Draws the bristle on the screen
	//
	Bristle.prototype.paint = function(col) {
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
	function Brush(position, size, nBristles, bristleLength, bristleThickness) {
		// The number of positions to use to calculate the average position
		this.positionsForAverage = 4;
		// The noise range to add to the bristles vertical position on the brush
		this.bristleVerticalNoise = 8;
		// The noise range to add in each update to the bristles horizontal position on the brush
		this.bristleHorizontalNoise = 4;
		// Sets the bristles horizontal noise speed
		this.noiseSpeedFactor = 0.04;

		this.position = position.copy();
		this.nBristles = nBristles;
		this.bristles = [];
		this.bOffsets = [];
		this.bPositions = [];
		this.positionsHistory = [];
		this.averagePosition = this.position.copy();
		this.noiseSeed = 1000 * Math.random();
		this.updatesCounter = 0;
		this.bristleHorizontalNoise = Math.min(0.3 * size, this.bristleHorizontalNoise);

		// Populate the bristles arrays
		var nParts, initLength, deltaLength, initThickness, deltaThickness, bristle;
		nParts = Math.max(3, Math.round(Math.sqrt(2 * bristleLength)));
		initLength = nParts;
		deltaLength = 1;
		initThickness = bristleThickness;
		deltaThickness = initThickness / nParts;

		for (bristle = 0; bristle < this.nBristles; bristle++) {
			this.bristles[bristle] = new Bristle(nParts, initLength, deltaLength, initThickness, deltaThickness);
			this.bOffsets[bristle] = p.createVector(size * (Math.random() - 0.5), this.bristleVerticalNoise
					* (Math.random() - 0.5));
			this.bPositions[bristle] = p.createVector(0, 0);
		}
	}

	//
	// Reset the brush to its initial state
	//
	Brush.prototype.reset = function(initPosition) {
		this.position.x = initPosition.x;
		this.position.y = initPosition.y;
		this.positionsHistory = [];
		this.averagePosition.x = this.position.x;
		this.averagePosition.y = this.position.y;
		this.updatesCounter = 0;
	};

	//
	// Update the brush properties (position, direction, etc)
	//
	Brush.prototype.update = function(newPosition, updateBristles) {
		var xAverage, yAverage, historyLength, i, pos, directionAng, bristle;

		// Update the position
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;

		// Add the new position to the positions history
		this.positionsHistory[Math.floor(this.updatesCounter % this.positionsForAverage)] = newPosition;

		// Calculate the new average position
		xAverage = 0;
		yAverage = 0;
		historyLength = this.positionsHistory.length;

		for (i = 0; i < historyLength; i++) {
			pos = this.positionsHistory[i];
			xAverage += pos.x;
			yAverage += pos.y;
		}

		xAverage /= historyLength;
		yAverage /= historyLength;

		// Calculate the direction angle
		directionAng = p.HALF_PI + p.atan2(yAverage - this.averagePosition.y, xAverage - this.averagePosition.x);

		// Update the position and the average position
		this.averagePosition.x = xAverage;
		this.averagePosition.y = yAverage;

		// Update the bristles positions
		this.updateBristlePositions(directionAng);

		// Update the bristles to their new positions
		if (updateBristles) {
			if (historyLength < this.positionsForAverage) {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].setPosition(this.bPositions[bristle]);
				}
			} else {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].updatePosition(this.bPositions[bristle]);
				}
			}
		}

		// Increment the updates counter
		this.updatesCounter++;
	};

	//
	// Update the bristle positions array
	//
	Brush.prototype.updateBristlePositions = function(directionAng) {
		var cos, sin, noisePos, bristle, bPos, bOffset, x, y;

		// This saves some calculations
		cos = Math.cos(directionAng);
		sin = Math.sin(directionAng);
		noisePos = this.noiseSeed + this.noiseSpeedFactor * this.updatesCounter;

		for (bristle = 0; bristle < this.nBristles; bristle++) {
			bOffset = this.bOffsets[bristle];

			// Add some noise to make it look more realistic
			x = bOffset.x + this.bristleHorizontalNoise * (p.noise(noisePos + 0.1 * bristle) - 0.5);
			y = bOffset.y;

			// Rotate the offset vector and add it to the position
			bPos = this.bPositions[bristle];
			bPos.x = this.position.x + (x * cos - y * sin);
			bPos.y = this.position.y + (x * sin + y * cos);
		}
	};

	//
	// Draws the brush on the screen using the provided bristle colors
	//
	Brush.prototype.paint = function(colors, alpha) {
		if (this.positionsHistory.length === this.positionsForAverage && alpha > 0) {
			for (var bristle = 0; bristle < this.nBristles; bristle++) {
				this.bristles[bristle].paint(colors[bristle]);
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
		// Sets how random the trace movement is
		this.noiseFactor = 0.007;
		// The maximum allowed fraction of pixels in the trace trajectory with colors similar to the original image
		this.maxSimilarColorFractionInTrajectory = 0.6;
		// The maximum allowed fraction of pixels in the trace trajectory that have been visited before
		this.maxVisitsFractionInTrajectory = 0.35;
		// The maximum allowed fraction of pixels in the trace trajectory that fall outside the canvas
		this.maxOutsideFractionInTrajectory = 0.6;
		// The maximum allowed fraction of pixels in the trace with colors similar to the original image
		this.maxSimilarColorFraction = 0.85;
		// The maximum allowed fraction of pixels in the trace that fall outside the canvas
		this.maxOutsideFraction = 0.3;
		// The minimum fraction of trace that needs to be painted already to consider it painted
		this.minPaintedFraction = 0.65;
		// The trace minimum color improvement factor required to paint it on the canvas
		this.minColorImprovementFactor = 20;
		// The minimum improvement fraction in the number of well painted pixels to consider to paint the trace even if
		// there is not a significant color improvement
		this.bigWellPaintedImprovementFraction = 0.35;
		// The minimum reduction fraction in the number of bad painted pixels required to paint the trace on the canvas
		this.minBadPaintedReductionFraction = 0.3;
		// The maximum allowed fraction of pixels in the trace that were previously well painted and will be now bad
		// painted
		this.maxWellPaintedDestructionFraction = 0.55;
		// The brightness relative change range between the bristles
		this.brightnessRelativeChange = 0.09;
		// The step when the color mixing starts
		this.mixStartingStep = 5;
		// The color mixing strength
		this.mixStrength = 0.015;
		// The minimum alpha value to be considered for the trace average color calculation
		this.minAlpha = 20;

		this.nSteps = Math.max(1, nSteps);
		this.positions = [];
		this.alphas = [];
		this.colors = [];
		this.brush = undefined;
		this.nBristles = 0;

		// A sanity check
		this.mixStartingStep = Math.min(this.mixStartingStep, this.nSteps);

		// Fill the arrays
		var initAng, noiseSeed, pos, alphaDecrement, alpha, step, ang;
		initAng = p.TWO_PI * Math.random();
		noiseSeed = 1000 * Math.random();
		pos = position;
		alphaDecrement = Math.max(1, Math.min(255 / this.nSteps, 25));
		alpha = 255 + alphaDecrement;

		for (step = 0; step < this.nSteps; step++) {
			ang = initAng + p.TWO_PI * (p.noise(noiseSeed + this.noiseFactor * step) - 0.5);
			pos = p.createVector(pos.x + speed * Math.cos(ang), pos.y + speed * Math.sin(ang));
			alpha = Math.max(0, alpha - alphaDecrement);
			this.positions[step] = pos;
			this.alphas[step] = alpha;
		}
	}

	//
	// Checks if the trace trajectory is valid. To be valid it should fall on a region that was not painted correctly
	// before, the fraction of visited pixels in the trace trajectory should be small, and it should not fall most of
	// the time outside the canvas.
	//
	Trace.prototype.hasValidTrajectory = function(similarColor, visitedPixels, width, height) {
		var similarColorCounter, visitedPixelsCounter, outsideCounter, step, pos, x, y, pixel;
		var badPainted, notVisited, insideCanvas;
		similarColorCounter = 0;
		visitedPixelsCounter = 0;
		outsideCounter = 0;

		for (step = 0; step < this.nSteps; step++) {
			pos = this.positions[step];
			x = Math.round(pos.x);
			y = Math.round(pos.y);

			// Check if the trace position falls on the canvas
			if (x >= 0 && x < width && y >= 0 && y < height) {
				pixel = x + y * width;

				if (similarColor[pixel]) {
					similarColorCounter++;
				}

				if (visitedPixels[pixel]) {
					visitedPixelsCounter++;
				}
			} else {
				outsideCounter++;
			}
		}

		badPainted = similarColorCounter <= this.maxSimilarColorFractionInTrajectory * this.nSteps;
		notVisited = visitedPixelsCounter <= this.maxVisitsFractionInTrajectory * this.nSteps;
		insideCanvas = outsideCounter <= this.maxOutsideFractionInTrajectory * this.nSteps;

		return badPainted && notVisited && insideCanvas;
	};

	//
	// Associates a brush to the trace
	//
	Trace.prototype.setBrush = function(brush) {
		this.brush = brush;
		this.nBristles = this.brush.getNBristles();
	};

	//
	// Calculates the trace colors. Returns false if the region covered by the trace was already painted with similar
	// colors, most of the trace is outside the canvas, or drawing the trace will not improve considerably the painting.
	//
	Trace.prototype.calculateColors = function(maxColorDiff, similarColor, originalImg, bgCol) {
		var rAverage, gAverage, bAverage, width, height, rBg, gBg, bBg, rOriginal, gOriginal, bOriginal;
		var highAlpha, insideCounter, outsideCounter, similarColorCounter, similarColorBool, originalColors;
		var step, bristle, bristlesPositions, x, y, loc, imgPixel, wellPainted, outsideCanvas;
		var wellPaintedCounter, destroyedWellPaintedCounter, alreadyPaintedCounter, colorImprovement;
		var rDiff, gDiff, bDiff, rCanvasDiff, gCanvasDiff, bCanvasDiff;
		var wellPaintedImprovement, previousBadPainted, alreadyPainted, colorImproves;
		var bigWellPaintedImprovement, reducedBadPainted, lowWellPaintedDestruction, improves;
		var averageColor, hueAverage, saturationAverage, brightnessAverage, deltaBrightness, bristleColor;
		var noiseSeed, locPrev;

		// Load the canvas image pixels
		p.loadPixels();

		// Calculate the trace average color and obtain some trace statistics
		rAverage = 0;
		gAverage = 0;
		bAverage = 0;
		insideCounter = 0;
		outsideCounter = 0;
		similarColorCounter = 0;
		similarColorBool = [];
		originalColors = [];
		width = originalImg.width;
		height = originalImg.height;
		rBg = p.red(bgCol)
		gBg = p.green(bgCol)
		bBg = p.blue(bgCol)

		for (step = 0; step < this.nSteps; step++) {
			// Move the brush and get the bristles positions
			this.brush.update(this.positions[step], false);
			bristlesPositions = this.brush.getBristlesPositions();

			if (typeof bristlesPositions !== "undefined") {
				// Check if the alpha value is high enough
				highAlpha = this.alphas[step] > this.minAlpha;

				for (bristle = 0; bristle < this.nBristles; bristle++) {
					// Check that the bristle position is inside the canvas
					x = Math.round(bristlesPositions[bristle].x);
					y = Math.round(bristlesPositions[bristle].y);

					if (x >= 0 && x < width && y >= 0 && y < height) {
						// Save the canvas color if it's not the background color
						loc = 3 * (bristle + step * this.nBristles);
						imgPixel = 4 * (x + y * width);
						canvasPixel = 4 * (x + y * p.width);
						rCanvas = p.pixels[canvasPixel];
						gCanvas = p.pixels[canvasPixel + 1];
						bCanvas = p.pixels[canvasPixel + 2];

						if (rCanvas !== rBg && gCanvas !== gBg && bCanvas !== bBg) {
							this.colors[loc] = rCanvas;
							this.colors[loc + 1] = gCanvas;
							this.colors[loc + 2] = bCanvas;
						} else {
							this.colors[loc] = -1;
						}

						// Save the original image color
						rOriginal = originalImg.pixels[imgPixel];
						gOriginal = originalImg.pixels[imgPixel + 1];
						bOriginal = originalImg.pixels[imgPixel + 2];
						originalColors[loc] = rOriginal;
						originalColors[loc + 1] = gOriginal;
						originalColors[loc + 2] = bOriginal;

						// Add the original image color to the average if alpha is high
						if (highAlpha) {
							rAverage += rOriginal;
							gAverage += gOriginal;
							bAverage += bOriginal;

							// Increment the counters
							insideCounter++;

							if (similarColor[imgPixel / 4]) {
								similarColorBool[loc / 3] = true;
								similarColorCounter++;
							}
						}
					} else {
						loc = 3 * (bristle + step * this.nBristles);
						originalColors[loc] = -1;
						this.colors[loc] = -1;

						if (highAlpha) {
							outsideCounter++;
						}
					}
				}
			} else {
				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					originalColors[loc] = -1;
					this.colors[loc] = -1;
				}
			}
		}

		if (insideCounter > 0) {
			rAverage /= insideCounter;
			gAverage /= insideCounter;
			bAverage /= insideCounter;
		}

		// Update the screen pixels
		p.updatePixels();

		// Reset the brush
		this.brush.reset(this.positions[0]);

		// Check if the trace region was painted before with similar colors or falls outside the image
		wellPainted = similarColorCounter >= this.maxSimilarColorFraction * insideCounter;
		outsideCanvas = outsideCounter >= this.maxOutsideFraction * (insideCounter + outsideCounter);

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
					// Check that the bristle position is inside the canvas (it should have an original image color)
					loc = 3 * (bristle + step * this.nBristles);

					if (originalColors[loc] >= 0) {
						// Count the number of well painted pixels, and how many are not well painted anymore
						rOriginal = originalColors[loc];
						gOriginal = originalColors[loc + 1];
						bOriginal = originalColors[loc + 2];
						rDiff = Math.abs(rOriginal - rAverage);
						gDiff = Math.abs(gOriginal - gAverage);
						bDiff = Math.abs(bOriginal - bAverage);

						if (rDiff < maxColorDiff[0] && gDiff < maxColorDiff[1] && bDiff < maxColorDiff[2]) {
							wellPaintedCounter++;
						} else if (similarColorBool[loc / 3]) {
							destroyedWellPaintedCounter++;
						}

						// Count previously painted pixels and calculate their color improvement
						if (this.colors[loc] >= 0) {
							rCanvasDiff = Math.abs(rOriginal - this.colors[loc]);
							gCanvasDiff = Math.abs(gOriginal - this.colors[loc + 1]);
							bCanvasDiff = Math.abs(bOriginal - this.colors[loc + 2]);
							colorImprovement += rCanvasDiff - rDiff + gCanvasDiff - gDiff + bCanvasDiff - bDiff;
							alreadyPaintedCounter++;
						}
					}
				}
			}
		}

		wellPaintedImprovement = wellPaintedCounter - similarColorCounter;
		previousBadPainted = insideCounter - similarColorCounter;

		alreadyPainted = alreadyPaintedCounter >= this.minPaintedFraction * insideCounter;
		colorImproves = colorImprovement >= this.minColorImprovementFactor * alreadyPaintedCounter;
		bigWellPaintedImprovement = wellPaintedImprovement >= this.bigWellPaintedImprovementFraction * insideCounter;
		reducedBadPainted = wellPaintedImprovement >= this.minBadPaintedReductionFraction * previousBadPainted;
		lowWellPaintedDestruction = destroyedWellPaintedCounter <= this.maxWellPaintedDestructionFraction
				* wellPaintedImprovement;
		improves = (colorImproves || bigWellPaintedImprovement) && reducedBadPainted && lowWellPaintedDestruction;

		if (alreadyPainted && !improves) {
			// Don't use this trace, we are not going to improve the painting
			return false;
		}

		// The trace is good enough for painting!
		// Set the first step bristle colors to the original image average color
		averageColor = p.color(rAverage, gAverage, bAverage);
		hueAverage = p.hue(averageColor);
		saturationAverage = p.saturation(averageColor);
		brightnessAverage = p.brightness(averageColor);
		noiseSeed = 1000 * Math.random();

		p.colorMode(p.HSB, 255);

		for (bristle = 0; bristle < this.nBristles; bristle++) {
			// Add some brightness changes to make it more realistic
			deltaBrightness = this.brightnessRelativeChange * brightnessAverage
					* (p.noise(noiseSeed + 0.4 * bristle) - 0.5);
			bristleColor = p.color(hueAverage, saturationAverage, p.constrain(brightnessAverage + deltaBrightness, 0,
					255));

			loc = 3 * bristle;
			this.colors[loc] = p.red(bristleColor);
			this.colors[loc + 1] = p.green(bristleColor);
			this.colors[loc + 2] = p.blue(bristleColor);
		}

		p.colorMode(p.RGB, 255);

		// Extend the colors to the step where the mixing starts
		for (step = 1; step < this.mixStartingStep; step++) {
			for (bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				locPrev = loc - 3 * this.nBristles;
				this.colors[loc] = this.colors[locPrev];
				this.colors[loc + 1] = this.colors[locPrev + 1];
				this.colors[loc + 2] = this.colors[locPrev + 2];
			}
		}

		// Mix the previous step colors with the canvas colors
		for (step = this.mixStartingStep; step < this.nSteps; step++) {
			for (bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				locPrev = loc - 3 * this.nBristles;
				f = 1 - this.mixStrength;

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
		}

		return true;
	};

	//
	// Draws the trace on the canvas
	//
	Trace.prototype.paint = function(visitedPixels, width, height) {
		// Check that the trace colors have been initialized
		if (this.colors.length > 0) {
			// Paint the brush step by step
			var width, height, bristlesColors, alpha, step, bristle, loc, bristlesPositions, x, y;
			bristlesColors = [];

			for (step = 0; step < this.nSteps; step++) {
				// Calculate the bristles colors
				alpha = this.alphas[step];

				for (bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2],
							alpha);
				}

				// Update the brush position and paint it
				this.brush.update(this.positions[step], true);
				this.brush.paint(bristlesColors, alpha);

				// Fill the visitCounts array if alpha is high enough
				if (alpha > this.minAlpha) {
					bristlesPositions = this.brush.getBristlesPositions();

					if (typeof bristlesPositions !== "undefined") {
						for (bristle = 0; bristle < this.nBristles; bristle++) {
							x = Math.round(bristlesPositions[bristle].x);
							y = Math.round(bristlesPositions[bristle].y);

							if (x >= 0 && x < width && y >= 0 && y < height) {
								visitedPixels[x + y * width] = true;
							}
						}
					}
				}
			}

			// Reset the brush
			this.brush.reset(this.positions[0]);
		}
	};

	//
	// Draws the brush on the canvas for a given trace step
	//
	Trace.prototype.paintByStep = function(step, visitedPixels, width, height) {
		// Check that the trace colors have been initialized
		if (this.colors.length > 0) {
			// Calculate the bristles colors
			var bristlesColors, alpha, bristle, loc, bristlesPositions, width, height, x, y;
			bristlesColors = [];
			alpha = this.alphas[step];

			for (bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2], alpha);
			}

			// Update the brush position and paint it
			this.brush.update(this.positions[step], true);
			this.brush.paint(bristlesColors, alpha);

			// Fill the visitCounts array if alpha is high enough
			if (alpha > this.minAlpha) {
				bristlesPositions = this.brush.getBristlesPositions();

				if (typeof bristlesPositions !== "undefined") {
					for (bristle = 0; bristle < this.nBristles; bristle++) {
						x = Math.round(bristlesPositions[bristle].x);
						y = Math.round(bristlesPositions[bristle].y);

						if (x >= 0 && x < width && y >= 0 && y < height) {
							visitedPixels[x + y * width] = true;
						}
					}
				}
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
