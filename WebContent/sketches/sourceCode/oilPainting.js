//
// This sketch takes a picture as an input and simulates an oil paint.
// It has many optional parameters, but only some combinations of them
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
	var maxColorDiff = [40, 40, 40];
	// Compare the oil paint with the original picture
	var comparisonMode = false;
	// Show additional debug images
	var debugMode = false;
	// Draw the traces step by step, or in one go
	var drawStepByStep = true;
	// The smaller brush size allowed
	var smallerBrushSize = 4;
	// The brush size decrement ratio
	var brushSizeDecrement = 1.3;
	// The maximum bristle length
	var maxBristleLength = 12;
	// The maximum bristle thickness
	var maxBristleThickness = 10;
	// The maximum number of invalid traces allowed before the brush size is reduced
	var maxInvalidTraces = 250;
	// The maximum number of invalid traces allowed for the smaller brush size before the painting is stopped
	var maxInvalidTracesForSmallerSize = 350;
	// The trace speed
	var traceSpeed = 2;
	// The typical trace length, relative to the brush size
	var relativeTraceLength = 2.3;
	// The minimum trace length allowed
	var minTraceLength = 8;
	// The average color calculation will consider only trace steps with alpha higher than this value
	var minAlpha = 20;

	// Global variables
	var originalImg;
	var imgWidth;
	var imgHeight;
	var canvas;
	var similarColor;
	var visitedPixels;
	var similarColorImg;
	var visitedPixelsImg;
	var brushSize;
	var startTime;
	var frameCountStart;
	var invalidTracesCounter;
	var nTraces;
	var newTrace;
	var paint;
	var nSteps;
	var step;
	var trace;

	// Load the image before the sketch is run
	p.preload = function() {
		originalImg = p.loadImage("img/" + pictureFile);
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, nPixels, pixel, imgPixel;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (originalImg.width > maxCanvasWidth) {
			originalImg.resize(maxCanvasWidth, originalImg.height * maxCanvasWidth / originalImg.width);
		}

		// Load the original image pixels. They will be available all the time
		originalImg.loadPixels();
		imgWidth = originalImg.width;
		imgHeight = originalImg.height;
		nPixels = imgWidth * imgHeight;

		// Create the canvas buffer and the similarColor and visitedPixels arrays
		canvas = p.createGraphics(imgWidth, imgHeight);
		similarColor = [];
		visitedPixels = [];

		for ( pixel = 0; pixel < nPixels; pixel++) {
			similarColor[pixel] = false;
			visitedPixels[pixel] = false;
		}

		// Create the similarColor and visitedPixels images if we are in debug mode
		if (debugMode) {
			similarColorImg = p.createImage(imgWidth, imgHeight);
			visitedPixelsImg = p.createImage(imgWidth, imgHeight);

			// Remove the images transparencies
			similarColorImg.loadPixels();
			visitedPixelsImg.loadPixels();

			for ( pixel = 0; pixel < nPixels; pixel++) {
				imgPixel = 4 * pixel;
				similarColorImg.pixels[imgPixel + 3] = 255;
				visitedPixelsImg.pixels[imgPixel + 3] = 255;
			}

			similarColorImg.updatePixels();
			visitedPixelsImg.updatePixels();
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
		p.background(p.color(255, 255, 255, 0));
		p.strokeCap(p.SQUARE);

		// Canvas buffer setup
		canvas.background(p.color(255, 255, 255, 0));
		canvas.strokeCap(p.SQUARE);

		// Initialize some of the sketch variables
		startTime = p.millis();
		frameCountStart = p.frameCount;
		invalidTracesCounter = 0;
		nTraces = 0;
		newTrace = true;
		paint = true;

		// Set the initial brush size
		brushSize = Math.max(smallerBrushSize, Math.sqrt(imgWidth * imgHeight) / 6);
	};

	// Execute the sketch
	p.draw = function() {
		var nPixels, pixel, validTrajectory;
		var initPosition, bSize, nBristles, bristleLength, bristleThickness, brush, i;

		// Create a new trace or paint the current one
		if (newTrace) {
			// Check if we should stop painting
			if (brushSize === smallerBrushSize && invalidTracesCounter > maxInvalidTracesForSmallerSize) {
				console.log("Total number of painted traces: " + nTraces);
				console.log("Average frame rate = " + Math.round((p.frameCount - frameCountStart) * 1000.0 / (p.millis() - startTime)));

				// Stop painting traces
				newTrace = false;
				paint = false;

				// Stop the sketch
				p.noLoop();
			} else {
				// Change the brush size if there were too many invalid traces
				if (brushSize > smallerBrushSize && invalidTracesCounter > maxInvalidTraces) {
					brushSize = Math.max(smallerBrushSize, Math.min(brushSize / brushSizeDecrement, brushSize - 2));
					console.log("Frame = " + p.frameCount + ", traces = " + nTraces + ", new brush size = " + brushSize);
					console.log("Average frame rate = " + Math.round((p.frameCount - frameCountStart) * 1000.0 / (p.millis() - startTime)));
					console.log("");

					// Reset some of the sketch variables
					startTime = p.millis();
					frameCountStart = p.frameCount;
					invalidTracesCounter = 0;

					// Reset the visited pixels array
					visitedPixels = [];
					nPixels = imgWidth * imgHeight;

					for ( pixel = 0; pixel < nPixels; pixel++) {
						visitedPixels[pixel] = 0;
					}
				}

				// Create new traces until one of them has a valid trajectory
				validTrajectory = false;

				while (!validTrajectory) {
					// Create the trace
					initPosition = p.createVector(imgWidth * Math.random(), imgHeight * Math.random());
					bSize = Math.max(smallerBrushSize, (0.95 + 0.1 * Math.random()) * brushSize);
					nSteps = Math.max(minTraceLength, Math.round(relativeTraceLength * bSize / traceSpeed));
					trace = new Trace(initPosition, nSteps, traceSpeed, minAlpha);

					// Check if the trajectory is valid
					validTrajectory = trace.hasValidTrajectory(similarColor, visitedPixels, imgWidth, imgHeight);
				}

				// Create the Brush
				nBristles = Math.round(bSize * p.random(0.7, 1.0));
				bristleLength = Math.min(2 * bSize, maxBristleLength);
				bristleThickness = Math.min(0.8 * bSize, maxBristleThickness);
				brush = new Brush(initPosition, bSize, nBristles, bristleLength, bristleThickness);

				// Add the brush to the trace
				trace.setBrush(brush);

				// Calculate the trace colors and check that painting the trace will improve the painting
				if (trace.calculateColors(maxColorDiff, similarColor, originalImg, canvas)) {
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
				for ( i = 0; i < 2; i++) {
					trace.paintByStep(step, canvas, visitedPixels);
					step++;

					if (step === nSteps) {
						newTrace = true;
						break;
					}
				}
			} else {
				trace.paint(canvas, visitedPixels);
				newTrace = true;
			}

			// Check if we finished to paint the trace
			if (newTrace) {
				// Populate the similarColor array
				populateSimilarColor(maxColorDiff, minAlpha, similarColor, originalImg, canvas);

				// Update the debug images
				if (debugMode) {
					updateDebugImages(similarColorImg, visitedPixelsImg, similarColor, visitedPixels);
				}
			}

			// Draw the additional images if necessary
			if (comparisonMode) {
				p.image(originalImg, imgWidth, 0);
			} else if (debugMode) {
				p.image(visitedPixelsImg, imgWidth, 0);
				p.image(similarColorImg, 2 * imgWidth, 0);
			}
		}
	};

	//
	// Populates the similarColor boolean array. The array elements will be true
	// when the canvas is painted with a color similar to the original image.
	//
	function populateSimilarColor(maxColorDiff, minAlpha, similarColor, originalImg, canvas) {
		var canvasImg, nPixels, pixel, imgPixel, rDiff, gDiff, bDiff;

		// Prepare the canvas image
		canvasImg = canvas.get();
		canvasImg.loadPixels();

		// Populate the similarColor array
		nPixels = canvasImg.width * canvasImg.height;

		for ( pixel = 0; pixel < nPixels; pixel++) {
			imgPixel = 4 * pixel;

			// Check if the pixel has been painted before
			if (canvasImg.pixels[imgPixel + 3] >= minAlpha) {
				// Check if the pixel color in the canvas is similar to the original image color
				rDiff = Math.abs(originalImg.pixels[imgPixel] - canvasImg.pixels[imgPixel]);
				gDiff = Math.abs(originalImg.pixels[imgPixel + 1] - canvasImg.pixels[imgPixel + 1]);
				bDiff = Math.abs(originalImg.pixels[imgPixel + 2] - canvasImg.pixels[imgPixel + 2]);
				similarColor[pixel] = (rDiff < maxColorDiff[0]) && (gDiff < maxColorDiff[1]) && (bDiff < maxColorDiff[2]);
			} else {
				similarColor[pixel] = false;
			}
		}

		canvasImg.updatePixels();
	}

	//
	// Updates the visitidePixels and similarColor debug images
	//
	function updateDebugImages(similarColorImg, visitedPixelsImg, similarColor, visitedPixels) {
		var nPixels, pixel, imgPixel;

		// Prepare the images
		similarColorImg.loadPixels();
		visitedPixelsImg.loadPixels();

		// Update the images
		nPixels = similarColorImg.width * similarColorImg.height;

		for ( pixel = 0; pixel < nPixels; pixel++) {
			imgPixel = 4 * pixel;
			similarColorImg.pixels[imgPixel] = similarColor[pixel] ? 255 : 0;
			visitedPixelsImg.pixels[imgPixel] = visitedPixels[pixel] ? 255 : 0;
		}

		similarColorImg.updatePixels();
		visitedPixelsImg.updatePixels();
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

		for ( i = 0; i < this.nPositions; i++) {
			this.positions[i] = p.createVector(0, 0);
			this.lengths[i] = Math.max(1, initLength - i * deltaLength);
			this.thicknesses[i] = Math.max(0.1, initThickness - i * deltaThickness);
		}
	}

	//
	// Sets all the bristle elements to a given position
	//
	Bristle.prototype.init = function(newPosition) {
		var i, pos;

		for ( i = 0; i < this.nPositions; i++) {
			pos = this.positions[i];
			pos.x = newPosition.x;
			pos.y = newPosition.y;
		}
	};

	//
	// Updates the position of the bristle elements
	//
	Bristle.prototype.update = function(newPosition) {
		var i, pos, previousPos, ang, length;

		// Set the first position to the provided position
		pos = this.positions[0];
		pos.x = newPosition.x;
		pos.y = newPosition.y;
		previousPos = pos;

		// Update the other positions
		for ( i = 1; i < this.nPositions; i++) {
			pos = this.positions[i];
			length = this.lengths[i];
			ang = p.atan2(previousPos.y - pos.y, previousPos.x - pos.x);
			pos.x = previousPos.x - length * Math.cos(ang);
			pos.y = previousPos.y - length * Math.sin(ang);
			previousPos = pos;
		}
	};

	//
	// Draws the bristle on the screen and the canvas
	//
	Bristle.prototype.paint = function(col, canvas, paintCanvas) {
		var i, pos, previousPos;

		// Set the stroke color
		p.stroke(col);

		if (paintCanvas) {
			canvas.stroke(col);
		}

		// Paint the bristle elements
		previousPos = this.positions[0];

		for ( i = 1; i < this.nPositions; i++) {
			pos = this.positions[i];
			p.strokeWeight(this.thicknesses[i]);
			p.line(previousPos.x, previousPos.y, pos.x, pos.y);

			if (paintCanvas) {
				canvas.strokeWeight(this.thicknesses[i]);
				canvas.line(previousPos.x, previousPos.y, pos.x, pos.y);
			}

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
		this.directionAng = p.TWO_PI * p.random();
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
		var nParts, initLength, deltaLength, initThickness, deltaThickness, bristle, xOffset, yOffset;
		nParts = Math.max(3, Math.round(Math.sqrt(2 * bristleLength)));
		initLength = nParts;
		deltaLength = 1;
		initThickness = bristleThickness;
		deltaThickness = initThickness / nParts;

		for ( bristle = 0; bristle < this.nBristles; bristle++) {
			this.bristles[bristle] = new Bristle(nParts, initLength, deltaLength, initThickness, deltaThickness);
			this.bOffsets[bristle] = p.createVector(size * (Math.random() - 0.5), this.bristleVerticalNoise * (Math.random() - 0.5));
			this.bPositions[bristle] = p.createVector(0, 0);
		}
	}

	//
	// Reset the brush to its initial state
	//
	Brush.prototype.reset = function(initPosition) {
		this.position.x = initPosition.x;
		this.position.y = initPosition.y;
		this.directionAng = 0;
		this.positionsHistory = [];
		this.averagePosition.x = this.position.x;
		this.averagePosition.y = this.position.y;
		this.updatesCounter = 0;
	};

	//
	// Update the brush properties (position, direction, etc)
	//
	Brush.prototype.update = function(newPosition, updateBristles) {
		var xAverage, yAverage, historyLength, i, pos, bristle;

		// Add the new position to the positions history
		this.positionsHistory[Math.floor(this.updatesCounter % this.positionsForAverage)] = newPosition;

		// Calculate the new average position
		xAverage = 0;
		yAverage = 0;
		historyLength = this.positionsHistory.length;

		for ( i = 0; i < historyLength; i++) {
			pos = this.positionsHistory[i];
			xAverage += pos.x;
			yAverage += pos.y;
		}

		xAverage /= historyLength;
		yAverage /= historyLength;

		// Calculate the new direction angle
		this.directionAng = p.HALF_PI + p.atan2(yAverage - this.averagePosition.y, xAverage - this.averagePosition.x);

		// Update the position and the average position
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
		this.averagePosition.x = xAverage;
		this.averagePosition.y = yAverage;

		// Update the bristles positions
		this.updateBristlePositions();

		// Update the bristles to their new positions
		if (updateBristles) {
			if (historyLength < this.positionsForAverage) {
				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].init(this.bPositions[bristle]);
				}
			} else {
				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					this.bristles[bristle].update(this.bPositions[bristle]);
				}
			}
		}

		// Increment the updates counter
		this.updatesCounter++;
	};

	//
	// Update the bristle positions array
	//
	Brush.prototype.updateBristlePositions = function() {
		var cos, sin, noisePos, bristle, bPos, bOffset, x, y;

		// This saves some calculations
		cos = Math.cos(this.directionAng);
		sin = Math.sin(this.directionAng);
		noisePos = this.noiseSeed + this.noiseSpeedFactor * this.updatesCounter;

		for ( bristle = 0; bristle < this.nBristles; bristle++) {
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
	// Draws the brush on the screen and the canvas using the provided bristle colors
	//
	Brush.prototype.paint = function(colors, alpha, minAlpha, canvas) {
		if (this.positionsHistory.length === this.positionsForAverage && alpha > 0) {
			for (var bristle = 0; bristle < this.nBristles; bristle++) {
				this.bristles[bristle].paint(colors[bristle], canvas, alpha > minAlpha);
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
	function Trace(position, nSteps, speed, minAlpha) {
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
		// The minimum improvement fraction in the number of well painted pixels to consider to paint the trace
		// even if there is not a significant color improvement
		this.bigWellPaintedImprovementFraction = 0.35;
		// The minimum reduction fraction in the number of bad painted pixels required to paint the trace on the canvas
		this.minBadPaintedReductionFraction = 0.3;
		// The maximum allowed fraction of pixels in the trace that were previously well painted and will be now bad painted
		this.maxWellPaintedDestructionFraction = 0.55;
		// The brightness relative change range between the bristles
		this.brightnessRelativeChange = 0.09;
		// The step when the color mixing starts
		this.mixStartingStep = 5;
		// The color mixing strength
		this.mixStrength = 0.015;

		this.nSteps = Math.max(1, nSteps);
		this.positions = [];
		this.alphas = [];
		this.colors = [];
		this.brush = undefined;
		this.nBristles = 0;
		this.minAlpha = minAlpha;

		// A sanity check
		this.mixStartingStep = Math.min(this.mixStartingStep, this.nSteps);

		// Fill the arrays
		var initAng, noiseSeed, pos, alphaDecrement, alpha, step, ang;
		initAng = p.TWO_PI * Math.random();
		noiseSeed = 1000 * Math.random();
		pos = position;
		alphaDecrement = Math.max(1, Math.min(255 / this.nSteps, 25));
		alpha = 255 + alphaDecrement;

		for ( step = 0; step < this.nSteps; step++) {
			ang = initAng + p.TWO_PI * (p.noise(noiseSeed + this.noiseFactor * step) - 0.5);
			pos = p.createVector(pos.x + speed * Math.cos(ang), pos.y + speed * Math.sin(ang));
			alpha = Math.max(0, alpha - alphaDecrement);
			this.positions[step] = pos;
			this.alphas[step] = alpha;
		}
	}

	//
	// Checks if the trace trajectory is valid. To be valid it should fall on a region
	// that was not painted correctly before, the fraction of visited pixels in the
	// trace trajectory should be small, and it should not fall most of the time outside
	// the canvas.
	//
	Trace.prototype.hasValidTrajectory = function(similarColor, visitedPixels, width, height) {
		var similarColorCounter, visitedPixelsCounter, outsideCounter, step, pos, x, y, pixel;
		var badPainted, notVisited, insideCanvas;
		similarColorCounter = 0;
		visitedPixelsCounter = 0;
		outsideCounter = 0;

		for ( step = 0; step < this.nSteps; step++) {
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
	// Calculates the trace colors. Returns false if the region covered by the trace
	// was already painted with similar colors, most of the trace is outside the canvas,
	// or drawing the trace will not improve considerably the painting.
	//
	Trace.prototype.calculateColors = function(maxColorDiff, similarColor, originalImg, canvas) {
		var canvasImg, width, height, rAverage, gAverage, bAverage, rOriginal, gOriginal, bOriginal;
		var highAlpha, insideCounter, outsideCounter, similarColorCounter, similarColorBool, originalColors;
		var step, bristle, bristlesPositions, x, y, loc, imgPixel, wellPainted, outsideCanvas;
		var wellPaintedCounter, destroyedWellPaintedCounter, alreadyPaintedCounter, colorImprovement;
		var rDiff, gDiff, bDiff, rCanvasDiff, gCanvasDiff, bCanvasDiff;
		var wellPaintedImprovement, previousBadPainted, alreadyPainted, colorImproves;
		var bigWellPaintedImprovement, reducedBadPainted, lowWellPaintedDestruction, improves;
		var averageColor, hueAverage, saturationAverage, brightnessAverage, deltaBrightness, bristleColor;
		var noiseSeed, locPrev;

		// Load the canvas image pixels
		canvasImg = canvas.get();
		canvasImg.loadPixels();
		width = canvasImg.width;
		height = canvasImg.height;

		// Calculate the trace average color and obtain some trace statistics
		rAverage = 0;
		gAverage = 0;
		bAverage = 0;
		insideCounter = 0;
		outsideCounter = 0;
		similarColorCounter = 0;
		similarColorBool = [];
		originalColors = [];

		for ( step = 0; step < this.nSteps; step++) {
			// Move the brush and get the bristles positions
			this.brush.update(this.positions[step], false);
			bristlesPositions = this.brush.getBristlesPositions();

			if ( typeof bristlesPositions !== "undefined") {
				// Check if the alpha value is high enough
				highAlpha = this.alphas[step] > this.minAlpha;

				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					// Check that the bristle position is inside the canvas
					x = Math.round(bristlesPositions[bristle].x);
					y = Math.round(bristlesPositions[bristle].y);

					if (x >= 0 && x < width && y >= 0 && y < height) {
						// Save the original image color
						loc = 3 * (bristle + step * this.nBristles);
						imgPixel = 4 * (x + y * width);
						rOriginal = originalImg.pixels[imgPixel];
						gOriginal = originalImg.pixels[imgPixel + 1];
						bOriginal = originalImg.pixels[imgPixel + 2];
						originalColors[loc] = rOriginal;
						originalColors[loc + 1] = gOriginal;
						originalColors[loc + 2] = bOriginal;

						// Save the canvas color if the alpha is not zero
						if (canvasImg.pixels[imgPixel + 3] > 0) {
							this.colors[loc] = canvasImg.pixels[imgPixel];
							this.colors[loc + 1] = canvasImg.pixels[imgPixel + 1];
							this.colors[loc + 2] = canvasImg.pixels[imgPixel + 2];
						} else {
							this.colors[loc] = -1;
						}

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
				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					originalColors[loc] = -1;
					this.colors[loc] = -1;
				}
			}
		}

		canvasImg.updatePixels();

		if (insideCounter > 0) {
			rAverage /= insideCounter;
			gAverage /= insideCounter;
			bAverage /= insideCounter;
		}

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

		for ( step = 0; step < this.nSteps; step++) {
			// Check if the alpha value is high enough
			if (this.alphas[step] >= this.minAlpha) {
				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					// Check that the bristle position is inside the canvas
					// (it should have an original image color)
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
		lowWellPaintedDestruction = destroyedWellPaintedCounter <= this.maxWellPaintedDestructionFraction * wellPaintedImprovement;
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

		for ( bristle = 0; bristle < this.nBristles; bristle++) {
			// Add some brightness changes to make it more realistic
			deltaBrightness = this.brightnessRelativeChange * brightnessAverage * (p.noise(noiseSeed + 0.4 * bristle) - 0.5);
			bristleColor = p.color(hueAverage, saturationAverage, p.constrain(brightnessAverage + deltaBrightness, 0, 255));

			loc = 3 * bristle;
			this.colors[loc] = p.red(bristleColor);
			this.colors[loc + 1] = p.green(bristleColor);
			this.colors[loc + 2] = p.blue(bristleColor);
		}

		p.colorMode(p.RGB, 255);

		// Extend the colors to the step where the mixing starts
		for ( step = 1; step < this.mixStartingStep; step++) {
			for ( bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				locPrev = loc - 3 * this.nBristles;
				this.colors[loc] = this.colors[locPrev];
				this.colors[loc + 1] = this.colors[locPrev + 1];
				this.colors[loc + 2] = this.colors[locPrev + 2];
			}
		}

		// Mix the previous step colors with the canvas colors
		for ( step = this.mixStartingStep; step < this.nSteps; step++) {
			for ( bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				locPrev = loc - 3 * this.nBristles;

				// Check if there is a canvas color at that position
				if (this.colors[loc] >= 0) {
					// Mix the previous step color with the canvas color
					this.colors[loc] = (this.colors[locPrev] + this.mixStrength * this.colors[loc]) / (1 + this.mixStrength);
					this.colors[loc + 1] = (this.colors[locPrev + 1] + this.mixStrength * this.colors[loc + 1]) / (1 + this.mixStrength);
					this.colors[loc + 2] = (this.colors[locPrev + 2] + this.mixStrength * this.colors[loc + 2]) / (1 + this.mixStrength);
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
	Trace.prototype.paint = function(canvas, visitedPixels) {
		// Check that the trace colors have been initialized
		if (this.colors.length > 0) {
			// Paint the brush step by step
			var width, height, bristlesColors, alpha, step, bristle, loc, bristlesPositions, x, y;
			width = canvas.width;
			height = canvas.height;
			bristlesColors = [];

			for ( step = 0; step < this.nSteps; step++) {
				// Calculate the bristles colors
				alpha = this.alphas[step];

				for ( bristle = 0; bristle < this.nBristles; bristle++) {
					loc = 3 * (bristle + step * this.nBristles);
					bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2], alpha);
				}

				// Update the brush position and paint it
				this.brush.update(this.positions[step], true);
				this.brush.paint(bristlesColors, alpha, this.minAlpha, canvas);

				// Fill the visitCounts array if alpha is high enough
				if (alpha > this.minAlpha) {
					bristlesPositions = this.brush.getBristlesPositions();

					if ( typeof bristlesPositions !== "undefined") {
						for ( bristle = 0; bristle < this.nBristles; bristle++) {
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
	Trace.prototype.paintByStep = function(step, canvas, visitedPixels) {
		// Check that the trace colors have been initialized
		if (this.colors.length > 0) {
			// Calculate the bristles colors
			var bristlesColors, alpha, bristle, loc, bristlesPositions, width, height, x, y;
			bristlesColors = [];
			alpha = this.alphas[step];

			for ( bristle = 0; bristle < this.nBristles; bristle++) {
				loc = 3 * (bristle + step * this.nBristles);
				bristlesColors[bristle] = p.color(this.colors[loc], this.colors[loc + 1], this.colors[loc + 2], alpha);
			}

			// Update the brush position and paint it
			this.brush.update(this.positions[step], true);
			this.brush.paint(bristlesColors, alpha, this.minAlpha, canvas);

			// Fill the visitCounts array if alpha is high enough
			if (alpha > this.minAlpha) {
				bristlesPositions = this.brush.getBristlesPositions();

				if ( typeof bristlesPositions !== "undefined") {
					width = canvas.width;
					height = canvas.height;

					for ( bristle = 0; bristle < this.nBristles; bristle++) {
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
};
