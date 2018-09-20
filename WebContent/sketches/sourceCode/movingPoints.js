var movingPointsSketch = function(p) {
	// Global variables
	var plot;
	var step = 0;
	var stepsPerCycle = 100;
	var lastStepTime = 0;
	var clockwise = true;
	var scale = 5;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight;
		var nPoints1, points1, nPoints2, points2, i;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 450;
		canvasHeight = canvasWidth;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		p.createCanvas(canvasWidth, canvasHeight);

		// Prepare the first set of points
		nPoints1 = stepsPerCycle / 10;
		points1 = [];

		for (i = 0; i < nPoints1; i++) {
			points1[i] = calculatePoint(step, stepsPerCycle, scale);
			step = (clockwise) ? step + 1 : step - 1;
		}

		lastStepTime = p.millis();

		// Prepare the second set of points
		nPoints2 = stepsPerCycle + 1;
		points2 = [];

		for (i = 0; i < nPoints2; i++) {
			points2[i] = calculatePoint(i, stepsPerCycle, 0.9 * scale);
		}

		// Create the plot
		plot = new GPlot(p);
		plot.setPos(0, 0);
		plot.setOuterDim(p.width, p.height);
		plot.preventWheelDefault();
		plot.preventRightClickDefault();

		// Set the plot limits (this will fix them)
		plot.setXLim(-1.2 * scale, 1.2 * scale);
		plot.setYLim(-1.2 * scale, 1.2 * scale);

		// Set the plot title and the axis labels
		plot.setTitleText("Clockwise movement");
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");

		// Activate the panning effect
		plot.activatePanning();

		// Add the two sets of points to the plot
		plot.setPoints(points1);
		plot.addLayer("surface", points2);

		// Change the second layer line color
		plot.getLayer("surface").setLineColor(p.color(100, 255, 100));
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(255);

		// Draw the plot
		plot.beginDraw();
		plot.drawBackground();
		plot.drawBox();
		plot.drawXAxis();
		plot.drawYAxis();
		plot.drawTopAxis();
		plot.drawRightAxis();
		plot.drawTitle();
		plot.getMainLayer().drawPoints();
		plot.getLayer("surface").drawFilledContour(GPlot.HORIZONTAL, 0);
		plot.endDraw();

		// Add and remove new points every 10th of a second
		if (p.millis() - lastStepTime > 100) {
			if (clockwise) {
				// Add the point at the end of the array
				plot.addPoint(calculatePoint(step, stepsPerCycle, scale));
				step++;

				// Remove the first point
				plot.removePoint(0);
			} else {
				// Add the point at the beginning of the array
				plot.addPointAtIndexPos(0, calculatePoint(step, stepsPerCycle, scale));
				step--;

				// Remove the last point
				plot.removePoint(plot.getPointsRef().length - 1);
			}

			lastStepTime = p.millis();
		}
	};

	p.mouseClicked = function() {
		if (plot.isOverBox(p.mouseX, p.mouseY)) {
			// Change the movement sense
			clockwise = !clockwise;

			if (clockwise) {
				step += plot.getPointsRef().length + 1;
				plot.setTitleText("Clockwise movement");
			} else {
				step -= plot.getPointsRef().length + 1;
				plot.setTitleText("Anti-clockwise movement");
			}
		}
	};

	function calculatePoint(i, n, rad) {
		var delta = 0.1 * p.cos(p.TWO_PI * 10 * i / n);
		var ang = p.TWO_PI * i / n;
		return new GPoint(rad * (1 + delta) * p.sin(ang), rad * (1 + delta) * p.cos(ang));
	}

};
