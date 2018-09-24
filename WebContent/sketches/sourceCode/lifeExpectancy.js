var lifeExpectancySketch = function(p) {
	// Global variables
	var table, plot;

	// Creates and adds the canvas element
	function addCanvas(canvasWidth, canvasHeight) {
		var referenceElement, maxCanvasWidth;

		// Calculate the canvas dimensions
		referenceElement = document.getElementById("widthRef");
		maxCanvasWidth = Math.max(referenceElement.clientWidth - 1, 450);

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = maxCanvasWidth * canvasHeight / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		return p.createCanvas(canvasWidth, canvasHeight);
	}

	// Load the table before the sketch is run
	p.preload = function() {
		// Load the cvs dataset.
		// The file has the following format:
		// country,income,health,population
		// Central African Republic,599,53.8,4900274
		// ...
		table = p.loadTable("data/lifeExpectancyDataset.csv", "header");
	};

	// Initial setup
	p.setup = function() {
		var points, pointSizes, row, data, country, income, health, population, scaleFactor;

		// Add the canvas element
		addCanvas(750, 450);

		// Save the data in an array and calculate the point sizes
		points = [];
		pointSizes = [];

		for (row = 0; row < table.getRowCount(); row++) {
			data = table.getRow(row);

			// Check that the row contains valid data
			if (data.get("country") !== "undefined") {
				country = data.getString("country");
				income = data.getNum("income");
				health = data.getNum("health");
				population = data.getNum("population");
				points[row] = new GPoint(income, health, country);

				// The point area should be proportional to the country population
				// population = pi * sq(diameter/2)
				scaleFactor = p.width / 750;
				pointSizes[row] = 2 * Math.sqrt(population / (200000 * Math.PI)) * scaleFactor;
			}
		}

		// Create the plot
		plot = new GPlot(this);
		plot.setOuterDim(p.width, p.height);
		plot.setTitleText("Life expectancy connection to average income");
		plot.getXAxis().setAxisLabelText("Personal income ($/year)");
		plot.getYAxis().setAxisLabelText("Life expectancy (years)");
		plot.setLogScale("x");
		plot.setPoints(points);
		plot.setPointSizes(pointSizes);
		plot.activatePointLabels();
		plot.activatePanning();
		plot.activateZooming(1.1, p.CENTER, p.CENTER);
		plot.preventWheelDefault();
		plot.preventRightClickDefault();
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(255);

		// Draw the plot
		plot.beginDraw();
		plot.drawBox();
		plot.drawXAxis();
		plot.drawYAxis();
		plot.drawTitle();
		plot.drawGridLines(GPlot.BOTH);
		plot.drawPoints();
		plot.drawLabels();
		plot.endDraw();
	};

};
