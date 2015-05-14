var defaultPlotSketch = function(p) {
	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight, canvas;
		var points, seed, plot, i;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 500;
		canvasHeight = 350;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Prepare the points for the plot
		points = [];
		seed = 100 * p.random();

		for ( i = 0; i < 100; i++) {
			points[i] = new GPoint(i, 10 * p.noise(0.1 * i + seed));
		}

		// Create a new plot and set its position on the screen
		plot = new GPlot(p);
		plot.setPos(0, 0);
		plot.setOuterDim(p.width, p.height);

		// Add the points
		plot.setPoints(points);

		// Set the plot title and the axis labels
		plot.setTitleText("A very simple example");
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");

		// Draw it!
		plot.defaultDraw();

		p.noLoop();
	};
};
