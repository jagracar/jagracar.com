var leapFrogSketch = function(p) {
	// Global variables
	var img;
	var solarSystems = [];
	var stepsPerFrame = 10;
	var timeStep = 0.02;

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

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Alex Proimos
		// https://www.flickr.com/photos/proimos/7810727314
		img = p.loadImage("img/girl.jpg");
	};

	// Initial setup
	p.setup = function() {
		// Add the canvas element
		var canvas = addCanvas(img.width, img.height);

		// Resize the image if necessary
		if (img.width > p.width) {
			img.resize(p.width, p.height);
		}

		// Start a new drawing each time the mouse is pressed inside the canvas
		canvas.mousePressed(startNewDrawing);

		// Initialize the solar systems
		solarSystems = createSolarSystems(10);

		// Load the image pixels to be able to read them
		img.loadPixels();
	};

	// Execute the sketch
	p.draw = function() {
		// Do several steps per frame
		var step, i;

		for (step = 0; step < stepsPerFrame; step++) {
			for (i = 0; i < solarSystems.length; i++) {
				// Paint all the solar system
				solarSystems[i].paintPlanetsWithImg(img, 0.5);

				// Update the planets positions
				solarSystems[i].update(timeStep);
			}
		}
	};

	//
	// Creates a new set of solar systems
	//
	createSolarSystems = function(nSolarSystems) {
		var newSolarSystems, i, starPos, starMass, nPlanets;
		newSolarSystems = [];

		for (i = 0; i < nSolarSystems; i++) {
			starPos = p.createVector(p.random(0.3, 0.7) * p.width, p.random(0.3, 0.7) * p.height);
			starMass = p.random(0.5, 2) * 3000000;
			nPlanets = Math.round(p.random(5, 10));
			newSolarSystems[i] = new SolarSystem(starPos, starMass, nPlanets);
		}

		return newSolarSystems;
	};

	//
	// Starts a new drawing
	//
	startNewDrawing = function() {
		// Clean the screen
		p.background(255);

		// Create a new set of solar systems
		solarSystems = createSolarSystems(Math.round(p.random(8, 12)));
	};

	/*
	 * Simple solar system class. A solar system is composed of a single star and set of planets orbiting around it
	 */
	function SolarSystem(starPos, starMass, nPlanets) {
		this.star = new Star(starPos, starMass);
		this.planets = [];

		for (var i = 0; i < nPlanets; i++) {
			this.planets[i] = new Planet(this.star, p.random(80, 250), p.random(20, 100));
		}
	}

	//
	// Update the star and the planets coordinates
	//
	SolarSystem.prototype.update = function(dt) {
		this.star.update(dt);

		for (var i = 0; i < this.planets.length; i++) {
			this.planets[i].update(dt);
		}
	};

	//
	// Paint the star
	//
	SolarSystem.prototype.paintStar = function(color, diameter) {
		this.star.paint(color, diameter);
	};

	//
	// Paint the planets
	//
	SolarSystem.prototype.paintPlanets = function(color, diameter) {
		for (var i = 0; i < this.planets.length; i++) {
			this.planets[i].paint(color, diameter);
		}
	};

	//
	// Paint the planets taking the colors from an image
	//
	SolarSystem.prototype.paintPlanetsWithImg = function(img, diameter) {
		var i, planetPos, x, y, pixel, color;

		for (i = 0; i < this.planets.length; i++) {
			planetPos = this.planets[i].getPos();
			x = Math.round(planetPos.x);
			y = Math.round(planetPos.y);

			if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
				pixel = 4 * (x + y * img.width);
				color = p.color(img.pixels[pixel], img.pixels[pixel + 1], img.pixels[pixel + 2]);
				this.planets[i].paint(color, diameter);
			}
		}
	};

	/*
	 * The Star class
	 */
	function Star(pos, mass) {
		this.pos = pos.copy();
		this.mass = mass;
	}

	//
	// Update the star coordinates
	//
	Star.prototype.update = function(dt) {
		// Do nothing for this sketch
	};

	//
	// Paint the star
	//
	Star.prototype.paint = function(color, diameter) {
		p.push();
		p.noStroke();
		p.fill(color);
		p.translate(this.pos.x, this.pos.y);
		p.ellipse(0, 0, diameter, diameter);
		p.pop();
	};

	//
	// Returns the star position
	//
	Star.prototype.getPos = function() {
		return this.pos;
	};

	//
	// Returns the star mass
	//
	Star.prototype.getMass = function() {
		return this.mass;
	};

	/*
	 * Planet class. Planets rotate around stars
	 */
	function Planet(star, distance, speed) {
		this.star = star;

		// Calculate the planet position relative to the star
		var ang, starPos, gFactor;
		ang = p.random(2 * Math.PI);
		this.relPos = p.createVector(distance * Math.cos(ang), distance * Math.sin(ang));

		// Calculate the planet position, velocity and acceleration
		starPos = this.star.getPos();
		gFactor = -this.star.getMass() / Math.pow(distance, 3);
		this.pos = p.createVector(starPos.x + this.relPos.x, starPos.y + this.relPos.y);
		this.vel = p.createVector(speed * Math.sin(ang), -speed * Math.cos(ang));
		this.acc = p.createVector(gFactor * this.relPos.x, gFactor * this.relPos.y);
	}

	//
	// Update the planet coordinates using the leap-frog algorithm
	//
	Planet.prototype.update = function(dt) {
		var starPos, gFactor;

		// Advance the velocity half step
		this.vel.set(this.vel.x + this.acc.x * dt / 2, this.vel.y + this.acc.y * dt / 2);

		// Advance the position one step
		this.pos.set(this.pos.x + this.vel.x * dt, this.pos.y + this.vel.y * dt);

		// Recalculate the relative position
		starPos = this.star.getPos();
		this.relPos.set(this.pos.x - starPos.x, this.pos.y - starPos.y);

		// Recalculate the acceleration
		gFactor = -this.star.getMass() / Math.pow(this.relPos.mag(), 3);
		this.acc.set(gFactor * this.relPos.x, gFactor * this.relPos.y);

		// Advance the velocity another half step
		this.vel.set(this.vel.x + this.acc.x * dt / 2, this.vel.y + this.acc.y * dt / 2);
	};

	//
	// Paint the planet
	//
	Planet.prototype.paint = function(color, diameter) {
		p.push();
		p.noStroke();
		p.fill(color);
		p.translate(this.pos.x, this.pos.y);
		p.ellipse(0, 0, diameter, diameter);
		p.pop();
	};

	//
	// Return the planet position
	//
	Planet.prototype.getPos = function() {
		return this.pos;
	};
};
