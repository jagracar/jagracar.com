var twoVerticalAxesSketch = function(p) {
	// Global variables
	var plot1 = undefined;
	var plot2 = undefined;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight;
		var points, i;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 500;
		canvasHeight = 350;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		p.createCanvas(canvasWidth, canvasHeight);

		// Create the first plot
		plot1 = new GPlot(p);
		plot1.setPos(0, 0);
		plot1.setMar(60, 70, 40, 70);
		plot1.setOuterDim(p.width, p.height);
		plot1.setAxesOffset(4);
		plot1.setTicksLength(4);

		// Create the second plot with the same dimensions
		plot2 = new GPlot(p);
		plot2.setPos(plot1.getPos());
		plot2.setMar(plot1.getMar());
		plot2.setDim(plot1.getDim());
		plot2.setAxesOffset(4);
		plot2.setTicksLength(4);

		// Prepare the points
		points = [];

		for (i = 0; i < 50; i++) {
			points[i] = new GPoint(i, 30 + 10 * p.noise(i * 0.1));
		}

		// Set the points, the title and the axis labels
		plot1.setPoints(points);
		plot1.setTitleText("Temperature");
		plot1.getYAxis().setAxisLabelText("T (Celsius)");
		plot1.getXAxis().setAxisLabelText("Time (minutes)");

		plot2.getRightAxis().setAxisLabelText("T (Kelvin)");

		// Make the right axis of the second plot visible
		plot2.getRightAxis().setDrawTickLabels(true);

		// Activate the panning (only for the first plot)
		plot1.activatePanning();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(255);

		// Draw the plot
		plot1.beginDraw();
		plot1.drawBox();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTitle();
		plot1.drawPoints();
		plot1.drawLines();
		plot1.endDraw();

		// Change the second plot vertical scale from Celsius to Kelvin
		plot2.setYLim(celsiusToKelvin(plot1.getYLim()));

		// Draw only the right axis
		plot2.beginDraw();
		plot2.drawRightAxis();
		plot2.endDraw();
	};

	//
	// Transforms from degree Celsius to degree Kelvin
	//
	function celsiusToKelvin(celsius) {
		var kelvin = [];

		for (var i = 0; i < celsius.length; i++) {
			kelvin[i] = 273.15 + celsius[i];
		}

		return kelvin;
	}

};
