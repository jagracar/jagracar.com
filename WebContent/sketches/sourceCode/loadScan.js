function runSketch() {
	var scene, renderer, camera, controls, spotLight, ambientLight;

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
		renderer.setClearColor(new THREE.Color(0.98, 0.98, 0.98));

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);
		camera.position.set(0, 0, -500);
		camera.lookAt(scene.position);

		// Add the spot light
		spotLight = new THREE.SpotLight(0xffffff);
		scene.add(spotLight);

		// Add the ambient light
		ambientLight = new THREE.AmbientLight(0x0c0c0c);
		scene.add(ambientLight);

		// Read the scan
		readScan("data/scan1.points");

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Add the controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);
	}

	function animate() {
		controls.update();
		spotLight.position.set(camera.position.x,camera.position.y, camera.position.z);

		requestAnimationFrame(animate);
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
		var scan = new Scan();
		scan.initFromFile(this.responseText);
		scan.fillHoles(4);
		scan.reduceResolution(2);
		scan.gaussianSmooth(1);
		scan.crop();
		scan.centerAndExtend();

		// Create the scan mesh and the point cloud
		scan.createMesh(true);
		scan.createPointCloud(4);

		// Add the mesh to the scene
		//scene.remove(scan.mesh);
		scene.add(scan.pointCloud);
		//scene.remove(scan.pointCloud);
		//scene.add(scan.frontMesh);
		//scene.add(scan.backMesh);
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
		this.normals = undefined;
		this.empty = undefined;
		this.ini = undefined;
		this.end = undefined;
		this.centralPixel = undefined;
		this.centralPosition = undefined;
		this.frontMesh = undefined;
		this.backMesh = undefined;
		this.pointCloud = undefined;
		this.maxSeparationSq = 100 * 100;
	}

	/*
	 * Initialize the scan from a file
	 */
	Scan.prototype.initFromFile = function(fileData) {
		var scanLines, dimensions, i, pointData;

		// Split the data in lines
		scanLines = fileData.split("\n");

		// Get the scan dimensions
		dimensions = scanLines[0].split(" ");
		this.width = parseInt(dimensions[0]);
		this.height = parseInt(dimensions[1]);

		// Fill the scan arrays
		this.points = [];
		this.colors = [];
		this.visible = [];

		for ( i = 1; i < scanLines.length; i++) {
			pointData = scanLines[i].split(" ");

			if (pointData[3] >= 0) {
				this.points[i] = new THREE.Vector3(parseFloat(pointData[0]), parseFloat(pointData[1]), parseFloat(pointData[2]));
				this.colors[i] = new THREE.Color(parseFloat(pointData[3]) / 255, parseFloat(pointData[4]) / 255, parseFloat(pointData[5]) / 255);
				this.visible[i] = true;
			} else {
				this.points[i] = undefined;
				this.colors[i] = undefined;
				this.visible[i] = undefined;
			}
		}

		// Find the scan extremes
		this.findExtremes();

		// Calculate the scan central pixel
		this.findCentralPixel();

		// Calculate the point normals
		this.calculatePointNormals();
	};

	/*
	 * Finds the scan extremes
	 */
	Scan.prototype.findExtremes = function() {
		var x, y;

		// Fill the extremes arrays
		this.ini = [];
		this.end = [];
		this.empty = [];

		for ( y = 0; y < this.height; y++) {
			this.ini[y] = undefined;
			this.end[y] = undefined;
			this.empty[y] = true;

			for ( x = 0; x < this.width; x++) {
				if (this.points[x + y * this.width]) {
					if (this.empty[y]) {
						this.ini[y] = x;
						this.empty[y] = false;
					}

					this.end[y] = x;
				}
			}
		}
	};

	/*
	 * Finds the point and the pixel closer to the center
	 */
	Scan.prototype.findCentralPixel = function() {
		var minDistanceSq, distanceSq, x, y, point;
		this.centralPixel = [];
		this.centralPosition = new THREE.Vector3();
		minDistanceSq = Number.MAX_VALUE;

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
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
	 * Calculates the point normals
	 */
	Scan.prototype.calculatePointNormals = function() {
		var averageNormal, v1, v2, perp, x, y, pixel, counter;
		averageNormal = new THREE.Vector3();
		v1 = new THREE.Vector3();
		v2 = new THREE.Vector3();
		perp = new THREE.Vector3();

		this.normals = [];
		for ( i = 0; i < this.width * this.height; i++) {
			this.normals[i] = undefined;
		}

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel]) {
						averageNormal.set(0, 0, 0);
						counter = 0;

						if (x + 1 < this.width && y + 1 < this.height && this.points[pixel + 1] && this.points[pixel + this.width]) {
							v1.subVectors(this.points[pixel + 1], this.points[pixel]);
							v2.subVectors(this.points[pixel + this.width], this.points[pixel]);
							perp.crossVectors(v1, v2);
							perp.normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x - 1 >= 0 && y + 1 < this.height && this.points[pixel - 1] && this.points[pixel + this.width]) {
							v1.subVectors(this.points[pixel + this.width], this.points[pixel]);
							v2.subVectors(this.points[pixel - 1], this.points[pixel]);
							perp.crossVectors(v1, v2);
							perp.normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x - 1 >= 0 && y - 1 >= 0 && this.points[pixel - 1] && this.points[pixel - this.width]) {
							v1.subVectors(this.points[pixel - 1], this.points[pixel]);
							v2.subVectors(this.points[pixel - this.width], this.points[pixel]);
							perp.crossVectors(v1, v2);
							perp.normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (x + 1 < this.width && y - 1 >= 0 && this.points[pixel + 1] && this.points[pixel - this.width]) {
							v1.subVectors(this.points[pixel - this.width], this.points[pixel]);
							v2.subVectors(this.points[pixel + 1], this.points[pixel]);
							perp.crossVectors(v1, v2);
							perp.normalize();
							averageNormal.add(perp);
							counter++;
						}

						if (counter > 0) {
							this.normals[pixel] = averageNormal.divideScalar(counter).clone();
						} else {
							this.normals[pixel] = averageNormal.clone();
						}
					} else {
						this.normals[pixel] = undefined;
					}
				}
			}
		}
	};

	/*
	 * Extends the dimensions of the scan to center it
	 */
	Scan.prototype.centerAndExtend = function() {
		var widthExt, heightExt, pointsExt, colorsExt, visibleExt, i;
		var xStart, yStart, x, y, pixel, pixelExt;

		// Calculate the dimensions of the extended scan
		widthExt = 2 * Math.max(this.centralPixel[0], this.width - 1 - this.centralPixel[0]) + 1;
		heightExt = 2 * Math.max(this.centralPixel[1], this.height - 1 - this.centralPixel[1]) + 1;

		// Prepare the arrays
		pointsExt = [];
		colorsExt = [];
		visibleExt = [];

		for ( i = 0; i < widthExt * heightExt; i++) {
			pointsExt[i] = undefined;
			colorsExt[i] = undefined;
			visibleExt[i] = undefined;
		}

		// Populate the arrays
		if (this.centralPixel[0] > (this.width - 1 - this.centralPixel[0])) {
			xStart = 0;
		} else {
			xStart = widthExt - this.width;
		}

		if (this.centralPixel[1] > (this.height - 1 - this.centralPixel[1])) {
			yStart = 0;
		} else {
			yStart = heightExt - this.height;
		}

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;
					pixelExt = (xStart + x) + (yStart + y) * widthExt;
					pointsExt[pixelExt] = this.points[pixel];
					colorsExt[pixelExt] = this.colors[pixel];
					visibleExt[pixelExt] = this.visible[pixel];
				}
			}
		}

		// Update the scan to the new properties
		this.width = widthExt;
		this.height = heightExt;
		this.points = pointsExt;
		this.colors = colorsExt;
		this.visible = visibleExt;
		this.findExtremes();
		this.findCentralPixel();
		this.calculatePointNormals();
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

			for ( i = 0; i < widthExt * heightExt; i++) {
				pointsExt[i] = undefined;
				colorsExt[i] = undefined;
				visibleExt[i] = undefined;
			}

			// Populate the arrays
			xStart = Math.floor((widthExt - this.width) / 2);
			yStart = Math.floor((heightExt - this.height) / 2);

			for ( y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for ( x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						pixelExt = (xStart + x) + (yStart + y) * widthExt;
						pointsExt[pixelExt] = this.points[pixel];
						colorsExt[pixelExt] = this.colors[pixel];
						visibleExt[pixelExt] = this.visible[pixel];
					}
				}
			}

			// Update the scan to the new properties
			this.width = widthExt;
			this.height = heightExt;
			this.points = pointsExt;
			this.colors = colorsExt;
			this.visible = visibleExt;
			this.findExtremes();
			this.findCentralPixel();
			this.calculatePointNormals();
		}
	};

	/*
	 * Crops the scan to the area with valid points
	 */
	Scan.prototype.crop = function() {
		var xIni, xEnd, yIni, yEnd, x, y, widthCrop, heightCrop;
		var pointsCrop, colorsCrop, visibleCrop, i, pixel, pixelCrop;

		// Calculate the region in the scan with the valid data
		xIni = Number.MAX_VALUE;
		xEnd = -xIni;
		yIni = xIni;
		yEnd = -xIni;

		for ( y = 0; y < this.width; y++) {
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

			for ( i = 0; i < widthCrop * heightCrop; i++) {
				pointsCrop[i] = undefined;
				colorsCrop[i] = undefined;
				visibleCrop[i] = undefined;
			}

			// Populate the arrays
			for ( y = 0; y < heightCrop; y++) {
				for ( x = 0; x < widthCrop; x++) {
					pixelCrop = x + y * widthCrop;
					pixel = (xIni + x) + (yIni + y) * this.width;
					pointsCrop[pixelCrop] = this.points[pixel];
					colorsCrop[pixelCrop] = this.colors[pixel];
					visibleCrop[pixelCrop] = this.visible[pixel];
				}
			}

			// Update the scan to the new properties
			this.width = widthCrop;
			this.height = heightCrop;
			this.points = pointsCrop;
			this.colors = colorsCrop;
			this.visible = visibleCrop;
			this.findExtremes();
			this.findCentralPixel();
			this.calculatePointNormals();
		}
	};

	/*
	 * Reduces the scan resolution
	 */
	Scan.prototype.reduceResolution = function(n) {
		// Make sure the reduction factor is an integer
		n = Math.round(n);

		if (n >= 2) {
			var widthRed, heightRed, pointsRed, colorsRed, visibleRed, i, x, y, delta;
			var point, r, g, b, counter, visible, j, xNearby, yNearby, pixelNearby, pixelRed;

			// Dimensions of the reduced scan
			widthRed = Math.ceil(this.width / n);
			heightRed = Math.ceil(this.height / n);

			// Prepare the arrays
			pointsRed = [];
			colorsRed = [];
			visibleRed = [];

			for ( i = 0; i < widthRed * heightRed; i++) {
				pointsRed[i] = undefined;
				colorsRed[i] = undefined;
				visibleRed[i] = undefined;
			}

			// Populate the arrays
			for ( y = 0; y < heightRed; y++) {
				for ( x = 0; x < widthRed; x++) {
					// Average between nearby pixels
					delta = Math.floor(n / 2);
					point = new THREE.Vector3();
					r = 0;
					g = 0;
					b = 0;
					visible = false;
					counter = 0;

					for ( i = -delta; i <= delta; i++) {
						for ( j = -delta; j <= delta; j++) {
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
						pixelRed = x + y * widthRed;
						pointsRed[pixelRed] = point.divideScalar(counter);
						colorsRed[pixelRed] = new THREE.Color(r / counter, g / counter, b / counter);
						visibleRed[pixelRed] = visible;
					}
				}
			}

			// Update the scan to the new properties
			this.width = widthRed;
			this.height = heightRed;
			this.points = pointsRed;
			this.colors = colorsRed;
			this.visible = visibleRed;
			this.findExtremes();
			this.findCentralPixel();
			this.calculatePointNormals();
		}
	};

	/*
	 * Scales the scan by a given amount
	 */
	Scan.prototype.scaleFactor = function(f) {
		var x, y;

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					this.points[x + y * this.width].multiplyScalar(f);
				}
			}
		}
	};

	/*
	 * Constrains the visible points to a given cube region
	 */
	Scan.prototype.constrainPoints = function(xMin, xMax, yMin, yMax, zMin, zMax) {
		var x, y, pixel, point;

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					// Check only those points that are still visible
					pixel = x + y * this.width;
					point = this.points[pixel];

					if (point && this.visible[pixel]) {
						if (point.x < xMin || point.x > xMax || point.y < yMin || point.y > yMax || point.z < zMin || point.z > zMax) {
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

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel]) {
						this.visible[pixel] = true;
					}
				}
			}
		}
	};

	/*
	 * Fills the scan holes
	 */
	Scan.prototype.fillHoles = function(maxHoles) {
		var x, y, start, finish, i, step, deltaPos, deltaR, deltaG, deltaB, visible;

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				// Find holes in the line
				for ( x = this.ini[y] + 1; x < this.end[y]; x++) {
					if (!this.points[x + y * this.width]) {
						// Calculate the limits of the hole
						start = (x - 1) + y * this.width;
						finish = start;

						for ( i = x + 1; i <= this.end[y]; i++) {
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

							for ( i = start + 1; i < finish; i++) {
								this.points[i] = new THREE.Vector3().addVectors(this.points[i - 1], deltaPos);
								this.colors[i] = new THREE.Color(this.colors[i - 1].r + deltaR, this.colors[i - 1].g + deltaG, this.colors[i - 1].b + deltaB);
								this.visible[i] = visible;
							}
						}
					}
				}
			}
		}

		// Update the scan to the new properties
		this.findCentralPixel();
		this.calculatePointNormals();
	};

	/*
	 * Smoothes the scan using a Gaussian kernel
	 */
	Scan.prototype.gaussianSmooth = function(n) {
		// Make sure the smoothing factor is an integer
		n = Math.round(n);

		if (n > 0) {
			var kernel, row, i, j, distSq, pointsSm, x, y;
			var pixel, center, point, counter, pointNearby;

			// Create the Gaussian kernel
			kernel = [];

			for ( i = -n; i <= n; i++) {
				row = [];

				for ( j = -n; j <= n; j++) {
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

			for ( i = 0; i < this.width * this.height; i++) {
				pointsSm[i] = undefined;
			}

			// Populate the array
			for ( y = 0; y < this.height; y++) {
				if (!this.empty[y]) {
					for ( x = this.ini[y]; x <= this.end[y]; x++) {
						pixel = x + y * this.width;
						center = this.points[pixel];

						if (center) {
							// Average between nearby pixels
							point = new THREE.Vector3();
							counter = 0;

							for ( i = -n; i <= n; i++) {
								for ( j = -n; j <= n; j++) {
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
			this.findCentralPixel();
			this.calculatePointNormals();
		}
	};

	/*
	 * Creates the scan mesh
	 */
	Scan.prototype.createMesh = function(filled) {
		var order, i, frontVertices, backVertices, counter, x, y, pixel, faces, xStart, xEnd;
		var pixel1, pixel2, pixel3, pixel4, p1, p2, p3, p4, frontGeometry, backGeometry;
		var frontMaterial, backMaterial;

		// Prepare order array
		order = [];

		for ( i = 0; i < this.widht * this.height; i++) {
			order[i] = undefined;
		}

		// Calculate the vertices
		frontVertices = [];
		backVertices = [];
		counter = 0;

		for ( y = 0; y < this.height; y++) {
			if (!this.empty[y]) {
				for ( x = this.ini[y]; x <= this.end[y]; x++) {
					pixel = x + y * this.width;

					if (this.points[pixel] && this.visible[pixel]) {
						frontVertices[counter] = this.points[pixel];
						backVertices[counter] = frontVertices[counter].clone().sub(this.normals[pixel]);
						order[pixel] = counter;
						counter++;
					}
				}
			}
		}

		// Prepare the faces
		faces = [];
		counter = 0;

		for ( y = 0; y < this.height - 1; y++) {
			if (!this.empty[y] && !this.empty[y + 1]) {
				xStart = Math.min(this.ini[y], this.ini[y + 1]);
				xEnd = Math.max(this.end[y], this.end[y + 1]);

				for ( x = xStart; x < xEnd; x++) {
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
						if (this.visible[pixel2] && p1.distanceToSquared(p2) < this.maxSeparationSq && p4.distanceToSquared(p2) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(order[pixel1], order[pixel2], order[pixel4]);
							faces[counter].vertexColors = [this.colors[pixel1], this.colors[pixel2], this.colors[pixel4]];
							counter++;
						} else if (this.visible[pixel3] && p1.distanceToSquared(p3) < this.maxSeparationSq && p4.distanceToSquared(p3) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(order[pixel1], order[pixel3], order[pixel4]);
							faces[counter].vertexColors = [this.colors[pixel1], this.colors[pixel3], this.colors[pixel4]];
							counter++;
						}
					}

					// Second triangle
					if (this.visible[pixel2] && this.visible[pixel3] && p2.distanceToSquared(p3) < this.maxSeparationSq) {
						if (this.visible[pixel4] && p2.distanceToSquared(p4) < this.maxSeparationSq && p3.distanceToSquared(p4) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(order[pixel2], order[pixel3], order[pixel4]);
							faces[counter].vertexColors = [this.colors[pixel2], this.colors[pixel3], this.colors[pixel4]];
							counter++;
						} else if (this.visible[pixel1] && p2.distanceToSquared(p1) < this.maxSeparationSq && p3.distanceToSquared(p1) < this.maxSeparationSq) {
							faces[counter] = new THREE.Face3(order[pixel1], order[pixel2], order[pixel3]);
							faces[counter].vertexColors = [this.colors[pixel1], this.colors[pixel2], this.colors[pixel3]];
							counter++;
						}
					}
				}
			}
		}

		// Define the frontMesh geometry
		frontGeometry = new THREE.Geometry();
		frontGeometry.vertices = frontVertices;
		frontGeometry.faces = faces;
		frontGeometry.computeFaceNormals();
		frontGeometry.computeVertexNormals();

		// Define the backMesh geometry
		backGeometry = new THREE.Geometry();
		backGeometry.vertices = backVertices;
		backGeometry.faces = faces;
		backGeometry.computeFaceNormals();
		backGeometry.computeVertexNormals();

		// Define the frontMesh material
		frontMaterial = new THREE.MeshBasicMaterial({
			vertexColors : THREE.VertexColors,
			wireframe : !filled,
			side : THREE.FrontSide,
		});

		// Define the backMesh material
		backMaterial = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			wireframe : !filled,
			side : THREE.BackSide,
			shading : THREE.SmoothShading
		});

		// Create the meshes
		this.frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
		this.backMesh = new THREE.Mesh(backGeometry, backMaterial);
	};

	/*
	 * Creates the scan point cloud
	 */
	Scan.prototype.createPointCloud = function(pointSize) {
		var vertices, colors, counter, i, geometry, material;

		// Prepare the vertices and colors
		vertices = [];
		colors = [];
		counter = 0;

		for ( i = 0; i < this.points.length; i++) {
			if (this.points[i] && this.visible[i]) {
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
			size : pointSize,
			vertexColors : true,
		});

		// Create the point cloud
		this.pointCloud = new THREE.PointCloud(geometry, material);
	};
}