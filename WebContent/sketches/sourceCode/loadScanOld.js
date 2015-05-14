function runSketch() {
	var scene, renderer, camera;
	var scan, angle;

	init();
	animate();

	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 500;
		canvasHeight = 400;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Scene setup
		scene = new THREE.Scene();

		// Renderer setup
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(canvasWidth, canvasHeight);
		renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);

		// add spotlight for the shadows
		spotLight = new THREE.PointLight(0xffffff);
		spotLight.position.set(0, 0, 0);
		spotLight.castShadow = true;
		pointLight.distance = 100;
		scene.add(spotLight);

		// add subtle ambient lighting
		ambientLight = new THREE.AmbientLight(0x0c0c0c);
		scene.add(ambientLight);

		// Read the scan
		readScan("data/scan1.points");

		// Initialize the camera angle variable
		angle = 1.5 * Math.PI;

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);
	}

	function animate() {
		requestAnimationFrame(animate);
		angle += 0.007;
		camera.position.x = 450 * Math.cos(angle);
		camera.position.z = 450 * Math.sin(angle);
		camera.lookAt(scene.position);

		if (scan) {
			scan.resetVisiblePoints();
			scan.constrainPoints(-300, 300, -300, 300, -150 + 100 * Math.cos(angle), 300);
			scan.updateMesh();
		}

		renderer.render(scene, camera);
	}

	/*
	 * Read a file in the server containing the scan point
	 */
	function readScan(file) {
		var request = new XMLHttpRequest();
		request.onload = addScanMesh;
		request.open("get", file, true);
		request.send();
	}

	/*
	 * This function will be executed when the scan file is read
	 */
	function addScanMesh() {
		// Create a scan object and initialize it with the file content
		scan = new Scan();
		scan.initFromFile(this.responseText);
		scan.crop();
		scan.fillHoles(4);
		scan.reduceResolution(2);
		scan.gaussianSmooth(2);
		scan.centerAndExtend();

		// Create the scan mesh and the point cloud
		scan.createMesh(true);
		scan.createPointCloud(4);

		// Add the mesh to the scene
		// scene.remove(scan.mesh);
		// scene.add(scan.pointCloud);
		scene.remove(scan.pointCloud);
		scene.add(scan.mesh);
	}

	/*
	 * The Scan class
	 */
	function Scan() {
		this.width = 0;
		this.height = 0;
		this.points = undefined;
		this.colors = undefined;
		this.visible = undefined;
		this.order = undefined;
		this.empty = undefined;
		this.ini = undefined;
		this.end = undefined;
		this.centralPixel = undefined;
		this.centralPosition = undefined;
		this.mesh = undefined;
		this.pointCloud = undefined;
		this.maxSeparationSq = 120 * 120;
	}

	/*
	 * Initialize the scan from a file
	 */
	Scan.prototype.initFromFile = function(fileData) {
		var scanLines, dimensions, counter, i, pointData;

		// Split the data in lines
		scanLines = fileData.split("\n");

		// Get the scan dimensions
		dimensions = scanLines[0].split(" ");
		this.width = parseInt(dimensions[0]);
		this.height = parseInt(dimensions[1]);

		// Fill the points and colors arrays
		this.points = [];
		this.colors = [];
		this.visible = [];

		for (i = 1; i < scanLines.length; i++) {
			pointData = scanLines[i].split(" ");

			if (pointData[3] >= 0) {
				this.points[i] = new THREE.Vector3(parseFloat(pointData[0]), parseFloat(pointData[1]),
						parseFloat(pointData[2]));
				this.colors[i] = new THREE.Color(parseFloat(pointData[3]) / 255, parseFloat(pointData[4]) / 255,
						parseFloat(pointData[5]) / 255);
				this.visible[i] = true;
			} else {
				this.points[i] = undefined;
				this.colors[i] = undefined;
				this.visible[i] = undefined;
			}
		}

		// Calculate the points order
		this.calculatePointsOrder();

		// Find the scan extremes
		this.findExtremes();

		// Calculate the scan central pixel
		this.findCentralPixel();
	};

	/*
	 * Calculates the points order
	 */
	Scan.prototype.calculatePointsOrder = function() {
		var counter, i;

		// Initiate the array if necessary
		if (!this.order) {
			this.order = [];
		}

		// Calculate the new order
		counter = 0;

		for (i = 0; i < this.points.length; i++) {
			if (this.points[i]) {
				this.order[i] = counter;
				counter++;
			} else {
				this.order[i] = undefined;
			}
		}

		// Reduce the array size if necessary
		if (this.order.length > this.points.length) {
			this.order.splice(this.points.length, Number.MAX_VALUE);
		}
	};

	/*
	 * Finds the scan extremes information
	 */
	Scan.prototype.findExtremes = function() {
		var x, y, started;
		this.ini = [];
		this.end = [];
		this.empty = [];

		for (y = 0; y < this.height; y++) {
			started = false;
			this.ini[y] = 0;
			this.end[y] = this.width - 1;
			this.empty[y] = true;

			for (x = 0; x < this.width; x++) {
				if (this.points[x + y * this.width]) {
					if (!started) {
						this.ini[y] = x;
						this.empty[y] = false;
						started = true;
					}

					this.end[y] = x;
				}
			}
		}
	};

	/*
	 * Finds the point and pixel closer to the center
	 */
	Scan.prototype.findCentralPixel = function() {
		var minDistanceSq, distanceSq, x, y, point;
		this.centralPixel = [];
		this.centralPosition = new THREE.Vector3();
		minDistanceSq = Number.MAX_VALUE;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					point = this.points[x + y * this.width];

					if (point) {
						distanceSq = point.x * point.x + point.y * point.y;

						if (distanceSq < minDistanceSq) {
							this.centralPixel[0] = x;
							this.centralPixel[1] = y;
							this.centralPosition.copy(point);
							minDistanceSq = distanceSq;
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
		var widthExt, heightExt, pointsExt, colorsExt, visibleExt, i, xStart, yStart, x, y, pixel, pixelExt;

		// Calculate the dimensions of the extended scan
		widthExt = 2 * Math.max(this.centralPixel[0] + 1, this.width - this.centralPixel[0]) - 1;
		heightExt = 2 * Math.max(this.centralPixel[1] + 1, this.height - this.centralPixel[1]) - 1;

		// Prepare the arrays
		pointsExt = [];
		colorsExt = [];
		visibleExt = [];

		for (i = 0; i < widthExt * heightExt; i++) {
			pointsExt[i] = undefined;
			colorsExt[i] = undefined;
			visibleExt[i] = undefined;
		}

		// Populate the arrays
		if ((this.centralPixel[0] + 1) > (this.width - this.centralPixel[0])) {
			xStart = 0;
		} else {
			xStart = widthExt - this.width;
		}

		if ((this.centralPixel[1] + 1) > (this.height - this.centralPixel[1])) {
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
					visibleExt[pixelExt] = this.visible[pixel];
				}
			}
		}

		// Update the scan to the new dimensions
		this.width = widthExt;
		this.height = heightExt;
		this.points = pointsExt;
		this.colors = colorsExt;
		this.visible = visibleExt;
		this.calculatePointsOrder();
		this.findExtremes();
		this.findCentralPixel();
	};

	/*
	 * Extends the scan to the provided dimensions
	 */
	Scan.prototype.extend = function(widthExt, heightExt) {
		var pointsExt, colorsExt, visibleExt, i, xStart, yStart, x, y, pixel, pixelExt;

		if (widthExt >= this.width && heightExt >= this.height) {
			// Prepare the arrays
			pointsExt = [];
			colorsExt = [];
			visibleExt = [];

			for (i = 0; i < widthExt * heightExt; i++) {
				pointsExt[i] = undefined;
				colorsExt[i] = undefined;
				visibleExt[i] = undefined;
			}

			// Populate the arrays
			xStart = (widthExt - this.width) / 2;
			yStart = (heightExt - this.height) / 2;

			for (y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for (x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						pixelExt = (xStart + x) + (yStart + y) * widthExt;
						pointsExt[pixelExt] = this.points[pixel];
						colorsExt[pixelExt] = this.colors[pixel];
						visibleExt[pixelExt] = this.visible[pixel];
					}
				}
			}

			// Update the scan to the new dimensions
			this.width = widthExt;
			this.height = heightExt;
			this.points = pointsExt;
			this.colors = colorsExt;
			this.visible = visibleExt;
			this.calculatePointsOrder();
			this.findExtremes();
			this.findCentralPixel();
		}
	};

	/*
	 * Crops the scan to the area with valid points
	 */
	Scan.prototype.crop = function() {
		var xIni, xEnd, yIni, yEnd, i, x, y;
		var widthCrop, heightCrop, pointsCrop, colorsCrop, visibleCrop, pixel, pixelCrop;

		// Calculate the region in the scan with the valid data
		xIni = this.width;
		xEnd = -1;
		yIni = this.height;
		yEnd = -1;

		for (y = 0; y < this.width; y++) {
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

		if (xIni <= xEnd && yIni <= yEnd) {
			// Dimensions of the cropped scan
			widthCrop = (xEnd - xIni) + 1;
			heightCrop = (yEnd - yIni) + 1;

			// Prepare the arrays
			pointsCrop = [];
			colorsCrop = [];
			visibleCrop = [];

			for (i = 0; i < widthCrop * heightCrop; i++) {
				pointsCrop[i] = undefined;
				colorsCrop[i] = undefined;
				visibleCrop[i] = undefined;
			}

			// Populate the arrays
			for (y = 0; y < heightCrop; y++) {
				for (x = 0; x < widthCrop; x++) {
					pixelCrop = x + y * widthCrop;
					pixel = (xIni + x) + (yIni + y) * this.width;
					pointsCrop[pixelCrop] = this.points[pixel];
					colorsCrop[pixelCrop] = this.colors[pixel];
					visibleCrop[pixelCrop] = this.visible[pixel];
				}
			}

			// Update the scan to the new dimensions
			this.width = widthCrop;
			this.height = heightCrop;
			this.points = pointsCrop;
			this.colors = colorsCrop;
			this.visible = visibleCrop;
			this.calculatePointsOrder();
			this.findExtremes();
			this.findCentralPixel();
		}
	};

	/*
	 * Reduces the scan resolution
	 */
	Scan.prototype.reduceResolution = function(n) {
		// Make sure the rounding value is an even integer
		n = 2 * Math.floor(n / 2);

		if (n > 1) {
			var widthRed, heightRed, pointsRed, colorsRed, visibleRed, x, y, pixel, pixelRed;
			var point, r, g, b, counter, visible, i, j, xNearby, yNearby, pixelNearby;

			// Dimensions of the reduced scan
			widthRed = Math.floor(this.width / n);
			heightRed = Math.floor(this.height / n);

			// Prepare the arrays
			pointsRed = [];
			colorsRed = [];
			visibleRed = [];

			for (i = 0; i < widthRed * heightRed; i++) {
				pointsRed[i] = undefined;
				colorsRed[i] = undefined;
				visibleRed[i] = undefined;
			}

			// Populate the arrays
			for (y = 0; y < heightRed; y++) {
				for (x = 0; x < widthRed; x++) {
					pixel = x * n + y * n * this.width;
					pixelRed = x + y * widthRed;

					// Average between nearby pixels
					point = new THREE.Vector3();
					r = 0;
					g = 0;
					b = 0;
					counter = 0;
					visible = false;

					for (i = -n / 2; i <= n / 2; i++) {
						for (j = -n / 2; j <= n / 2; j++) {
							xNearby = x * n + i;
							yNearby = y * n + j;

							if (xNearby >= 0 && xNearby < this.width && yNearby >= 0 && yNearby < this.height) {
								pixelNearby = xNearby + yNearby * this.width;

								if (this.points[pixelNearby]) {
									point.add(this.points[pixelNearby]);
									r += this.colors[pixelNearby].r;
									g += this.colors[pixelNearby].g;
									b += this.colors[pixelNearby].b;
									visible = visible || this.visible[pixelNearby];
									counter++;
								}
							}
						}
					}

					if (counter > 0) {
						pointsRed[pixelRed] = point.divideScalar(counter);
						colorsRed[pixelRed] = new THREE.Color(r / counter, g / counter, b / counter);
						visibleRed[pixelRed] = visible;
					}
				}
			}

			// Update the scan to the new resolution
			this.width = widthRed;
			this.height = heightRed;
			this.points = pointsRed;
			this.colors = colorsRed;
			this.visible = visibleRed;
			this.calculatePointsOrder();
			this.findExtremes();
			this.findCentralPixel();
		}
	};

	/*
	 * Scale the scan by a given amount
	 */
	Scan.prototype.scaleFactor = function(f) {
		var x, y;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					this.points[x + y * this.width].multiplyScalar(f);
				}
			}
		}
	};

	/*
	 * Constrains the visible points to a given cube area
	 */
	Scan.prototype.constrainPoints = function(xMin, xMax, yMin, yMax, zMin, zMax) {
		var x, y, pixel, point;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.visible[pixel]) {
						point = this.points[pixel];

						if (point.x < xMin || point.x > xMax || point.y < yMin || point.y > yMax || point.z < zMin
								|| point.z > zMax) {
							this.visible[pixel] = false;
						}
					}
				}
			}
		}
	};

	/*
	 * Resets any constrains on the points visibility
	 */
	Scan.prototype.resetVisiblePoints = function() {
		var x, y, pixel;

		for (y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for (x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel]) {
						this.visible[pixel] = true;
					}
				}
			}
		}
	};

	/*
	 * Fill the scan holes
	 */
	Scan.prototype.fillHoles = function(maxHoles) {
		var x, y, start, finish, i, step, deltaPos, deltaR, deltaG, deltaB, visible;

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
							visible = this.visible[start] && this.visible[finish];

							for (i = start + 1; i < finish; i++) {
								this.points[i] = new THREE.Vector3().addVectors(this.points[i - 1], deltaPos);
								this.colors[i] = new THREE.Color(this.colors[i - 1].r + deltaR, this.colors[i - 1].g
										+ deltaG, this.colors[i - 1].b + deltaB);
								this.visible[i] = visible;
							}
						}
					}
				}
			}
		}

		// Update the other scan properties
		this.calculatePointsOrder();
		this.findCentralPixel();
	};

	/*
	 * Smooth the scan using a Gaussian kernel
	 */
	Scan.prototype.gaussianSmooth = function(n) {
		if (n > 0) {
			var m, row, i, j, distSq, smPoints, x, y;
			var pixel, center, point, counter, pointNearby;

			// Create the Gaussian kernel
			m = [];

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

				m.push(row);
			}

			// Populate the array with the smoothed points
			smPoints = [];

			for (y = 0; y < this.height; y++) {
				for (x = 0; x < this.width; x++) {
					pixel = x + y * this.width;
					smPoints[pixel] = undefined;
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
										point.add(pointNearby.clone().multiplyScalar(m[i + n][j + n]));
										counter += m[i + n][j + n];
									}
								}
							}
						}

						if (counter > 0) {
							smPoints[pixel] = point.divideScalar(counter);
						}
					}
				}
			}

			// Update the scan
			this.points = smPoints;
			this.findCentralPixel();
		}
	};

	/*
	 * Creates the scan mesh
	 */
	Scan.prototype.createMesh = function(filled) {
		var vertices, faces, counter, i, x, y, xStart, xEnd;
		var pixel1, pixel2, pixel3, pixel4, p1, p2, p3, p4, geometry, material;

		// Prepare the vertices
		vertices = [];
		counter = 0;

		for (i = 0; i < this.points.length; i++) {
			if (this.points[i]) {
				vertices[counter] = this.points[i];
				counter++;
			}
		}

		// Prepare the faces
		faces = [];
		counter = 0;

		for (y = 0; y < this.height - 1; y++) {
			if (!this.empty[y] && !this.empty[y + 1]) {
				xStart = Math.min(this.ini[y], this.ini[y + 1]);
				xEnd = Math.max(this.end[y], this.end[y + 1]);

				for (x = xStart; x < xEnd; x++) {
					pixel1 = x + y * this.width;
					pixel2 = pixel1 + 1;
					pixel3 = pixel2 + this.width;
					pixel4 = pixel1 + this.width;
					p1 = this.points[pixel1];
					p2 = this.points[pixel2];
					p3 = this.points[pixel3];
					p4 = this.points[pixel4];

					// First triangle
					if (this.visible[pixel1] && this.visible[pixel4] && p1.distanceToSquared(p4) < this.maxSeparationSq) {
						if (this.visible[pixel2] && p1.distanceToSquared(p2) < this.maxSeparationSq
								&& p4.distanceToSquared(p2) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel2], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel2],
									this.colors[pixel4] ];
							counter++;
						} else if (this.visible[pixel3] && p1.distanceToSquared(p3) < this.maxSeparationSq
								&& p4.distanceToSquared(p3) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel3], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel3],
									this.colors[pixel4] ];
							counter++;
						}
					}

					// Second triangle
					if (this.visible[pixel2] && this.visible[pixel3] && p2.distanceToSquared(p3) < this.maxSeparationSq) {
						if (this.visible[pixel4] && p2.distanceToSquared(p4) < this.maxSeparationSq
								&& p3.distanceToSquared(p4) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(this.order[pixel2], this.order[pixel3], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel2], this.colors[pixel3],
									this.colors[pixel4] ];
							counter++;
						} else if (this.visible[pixel1] && p2.distanceToSquared(p1) < this.maxSeparationSq
								&& p3.distanceToSquared(p1) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel2], this.order[pixel3]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel2],
									this.colors[pixel3] ];
							counter++;
						}
					}
				}
			}
		}

		// Define the mesh geometry
		geometry = new THREE.Geometry();
		geometry.faces = faces;
		geometry.vertices = vertices;

		// Define the mesh material
		material = new THREE.MeshBasicMaterial({
			vertexColors : THREE.VertexColors,
			side : THREE.DoubleSide,
		});

		// Create the mesh
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.material.wireframe = !filled;
	};

	/*
	 * Updates the scan mesh
	 */
	Scan.prototype.updateMesh = function(filled) {
		var vertices, faces, counter, i, x, y, xStart, xEnd;
		var pixel1, pixel2, pixel3, pixel4, p1, p2, p3, p4;

		// Prepare the vertices
		vertices = this.mesh.geometry.vertices;
		counter = 0;

		for (i = 0; i < this.points.length; i++) {
			if (this.points[i]) {
				vertices[counter] = this.points[i];
				counter++;
			}
		}

		this.mesh.geometry.vertices = vertices;

		// Prepare the faces
		faces = this.mesh.geometry.faces;
		counter = 0;

		for (y = 0; y < this.height - 1; y++) {
			if (!this.empty[y] && !this.empty[y + 1]) {
				xStart = Math.min(this.ini[y], this.ini[y + 1]);
				xEnd = Math.max(this.end[y], this.end[y + 1]);

				for (x = xStart; x < xEnd; x++) {
					pixel1 = x + y * this.width;
					pixel2 = pixel1 + 1;
					pixel3 = pixel2 + this.width;
					pixel4 = pixel1 + this.width;
					p1 = this.points[pixel1];
					p2 = this.points[pixel2];
					p3 = this.points[pixel3];
					p4 = this.points[pixel4];

					// First triangle
					if (this.visible[pixel1] && this.visible[pixel4] && p1.distanceToSquared(p4) < this.maxSeparationSq) {
						if (this.visible[pixel2] && p1.distanceToSquared(p2) < this.maxSeparationSq
								&& p4.distanceToSquared(p2) < this.maxSeparationSq) {
							if (!vertices[this.order[pixel1]]) {
								console.log("problem!!");
							}
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel2], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel2],
									this.colors[pixel4] ];
							counter++;
						} else if (this.visible[pixel3] && p1.distanceToSquared(p3) < this.maxSeparationSq
								&& p4.distanceToSquared(p3) < this.maxSeparationSq) {
							if (!vertices[this.order[pixel1]]) {
								console.log("problem!!");
							}
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel3], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel3],
									this.colors[pixel4] ];
							counter++;
						}
					}

					// Second triangle
					if (this.visible[pixel2] && this.visible[pixel3] && p2.distanceToSquared(p3) < this.maxSeparationSq) {
						if (this.visible[pixel4] && p2.distanceToSquared(p4) < this.maxSeparationSq
								&& p3.distanceToSquared(p4) < this.maxSeparationSq) {
							if (!vertices[this.order[pixel2]]) {
								console.log("problem!!");
							}
							faces[counter] = new THREE.Face3(this.order[pixel2], this.order[pixel3], this.order[pixel4]);
							faces[counter].vertexColors = [ this.colors[pixel2], this.colors[pixel3],
									this.colors[pixel4] ];
							counter++;
						} else if (this.visible[pixel1] && p2.distanceToSquared(p1) < this.maxSeparationSq
								&& p3.distanceToSquared(p1) < this.maxSeparationSq) {
							if (!vertices[this.order[pixel1]]) {
								console.log("problem!!");
							}
							faces[counter] = new THREE.Face3(this.order[pixel1], this.order[pixel2], this.order[pixel3]);
							faces[counter].vertexColors = [ this.colors[pixel1], this.colors[pixel2],
									this.colors[pixel3] ];
							counter++;
						}
					}
				}
			}
		}

		// Remove the unused faces
		if (counter < faces.length) {
			faces.splice(counter, Number.MAX_VALUE);
		}

		this.mesh.geometry.faces = faces;

		// Indicate that the mesh geometry information has been updated
		this.mesh.geometry.verticesNeedUpdate = true;
		this.mesh.geometry.elementsNeedUpdate = true;
		this.mesh.geometry.colorsNeedUpdate = true;
	};

	/*
	 * Creates the scan point cloud
	 */
	Scan.prototype.createPointCloud = function(size) {
		var vertices, colors, counter, i, geometry, material;

		// Prepare the vertices and colors
		vertices = [];
		colors = [];
		counter = 0;

		for (i = 0; i < this.points.length; i++) {
			if (this.visible[i]) {
				vertices[counter] = this.points[i];
				colors[counter] = this.colors[i];
				counter++;
			}
		}

		// Define the points geometry
		geometry = new THREE.Geometry();
		geometry.vertices = vertices;
		geometry.colors = colors;

		// Define the points material
		material = new THREE.PointCloudMaterial({
			size : size,
			vertexColors : true,
		});

		// Create the point cloud
		this.pointCloud = new THREE.PointCloud(geometry, material);
	};
}