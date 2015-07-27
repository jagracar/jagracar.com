function runSketch() {
	var scene = undefined;
	var renderer = undefined;
	var camera = undefined;
	var scan = undefined;
	var originalScan = undefined;
	var guiControlKeys = undefined;
	var p5Canvas = undefined;
	var p5Sketch = undefined;
	var time = 0;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight, controls;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 850;
		canvasHeight = 550;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Scene setup
		scene = new THREE.Scene();

		// Renderer setup
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(canvasWidth, canvasHeight);
		renderer.setClearColor(new THREE.Color(0.93, 0.93, 0.93));

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
		camera.position.set(0, 0, -600);

		// Initialize the camera controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Create the p5.js canvas for the animated masks
		p5Canvas = new p5().createGraphics(512, 512);

		// Read the default scan and add the scan mesh to the scene
		readScanAndAddMeshToScene(guiControlKeys["Scan name"]);
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		// Update the processing sketch
		if (p5Sketch) {
			p5Sketch.update();
			p5Sketch.paint();
		}

		// Update the scan mesh and point cloud uniforms used by the vertex and fragment shaders
		if (scan) {
			// Update the uniforms
			scan.updateUniforms(guiControlKeys["Back side color"], guiControlKeys["Show lines"],
					guiControlKeys["Point size"], guiControlKeys["Effect"], guiControlKeys["Invert effect"],
					guiControlKeys["Fill with color"], guiControlKeys["Transparency"], camera.position, time);

			// Advance the time
			time += guiControlKeys["Speed"];
		} else {
			time = 0;
		}

		// Render the scene
		renderer.render(scene, camera);
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, f1, f2, controller, i, hueElements;

		// Initialize the control keys
		guiControlKeys = {
			"Scan name" : "scan1",
			"Back side color" : [ 255, 255, 255 ],
			"Resolution" : 2,
			"Smoothness" : 1,
			"Fill holes" : 5,
			"Show lines" : false,
			"Show points" : false,
			"Point size" : 2,
			"Effect" : 0,
			"Invert effect" : false,
			"Fill with color" : true,
			"Transparency" : 0.3,
			"Speed" : 0.5,
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});

		// Add the GUI sections
		f1 = gui.addFolder("Scan configuration");
		f2 = gui.addFolder("Effect configuration");

		// Add the GUI controllers
		controller = f1.add(guiControlKeys, "Scan name", [ "scan1", "scan2", "scan3", "scan4", "chloe", "diego" ]);
		controller.onFinishChange(readScanAndAddMeshToScene);

		controller = f1.addColor(guiControlKeys, "Back side color");

		controller = f1.add(guiControlKeys, "Resolution", 1, 5).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Smoothness", 0, 4).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Fill holes", 0, 20).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Show lines");

		controller = f1.add(guiControlKeys, "Show points");
		controller.onFinishChange(function(value) {
			if (scan) {
				if (value) {
					// Remove the scan mesh from the scene
					scene.remove(scan.mesh);

					// Add the point cloud to the scene
					scene.add(scan.pointCloud);
				} else {
					// Remove the point cloud from the scene
					scene.remove(scan.pointCloud);

					// Add the scan mesh to the scene
					scene.add(scan.mesh);
				}
			}
		});

		controller = f1.add(guiControlKeys, "Point size", 1, 10);

		controller = f2.add(guiControlKeys, "Effect", {
			"None" : 0,
			"Pulsation" : 1,
			"Hole" : 2,
			"Circle" : 3,
			"Vertical cut" : 4,
			"Bouncing balls" : 5,
			"Traces" : 6,
			"Aggregation" : 7
		});
		controller.onFinishChange(function(value) {
			// Initialize the sketch if necessary
			if (value == 5) {
				p5Sketch = new BallsSketch(300, 30, p5Canvas, 0, 255, true);
			} else if (value == 6) {
				p5Sketch = new BallsSketch(50, 10, p5Canvas, 255, 0, false);
			} else if (value == 7) {
				p5Sketch = new DLASketch(p5Canvas, 255, 0, true);
			} else {
				p5Sketch = undefined;

				// Reset the time
				time = 0;
			}
		});

		controller = f2.add(guiControlKeys, "Invert effect");

		controller = f2.add(guiControlKeys, "Fill with color");

		controller = f2.add(guiControlKeys, "Transparency", 0, 1);

		controller = f2.add(guiControlKeys, "Speed", 0, 1);

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);

		// Fix a bug with the dat.GUI hue color selector
		hueElements = document.getElementsByClassName("hue-field");

		for (i = 0; i < hueElements.length; i++) {
			hueElements[i].style.width = "10px";
		}
	}

	/*
	 * Loads the scan from the server and adds the scan mesh to the scene
	 */
	function readScanAndAddMeshToScene(scanName) {
		var request = new XMLHttpRequest();
		request.onload = addScanMesh;
		request.open("get", "data/" + scanName + ".points", true);
		request.send();
	}

	/*
	 * This function will be executed when the scan file is loaded
	 */
	function addScanMesh() {
		// If it exists, remove the previous scan mesh and point cloud from the scene
		if (scan) {
			scene.remove(scan.mesh);
			scene.remove(scan.pointCloud);
		}

		// Create a scan object and initialize it with the file content
		scan = new Scan();
		scan.initFromFile(this.responseText);
		scan.crop();

		// Save a copy of the original scan
		originalScan = scan.clone();

		// Fill the scan holes
		scan.fillHoles(guiControlKeys["Fill holes"]);

		// Smooth the scan points
		scan.gaussianSmooth(guiControlKeys["Smoothness"]);

		// Reduce the resolution
		scan.reduceResolution(guiControlKeys["Resolution"]);

		// Create the scan mesh and the point cloud
		scan.createMesh(p5Canvas);
		scan.createPointCloud(p5Canvas);

		// Add the mesh or the point cloud to the scene
		if (guiControlKeys["Show points"]) {
			scene.add(scan.pointCloud);
		} else {
			scene.add(scan.mesh);
		}
	}

	/*
	 * Updates the scan properties when the user modifies it with the GUI
	 */
	function updateScanProperties() {
		if (scan) {
			// Remove the previous scan mesh and point cloud from the scene
			scene.remove(scan.mesh);
			scene.remove(scan.pointCloud);

			// Start from the original scan
			scan = originalScan.clone();

			// Fill the scan holes
			scan.fillHoles(guiControlKeys["Fill holes"]);

			// Smooth the scan points
			scan.gaussianSmooth(guiControlKeys["Smoothness"]);

			// Reduce the resolution
			scan.reduceResolution(guiControlKeys["Resolution"]);

			// Create the scan mesh and the point cloud
			scan.createMesh(p5Canvas);
			scan.createPointCloud(p5Canvas);

			// Add the mesh or the point cloud to the scene
			if (guiControlKeys["Show points"]) {
				scene.add(scan.pointCloud);
			} else {
				scene.add(scan.mesh);
			}
		}
	}

	/*
	 * The Scan class
	 */
	function Scan() {
		this.width = 0;
		this.height = 0;
		this.points = undefined;
		this.colors = undefined;
		this.normals = undefined;
		this.empty = undefined;
		this.ini = undefined;
		this.end = undefined;
		this.mesh = undefined;
		this.pointCloud = undefined;
		this.maxSeparationSq = Math.pow(140, 2);
	}

	/*
	 * Clones the current scan
	 */
	Scan.prototype.clone = function() {
		var scanClone, i;

		scanClone = new Scan();

		if (this.width != 0 || this.height != 0) {
			scanClone.width = this.width;
			scanClone.height = this.height;
			scanClone.points = [];
			scanClone.colors = [];
			scanClone.normals = [];

			for (i = 0; i < this.points.length; i++) {
				if (this.points[i]) {
					scanClone.points[i] = this.points[i].clone();
					scanClone.colors[i] = this.colors[i].clone();
					scanClone.normals[i] = this.normals[i].clone();
				} else {
					scanClone.points[i] = undefined;
					scanClone.colors[i] = undefined;
					scanClone.normals[i] = undefined;
				}
			}

			scanClone.empty = this.empty.slice();
			scanClone.ini = this.ini.slice();
			scanClone.end = this.end.slice();

			if (this.mesh) {
				scanClone.mesh = this.mesh.clone();
			}

			if (this.pointCloud) {
				scanClone.pointCloud = this.pointCloud.clone();
			}
		}

		return scanClone;
	}

	/*
	 * Initialize the scan from a file
	 */
	Scan.prototype.initFromFile = function(fileData) {
		var scanLines, dimensions, x, y, pixel, pointData;

		// Split the data in lines
		scanLines = fileData.split("\n");

		// Get the scan dimensions
		dimensions = scanLines[0].split(" ");
		this.width = parseInt(dimensions[0]);
		this.height = parseInt(dimensions[1]);

		// Fill the scan arrays
		this.points = [];
		this.colors = [];
		this.empty = [];
		this.ini = [];
		this.end = [];

		for (y = 0; y < this.height; y++) {
			this.empty[y] = true;
			this.ini[y] = undefined;
			this.end[y] = undefined;

			for (x = 0; x < this.width; x++) {
				pixel = x + y * this.width;
				pointData = scanLines[pixel + 1].split(" ");

				if (parseFloat(pointData[3]) >= 0) {
					this.points[pixel] = new THREE.Vector3(parseFloat(pointData[0]), parseFloat(pointData[1]),
							parseFloat(pointData[2]));
					this.colors[pixel] = new THREE.Color(parseFloat(pointData[3]) / 255,
							parseFloat(pointData[4]) / 255, parseFloat(pointData[5]) / 255);

					if (this.empty[y]) {
						this.empty[y] = false;
						this.ini[y] = x;
					}

					this.end[y] = x;
				} else {
					this.points[pixel] = undefined;
					this.colors[pixel] = undefined;
				}
			}
		}

		// Calculate the point normals
		this.calculatePointNormals();
	};

	/*
	 * Calculates the point normals
	 */
	Scan.prototype.calculatePointNormals = function() {
		var i, v1, v2, perp, x, y, pixel, averageNormal, counter;

		// Initialize the normals array
		this.normals = [];

		for (i = 0; i < this.points.length; i++) {
			this.normals[i] = undefined;
		}

		// Calculate the point normals
		v1 = new THREE.Vector3();
		v2 = new THREE.Vector3();
		perp = new THREE.Vector3();

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel]) {
						averageNormal = new THREE.Vector3();
						counter = 0;

						if (x + 1 < this.width && y + 1 < this.height && this.points[pixel + 1]
								&& this.points[pixel + this.width]) {
							v1.subVectors(this.points[pixel + 1], this.points[pixel]);
							v2.subVectors(this.points[pixel + this.width], this.points[pixel]);
							perp.crossVectors(v1, v2).normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x - 1 >= 0 && y + 1 < this.height && this.points[pixel - 1]
								&& this.points[pixel + this.width]) {
							v1.subVectors(this.points[pixel + this.width], this.points[pixel]);
							v2.subVectors(this.points[pixel - 1], this.points[pixel]);
							perp.crossVectors(v1, v2).normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x - 1 >= 0 && y - 1 >= 0 && this.points[pixel - 1] && this.points[pixel - this.width]) {
							v1.subVectors(this.points[pixel - 1], this.points[pixel]);
							v2.subVectors(this.points[pixel - this.width], this.points[pixel]);
							perp.crossVectors(v1, v2).normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x + 1 < this.width && y - 1 >= 0 && this.points[pixel + 1]
								&& this.points[pixel - this.width]) {
							v1.subVectors(this.points[pixel - this.width], this.points[pixel]);
							v2.subVectors(this.points[pixel + 1], this.points[pixel]);
							perp.crossVectors(v1, v2).normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (counter > 0) {
							this.normals[pixel] = averageNormal.normalize();
						} else {
							this.normals[pixel] = averageNormal;
						}
					}
				}
			}
		}
	};

	/*
	 * Extends the dimensions of the scan to center it
	 */
	Scan.prototype.centerAndExtend = function() {
		var centralPixel, widthExt, heightExt, pointsExt, colorsExt, normalsExt, emptyExt, iniExt, endExt;
		var i, xStart, yStart, x, y, pixel, pixelExt;

		// Calculate the dimensions of the extended scan
		centralPixel = this.getCentralPixel();
		widthExt = 2 * Math.max(centralPixel[0], this.width - 1 - centralPixel[0]) + 1;
		heightExt = 2 * Math.max(centralPixel[1], this.height - 1 - centralPixel[1]) + 1;

		// Prepare the arrays
		pointsExt = [];
		colorsExt = [];
		normalsExt = [];
		emptyExt = [];
		iniExt = [];
		endExt = [];

		for (i = 0; i < widthExt * heightExt; i++) {
			pointsExt[i] = undefined;
			colorsExt[i] = undefined;
			normalsExt[i] = undefined;
		}

		for (i = 0; i < heightExt; i++) {
			emptyExt[i] = true;
			iniExt[i] = undefined;
			endExt[i] = undefined;
		}

		// Populate the arrays
		if (centralPixel[0] > (this.width - 1 - centralPixel[0])) {
			xStart = 0;
		} else {
			xStart = widthExt - this.width;
		}

		if (centralPixel[1] > (this.height - 1 - centralPixel[1])) {
			yStart = 0;
		} else {
			yStart = heightExt - this.height;
		}

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;
					pixelExt = (xStart + x) + (yStart + y) * widthExt;
					pointsExt[pixelExt] = this.points[pixel];
					colorsExt[pixelExt] = this.colors[pixel];
					normalsExt[pixelExt] = this.normals[pixel];
				}

				emptyExt[yStart + y] = this.empty[y];
				iniExt[yStart + y] = this.ini[y] + xStart;
				endExt[yStart + y] = this.end[y] + xStart;
			}
		}

		// Update the scan to the new properties
		this.width = widthExt;
		this.height = heightExt;
		this.points = pointsExt;
		this.colors = colorsExt;
		this.normals = normalsExt;
		this.empty = emptyExt;
		this.ini = iniExt;
		this.end = endExt;
	};

	/*
	 * Gets the pixel closer to the origin
	 */
	Scan.prototype.getCentralPixel = function() {
		var centralPixel, minDistanceSq, x, y, point, distanceSq;

		centralPixel = [];
		minDistanceSq = Number.MAX_VALUE;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					point = this.points[x + y * this.width];

					if (point) {
						distanceSq = point.x * point.x + point.y * point.y;

						if (distanceSq < minDistanceSq) {
							centralPixel[0] = x;
							centralPixel[1] = y;
							minDistanceSq = distanceSq;
						}
					}
				}
			}
		}

		return centralPixel;
	};

	/*
	 * Extends the scan to the provided dimensions
	 */
	Scan.prototype.extend = function(widthExt, heightExt) {
		var pointsExt, colorsExt, normalsExt, emptyExt, iniExt, endExt, i, xStart, yStart, x, y, pixel, pixelExt;

		if (widthExt >= this.width && heightExt >= this.height) {
			// Prepare the arrays
			pointsExt = [];
			colorsExt = [];
			normalsExt = [];
			emptyExt = [];
			iniExt = [];
			endExt = [];

			for (i = 0; i < widthExt * heightExt; i++) {
				pointsExt[i] = undefined;
				colorsExt[i] = undefined;
				normalsExt[i] = undefined;
			}

			for (i = 0; i < heightExt; i++) {
				emptyExt[i] = true;
				iniExt[i] = undefined;
				endExt[i] = undefined;
			}

			// Populate the arrays
			xStart = Math.floor((widthExt - this.width) / 2);
			yStart = Math.floor((heightExt - this.height) / 2);

			for (y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for (x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						pixelExt = (xStart + x) + (yStart + y) * widthExt;
						pointsExt[pixelExt] = this.points[pixel];
						colorsExt[pixelExt] = this.colors[pixel];
						normalsExt[pixelExt] = this.normals[pixel];
					}

					emptyExt[yStart + y] = this.empty[y];
					iniExt[yStart + y] = this.ini[y] + xStart;
					endExt[yStart + y] = this.end[y] + xStart;
				}
			}

			// Update the scan to the new properties
			this.width = widthExt;
			this.height = heightExt;
			this.points = pointsExt;
			this.colors = colorsExt;
			this.normals = normalsExt;
			this.empty = emptyExt;
			this.ini = iniExt;
			this.end = endExt;
		}
	};

	/*
	 * Crops the scan to the area with valid points
	 */
	Scan.prototype.crop = function() {
		var xIni, xEnd, yIni, yEnd, x, y, widthCrop, heightCrop, pointsCrop, colorsCrop, normalsCrop;
		var emptyCrop, iniCrop, endCrop, i, pixel, pixelCrop;

		// Calculate the region in the scan with the valid data
		xIni = Number.MAX_VALUE;
		xEnd = -Number.MAX_VALUE;
		yIni = Number.MAX_VALUE;
		yEnd = -Number.MAX_VALUE;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				if (this.ini[y] < xIni) {
					xIni = this.ini[y];
				}

				if (this.end[y] > xEnd) {
					xEnd = this.end[y];
				}

				if (y < yIni) {
					yIni = y;
				}

				if (y > yEnd) {
					yEnd = y;
				}
			}
		}

		// Check that the limits make sense
		if (xIni <= xEnd && yIni <= yEnd) {
			// Dimensions of the cropped scan
			widthCrop = (xEnd - xIni) + 1;
			heightCrop = (yEnd - yIni) + 1;

			// Prepare the arrays
			pointsCrop = [];
			colorsCrop = [];
			normalsCrop = [];
			emptyCrop = [];
			iniCrop = [];
			endCrop = [];

			for (i = 0; i < widthCrop * heightCrop; i++) {
				pointsCrop[i] = undefined;
				colorsCrop[i] = undefined;
				normalsCrop[i] = undefined;
			}

			for (i = 0; i < heightCrop; i++) {
				emptyCrop[i] = true;
				iniCrop[i] = undefined;
				endCrop[i] = undefined;
			}

			// Populate the arrays
			for (y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for (x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						pixelCrop = (x - xIni) + (y - yIni) * widthCrop;
						pointsCrop[pixelCrop] = this.points[pixel];
						colorsCrop[pixelCrop] = this.colors[pixel];
						normalsCrop[pixelCrop] = this.normals[pixel];
					}

					emptyCrop[y - yIni] = this.empty[y];
					iniCrop[y - yIni] = this.ini[y] - xIni;
					endCrop[y - yIni] = this.end[y] - xIni;
				}
			}

			// Update the scan to the new properties
			this.width = widthCrop;
			this.height = heightCrop;
			this.points = pointsCrop;
			this.colors = colorsCrop;
			this.normals = normalsCrop;
			this.empty = emptyCrop;
			this.ini = iniCrop;
			this.end = endCrop;
		}
	};

	/*
	 * Reduces the scan resolution
	 */
	Scan.prototype.reduceResolution = function(n) {
		var widthRed, heightRed, pointsRed, colorsRed, emptyRed, iniRed, endRed, i, delta, x, y;
		var point, r, g, b, counter, j, xNearby, yNearby, pixelNearby, pixelRed;

		// Make sure the reduction factor is an integer
		n = Math.round(n);

		if (n >= 2) {
			// Dimensions of the reduced scan
			widthRed = Math.ceil(this.width / n);
			heightRed = Math.ceil(this.height / n);

			// Prepare the arrays
			pointsRed = [];
			colorsRed = [];
			emptyRed = [];
			iniRed = [];
			endRed = [];

			for (i = 0; i < widthRed * heightRed; i++) {
				pointsRed[i] = undefined;
				colorsRed[i] = undefined;
			}

			for (i = 0; i < heightRed; i++) {
				emptyRed[i] = true;
				iniRed[i] = undefined;
				endRed[i] = undefined;
			}

			// Populate the arrays
			delta = Math.floor(n / 2);

			for (y = 0; y < heightRed; y++) {
				for (x = 0; x < widthRed; x++) {
					// Average between nearby pixels
					point = new THREE.Vector3();
					r = 0;
					g = 0;
					b = 0;
					counter = 0;

					for (i = -delta; i <= delta; i++) {
						for (j = -delta; j <= delta; j++) {
							xNearby = x * n + i;
							yNearby = y * n + j;
							pixelNearby = xNearby + yNearby * this.width;

							if (xNearby >= 0 && xNearby < this.width && yNearby >= 0 && yNearby < this.height
									&& this.points[pixelNearby]) {
								point.add(this.points[pixelNearby]);
								r += this.colors[pixelNearby].r;
								g += this.colors[pixelNearby].g;
								b += this.colors[pixelNearby].b;
								counter++;
							}
						}
					}

					if (counter > 0) {
						pixelRed = x + y * widthRed;
						pointsRed[pixelRed] = point.divideScalar(counter);
						colorsRed[pixelRed] = new THREE.Color(r / counter, g / counter, b / counter);

						if (emptyRed[y]) {
							emptyRed[y] = false;
							iniRed[y] = x;
						}

						endRed[y] = x;
					}
				}
			}

			// Update the scan to the new properties
			this.width = widthRed;
			this.height = heightRed;
			this.points = pointsRed;
			this.colors = colorsRed;
			this.empty = emptyRed;
			this.ini = iniRed;
			this.end = endRed;
			this.calculatePointNormals();
		}
	};

	/*
	 * Fills the scan holes
	 */
	Scan.prototype.fillHoles = function(maxHoles) {
		var x, y, start, finish, i, step, deltaPos, deltaR, deltaG, deltaB;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				// Find holes in the line
				for (x = this.ini[y] + 1; x < this.end[y]; x++) {
					if (!this.points[x + y * this.width]) {
						// Calculate the limits of the hole
						start = (x - 1) + y * this.width;
						finish = start;

						for (i = x + 1; i <= this.end[y]; i++) {
							if (this.points[i + y * this.width]) {
								finish = i + y * this.width;
								// the x loop will continue from here
								x = i;
								break;
							}
						}

						// Fill the hole if the gap is not too big
						if (finish - start - 1 <= maxHoles) {
							step = 1 / (finish - start);
							deltaPos = new THREE.Vector3().subVectors(this.points[finish], this.points[start]);
							deltaPos.multiplyScalar(step);
							deltaR = step * (this.colors[finish].r - this.colors[start].r);
							deltaG = step * (this.colors[finish].g - this.colors[start].g);
							deltaB = step * (this.colors[finish].b - this.colors[start].b);

							for (i = start + 1; i < finish; i++) {
								this.points[i] = new THREE.Vector3().addVectors(this.points[i - 1], deltaPos);
								this.colors[i] = new THREE.Color(this.colors[i - 1].r + deltaR, this.colors[i - 1].g
										+ deltaG, this.colors[i - 1].b + deltaB);
							}
						}
					}
				}
			}
		}

		// Update the scan point normals
		this.calculatePointNormals();
	};

	/*
	 * Smoothes the scan using a Gaussian kernel
	 */
	Scan.prototype.gaussianSmooth = function(n) {
		var kernel, row, i, j, distSq, pointsSm, x, y, pixel, center, point, counter, pointNearby;

		// Make sure the smoothing factor is an integer
		n = Math.round(n);

		if (n > 0) {
			// Create the Gaussian kernel
			kernel = [];

			for (i = -n; i <= n; i++) {
				row = [];

				for (j = -n; j <= n; j++) {
					distSq = i * i + j * j;

					if (distSq <= n * n) {
						row.push(Math.pow(2.718, -distSq / (n * n / 2)));
					} else {
						row.push(0);
					}
				}

				kernel.push(row);
			}

			// Prepare the array with the smoothed points
			pointsSm = [];

			for (i = 0; i < this.width * this.height; i++) {
				pointsSm[i] = undefined;
			}

			// Populate the array
			for (y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for (x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						center = this.points[pixel];

						if (center) {
							// Average between nearby pixels
							point = new THREE.Vector3();
							counter = 0;

							for (i = -n; i <= n; i++) {
								for (j = -n; j <= n; j++) {
									if (x + i >= 0 && x + i < this.width && y + j >= 0 && y + j < this.height) {
										pointNearby = this.points[x + i + (y + j) * this.width];

										if (pointNearby && pointNearby.distanceToSquared(center) < this.maxSeparationSq) {
											point.add(pointNearby.clone().multiplyScalar(kernel[i + n][j + n]));
											counter += kernel[i + n][j + n];
										}
									}
								}
							}

							if (counter > 0) {
								pointsSm[pixel] = point.divideScalar(counter);
							}
						}
					}
				}
			}

			// Update the scan to the new properties
			this.points = pointsSm;
			this.calculatePointNormals();
		}
	};

	/*
	 * Creates the scan point cloud
	 */
	Scan.prototype.createPointCloud = function(canvas) {
		var vertices, verticesColors, verticesNormals, i, geometry, material;

		// Calculate the vertices properties
		vertices = [];
		verticesColors = [];
		verticesNormals = [];

		for (i = 0; i < this.points.length; i++) {
			if (this.points[i]) {
				vertices.push(this.points[i]);
				verticesColors.push(this.colors[i]);
				verticesNormals.push(this.normals[i]);
			}
		}

		// Define the points geometry
		geometry = new THREE.Geometry();
		geometry.vertices = vertices;

		// Define the points shader material
		material = this.createShaderMaterial(verticesColors, verticesNormals, canvas);

		// Create the point cloud
		this.pointCloud = new THREE.PointCloud(geometry, material);
	};

	/*
	 * Creates the scan mesh
	 */
	Scan.prototype.createMesh = function(canvas) {
		var vertices, verticesColors, verticesNormals, order, counter, x, y, pixel, faces, barycentricCoord;
		var xStart, xEnd, pixel1, pixel2, pixel3, pixel4, geometry, frontMaterial, backMaterial, frontMesh, backMesh;

		// Calculate the vertices properties
		vertices = [];
		verticesColors = [];
		verticesNormals = [];
		order = [];
		counter = 0;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel]) {
						vertices.push(this.points[pixel]);
						verticesColors.push(this.colors[pixel]);
						verticesNormals.push(this.normals[pixel]);
						order[pixel] = counter;
						counter++;
					}
				}
			}
		}

		// Calculate the faces and the barycentric coordinates
		faces = [];
		barycentricCoord = [];

		for (y = 0; y < this.height - 1; y++) {
			if (!this.empty[y] && !this.empty[y + 1]) {
				xStart = Math.min(this.ini[y], this.ini[y + 1]);
				xEnd = Math.max(this.end[y], this.end[y + 1]);

				for (x = xStart; x < xEnd; x++) {
					pixel1 = x + y * this.width;
					pixel2 = pixel1 + 1;
					pixel3 = pixel2 + this.width;
					pixel4 = pixel1 + this.width;

					// First triangle
					if (this.points[pixel1] && this.points[pixel4]) {
						if (this.points[pixel2]) {
							this.addFace(pixel1, pixel2, pixel4, order, faces, barycentricCoord);
						} else if (this.points[pixel3]) {
							this.addFace(pixel1, pixel3, pixel4, order, faces, barycentricCoord);
						}
					}

					// Second triangle
					if (this.points[pixel2] && this.points[pixel3]) {
						if (this.points[pixel4]) {
							this.addFace(pixel2, pixel3, pixel4, order, faces, barycentricCoord);
						} else if (this.points[pixel1]) {
							this.addFace(pixel1, pixel2, pixel3, order, faces, barycentricCoord);
						}
					}
				}
			}
		}

		// Define the mesh geometry
		geometry = new THREE.Geometry();
		geometry.vertices = vertices;
		geometry.faces = faces;

		// Define the front and back shader materials
		frontMaterial = this.createShaderMaterial(verticesColors, verticesNormals, canvas, barycentricCoord, false);
		backMaterial = this.createShaderMaterial(verticesColors, verticesNormals, canvas, barycentricCoord, true);

		// Create the front and back meshes
		frontMesh = new THREE.Mesh(geometry, frontMaterial);
		backMesh = new THREE.Mesh(geometry, backMaterial);
		frontMesh.name = "frontMesh";
		backMesh.name = "backMesh";

		// Add the front and back meshes to the mesh container
		this.mesh = new THREE.Object3D();
		this.mesh.add(backMesh);
		this.mesh.add(frontMesh);
	};

	/*
	 * Adds a face to the faces and barycentricCoord arrays
	 */
	Scan.prototype.addFace = function(pixel1, pixel2, pixel3, order, faces, barycentricCoord) {
		var p1, p2, p3;

		p1 = this.points[pixel1];
		p2 = this.points[pixel2];
		p3 = this.points[pixel3];

		if (p1.distanceToSquared(p2) < this.maxSeparationSq && p1.distanceToSquared(p3) < this.maxSeparationSq
				&& p2.distanceToSquared(p3) < this.maxSeparationSq) {
			faces.push(new THREE.Face3(order[pixel1], order[pixel2], order[pixel3]));
			barycentricCoord
					.push([ new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1) ])
		}
	}

	/*
	 * Creates the appropriate scan shader material
	 */
	Scan.prototype.createShaderMaterial = function(verticesColors, verticesNormals, canvas, barycentricCoord, backScan) {
		var pointMaterial, attributes, uniforms, material;

		// The barycentric coordinates are not defined for point materials
		pointMaterial = barycentricCoord ? false : true;

		// Define the fragment attributes
		attributes = {};

		attributes['aColor'] = {
			type : 'c',
			value : verticesColors
		};

		attributes['aNormal'] = {
			type : 'v3',
			value : verticesNormals
		};

		if (!pointMaterial) {
			attributes['aBarycentricCoord'] = {
				type : 'v3',
				boundTo : 'faceVertices',
				value : barycentricCoord
			};
		}

		// Define the fragment uniforms
		uniforms = {};

		uniforms['pointCloud'] = {
			type : "i",
			value : pointMaterial
		};

		uniforms['backScan'] = {
			type : "i",
			value : pointMaterial ? 0 : backScan
		};

		uniforms['backColor'] = {
			type : "c",
			value : new THREE.Color(1, 1, 1)
		};

		uniforms['showLines'] = {
			type : "i",
			value : 0
		};

		uniforms['pointSize'] = {
			type : "f",
			value : 2
		};

		uniforms['effect'] = {
			type : "i",
			value : 0
		};

		uniforms['invertEffect'] = {
			type : "i",
			value : 0
		};

		uniforms['fillWithColor'] = {
			type : "i",
			value : 0
		};

		uniforms['effectTransparency'] = {
			type : "f",
			value : 1
		};

		uniforms['lightPosition'] = {
			type : "v3",
			value : new THREE.Vector3(0)
		};

		uniforms['time'] = {
			type : "f",
			value : 0
		};

		// Add the texture
		var texture = new THREE.Texture();
		texture.image = canvas.elt;
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;

		uniforms['mask'] = {
			type : "t",
			value : texture
		};

		// Create the shader material
		material = new THREE.ShaderMaterial({
			attributes : attributes,
			uniforms : uniforms,
			vertexShader : document.getElementById("vertexShader").textContent,
			fragmentShader : document.getElementById("fragmentShader").textContent,
			side : pointMaterial ? THREE.DoubleSide : backScan ? THREE.BackSide : THREE.FrontSide,
			transparent : true
		});

		return material;
	}

	/*
	 * Updates the uniforms for the vertex and fragment shaders
	 */
	Scan.prototype.updateUniforms = function(backColor, showLines, pointSize, effect, invertEffect, fillWithColor,
			effectTransparency, lightPosition, time) {
		var frontMeshUniforms, backMeshUniforms, pointCloudUniforms;

		if (this.mesh) {
			// Get the front and back mesh uniforms
			frontMeshUniforms = this.mesh.getObjectByName("frontMesh").material.uniforms;
			backMeshUniforms = this.mesh.getObjectByName("backMesh").material.uniforms;

			// Update the uniforms
			frontMeshUniforms.backColor.value.setRGB(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255);
			backMeshUniforms.backColor.value.setRGB(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255);
			frontMeshUniforms.showLines.value = showLines;
			backMeshUniforms.showLines.value = showLines;
			frontMeshUniforms.effect.value = effect;
			backMeshUniforms.effect.value = effect;
			frontMeshUniforms.invertEffect.value = invertEffect;
			backMeshUniforms.invertEffect.value = invertEffect;
			frontMeshUniforms.fillWithColor.value = fillWithColor;
			backMeshUniforms.fillWithColor.value = fillWithColor;
			frontMeshUniforms.effectTransparency.value = effectTransparency;
			backMeshUniforms.effectTransparency.value = effectTransparency;
			frontMeshUniforms.lightPosition.value = lightPosition;
			backMeshUniforms.lightPosition.value = lightPosition;
			frontMeshUniforms.time.value = time;
			backMeshUniforms.time.value = time;

			// Update the mask texture only if the sketch is running
			if (p5Sketch) {
				frontMeshUniforms.mask.value.needsUpdate = true;
				backMeshUniforms.mask.value.needsUpdate = true;
			}
		}

		if (this.pointCloud) {
			// Get the point cloud uniforms
			pointCloudUniforms = this.pointCloud.material.uniforms;

			// Update the uniforms
			pointCloudUniforms.pointSize.value = pointSize;
			pointCloudUniforms.effect.value = effect;
			pointCloudUniforms.invertEffect.value = invertEffect;
			pointCloudUniforms.fillWithColor.value = fillWithColor;
			pointCloudUniforms.effectTransparency.value = effectTransparency;
			pointCloudUniforms.lightPosition.value = lightPosition;
			pointCloudUniforms.time.value = time;

			// Update the mask texture only if the sketch is running
			if (p5Sketch) {
				pointCloudUniforms.mask.value.needsUpdate = true;
			}
		}
	}

	/*
	 * The Balls Sketch class
	 */
	function BallsSketch(nBalls, ballDiameter, p5Canvas, fillColor, bgColor, clearCanvas) {
		var i, ang, vel;

		// Class parameters
		this.p5 = p5Canvas;
		this.fillColor = fillColor;
		this.bgColor = bgColor;
		this.clearCanvas = clearCanvas;
		this.nBalls = nBalls;
		this.balls = [];

		// Initialize the balls
		for (i = 0; i < this.nBalls; i++) {
			ang = Math.PI * Math.random();
			vel = 0.6;

			this.balls[i] = {
				x : this.p5.width * Math.random(),
				y : this.p5.height * Math.random(),
				vx : vel * Math.cos(ang),
				vy : vel * Math.sin(ang),
				diameter : ballDiameter
			};
		}

		// Processing setup
		this.p5.background(this.bgColor);
		this.p5.fill(this.fillColor);
		this.p5.noStroke();

		// The update method
		this.update = function() {
			var i, ball;

			for (i = 0; i < this.nBalls; i++) {
				ball = this.balls[i];

				// Update the ball position
				ball.x += ball.vx;
				ball.y += ball.vy;

				// Make sure that it doesn't leave the canvas
				if (ball.x < 0) {
					ball.x = 0;
					ball.vx *= -1;
				} else if (ball.x > this.p5.width) {
					ball.x = this.p5.width;
					ball.vx *= -1;
				}

				if (ball.y < 0) {
					ball.y = 0;
					ball.vy *= -1;
				} else if (ball.y > this.p5.height) {
					ball.y = this.p5.height;
					ball.vy *= -1;
				}
			}
		};

		// The paint method
		this.paint = function() {
			var i, ball;

			// Clear the canvas if necessary
			if (this.clearCanvas) {
				this.p5.background(this.bgColor);
			}

			// Draw the balls
			for (i = 0; i < this.nBalls; i++) {
				ball = this.balls[i];
				this.p5.ellipse(ball.x, ball.y, ball.diameter, ball.diameter);
			}
		};
	}

	/*
	 * The DLA Sketch class
	 */
	function DLASketch(p5Canvas, fillColor, bgColor, clearCanvas) {
		var i, x, y;

		// Class parameters
		this.p5 = p5Canvas;
		this.fillColor = fillColor;
		this.bgColor = bgColor;
		this.clearCanvas = clearCanvas;
		this.nParticles = 0.1 * this.p5.width * this.p5.height;
		this.particles = [];
		this.buffer = new Int32Array(this.p5.width * this.p5.height);

		// Initialize the particles
		for (i = 0; i < this.nParticles; i++) {
			this.particles[i] = {
				x : Math.floor(this.p5.width * Math.random()),
				y : Math.floor(this.p5.height * Math.random()),
				xPrev : 0,
				yPrev : 0,
				diameter : 3,
				aggregated : false
			};
		}

		// Initialize the buffer
		for (i = 0; i < this.buffer.length; i++) {
			this.buffer[i] = this.bgColor;
		}

		// The buffer draw function
		this.buffer.w = this.p5.width;
		this.buffer.h = this.p5.height;

		this.buffer.draw = function(x, y, color) {
			if (x >= 0 && x < this.w && y >= 0 && y < this.h) {
				this[x + y * this.w] = color;

				if (x - 1 >= 0) {
					if (y - 1 >= 0) {
						this[x - 1 + (y - 1) * this.w] = color;
					}

					if (y + 1 < this.h) {
						this[x - 1 + (y + 1) * this.w] = color;
					}
				}

				if (x + 1 < this.w) {
					if (y - 1 >= 0) {
						this[x + 1 + (y - 1) * this.w] = color;
					}

					if (y + 1 < this.h) {
						this[x + 1 + (y + 1) * this.w] = color;
					}
				}
			}
		};

		// Add some seeds to the buffer
		for (i = 0; i < 10; i++) {
			x = Math.floor(this.buffer.w * (0.2 + 0.6 * Math.random()));
			y = Math.floor(this.buffer.h * (0.2 + 0.6 * Math.random()));
			this.buffer.draw(x, y, this.fillColor);
		}

		// Processing setup
		this.p5.background(this.bgColor);
		this.p5.fill(this.fillColor);
		this.p5.noStroke();

		// The update method
		this.update = function() {
			var i, p;

			// Move the particles if they are not yet aggregated
			for (i = 0; i < this.nParticles; i++) {
				p = this.particles[i];

				if (!p.aggregated) {
					p.xPrev = p.x;
					p.yPrev = p.y;

					switch (Math.floor(8 * Math.random())) {
					case 0:
						p.x++;
						break;
					case 1:
						p.x++;
						p.y++;
						break;
					case 2:
						p.y++;
						break;
					case 3:
						p.x--;
						p.y++;
						break;
					case 4:
						p.x--;
						break;
					case 5:
						p.x--;
						p.y--;
						break;
					case 6:
						p.y--;
						break;
					case 7:
						p.x++;
						p.y--;
						break;
					}

					// If the particle is outside the canvas, set it as aggregated
					if (p.x < 0 || p.x >= this.p5.width || p.y < 0 || p.y >= this.p5.height) {
						p.aggregated = true;
					}
				}
			}
		};

		// The paint method
		this.paint = function() {
			var i, p;

			for (i = 0; i < this.nParticles; i++) {
				p = this.particles[i];

				if (!p.aggregated) {
					// Check if the particle should be aggregated
					if (this.buffer[p.x + p.y * this.buffer.w] == this.fillColor) {
						if (this.buffer[p.xPrev + p.yPrev * this.buffer.w] != this.fillColor) {
							this.p5.ellipse(p.xPrev, p.yPrev, p.diameter, p.diameter);
							this.buffer.draw(p.xPrev, p.yPrev, this.fillColor);
						}

						p.aggregated = true;
					}
				}
			}
		};
	}
}