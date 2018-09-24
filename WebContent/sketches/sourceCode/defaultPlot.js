var defaultPlotSketch = function(p) {

	// Creates and adds the canvas element
	function addCanvas(canvasWidth, canvasHeight) {
		var referenceElement, maxCanvasWidth, canvas;

		// Calculate the canvas dimensions
		referenceElement = document.getElementById("widthRef");
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = maxCanvasWidth * canvasHeight / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Resize the canvas if necessary
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			p.resizeCanvas(maxCanvasWidth, maxCanvasWidth * canvasHeight / canvasWidth, true);
		}

		return canvas;
	}

	// Initial setup
	p.setup = function() {
		var points, seed, plot, i;

		// Add the canvas element
		addCanvas(500, 350);

		// Prepare the points for the plot
		points = [];
		seed = 100 * p.random();

		for (i = 0; i < 100; i++) {
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
