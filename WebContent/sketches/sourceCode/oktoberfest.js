var oktoberfestSketch = function(p) {
	// Global variables
	var table, plot;
	var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September",
			"October", "November", "December" ];
	var daysPerMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	var daysPerMonthLeapYear = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

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
		// Load the Oktoberfest vs. Bundestagswahl (German elections day) Google
		// search history file (obtained from the Google trends page).
		// The csv file has the following format:
		// year,month,day,oktoberfest,bundestagswahl
		// 2004,0,1,5,1
		// ...
		table = p.loadTable("data/OktoberfestVSGermanElections.csv", "header");
	};

	// Initial setup
	p.setup = function() {
		var pointsOktoberfest, pointsElections, row, data, year, month, day, date;
		var oktoberfestCount, electionsCount;

		// Add the canvas element
		addCanvas(800, 500);

		// Save the table data in two arrays
		pointsOktoberfest = [];
		pointsElections = [];

		for (row = 0; row < table.getRowCount(); row++) {
			data = table.getRow(row);

			// Check that the row contains valid data
			if (data.get("year") !== "undefined") {
				year = data.getNum("year");
				month = data.getNum("month");
				day = data.getNum("day");
				date = getExactDate(year, month, day);
				oktoberfestCount = data.getNum("oktoberfest");
				electionsCount = data.getNum("bundestagswahl");

				pointsOktoberfest[row] = new GPoint(date, oktoberfestCount, monthNames[month]);
				pointsElections[row] = new GPoint(date, electionsCount, monthNames[month]);
			}
		}

		// Create the plot
		plot = new GPlot(p);
		plot.setOuterDim(p.width, p.height);
		plot.setTitleText("Oktoberfest vs. Bundestagwahl Google search history");
		plot.getXAxis().setAxisLabelText("Year");
		plot.getYAxis().setAxisLabelText("Google normalized searches");
		plot.getXAxis().setNTicks(10);
		plot.setPoints(pointsOktoberfest);
		plot.setLineColor(p.color(100, 100, 100));
		plot.addLayer("German elections day", pointsElections);
		plot.getLayer("German elections day").setLineColor(p.color(255, 100, 255));
		plot.activatePointLabels();
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
		plot.drawGridLines(GPlot.VERTICAL);
		plot.drawFilledContours(GPlot.HORIZONTAL, 0);
		plot.drawLegend([ "Oktoberfest", "Bundestagswahl" ], [ 0.07, 0.30 ], [ 0.92, 0.92 ]);
		plot.drawLabels();
		plot.endDraw();
	};

	function getExactDate(year, month, day) {
		var leapYear = false;

		if (year % 400 == 0) {
			leapYear = true;
		} else if (year % 100 == 0) {
			leapYear = false;
		} else if (year % 4 == 0) {
			leapYear = true;
		}

		if (leapYear) {
			return year + (month + (day - 1) / daysPerMonthLeapYear[month]) / 12;
		} else {
			return year + (month + (day - 1) / daysPerMonth[month]) / 12;
		}
	}

};
