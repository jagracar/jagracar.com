/*
 * The Scan class
 * 
 * This class can be used to load, manipulate and display scans taken with the Kinect 3D scanner
 * http://www.openprocessing.org/sketch/78606
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
	this.maxSeparationSq = Math.pow(160, 2);
}

/*
 * Clones the current scan
 */
Scan.prototype.clone = function() {
	var scanClone, i;

	scanClone = new Scan();

	if (this.width !== 0 || this.height !== 0) {
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
};

/*
 * Initialize the scan from a file
 */
Scan.prototype.initFromFile = function(fileData) {
	var scanLines, dimensions, x, y, pixel, pointData;

	// Split the data in lines
	scanLines = fileData.split("\n");

	// Get the scan dimensions
	dimensions = scanLines[0].split(" ");
	this.width = parseInt(dimensions[0], 10);
	this.height = parseInt(dimensions[1], 10);

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
				this.colors[pixel] = new THREE.Color(parseFloat(pointData[3]) / 255, parseFloat(pointData[4]) / 255,
						parseFloat(pointData[5]) / 255);

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

					if (x - 1 >= 0 && y + 1 < this.height && this.points[pixel - 1] && this.points[pixel + this.width]) {
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

					if (x + 1 < this.width && y - 1 >= 0 && this.points[pixel + 1] && this.points[pixel - this.width]) {
						v1.subVectors(this.points[pixel - this.width], this.points[pixel]);
						v2.subVectors(this.points[pixel + 1], this.points[pixel]);
						perp.crossVectors(v1, v2).normalize();
						averageNormal.add(perp);
						counter++;
					}

					if (counter > 0) {
						this.normals[pixel] = averageNormal.normalize();
					} else {
						// Set a default normal value
						this.normals[pixel] = averageNormal.set(0, 0, -1);
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
 * Gets the pixel that is closer to the origin
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
		delta = Math.min(Math.floor(n / 2), 2);

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
 * Shifts the scan position by the given vector
 */
Scan.prototype.shift = function(v) {
	var x, y, pixel;

	// Populate the array
	for (y = 0; y < this.height; y++) {
		if (!this.empty[y]) {
			for (x = this.ini[y]; x <= this.end[y]; x++) {
				pixel = x + y * this.width;

				if (this.points[pixel]) {
					this.points[pixel].add(v);
				}
			}
		}
	}
};

/*
 * Creates the scan point cloud
 */
Scan.prototype.createPointCloud = function(vertexShader, fragmentShader, canvas) {
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
	material = this.createShaderMaterial(vertexShader, fragmentShader, canvas, verticesColors, verticesNormals);

	// Create the point cloud
	this.pointCloud = new THREE.PointCloud(geometry, material);
};

/*
 * Creates the scan mesh
 */
Scan.prototype.createMesh = function(vertexShader, fragmentShader, canvas) {
	var vertices, verticesColors, verticesNormals, order, counter, x, y, pixel, faces, faceNormal, barycentricCoord;
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

	// Calculate the faces, the faces normal and the barycentric coordinates
	faces = [];
	faceNormal = [];
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
						this.addFace(pixel1, pixel2, pixel4, order, faces, faceNormal, barycentricCoord);
					} else if (this.points[pixel3]) {
						this.addFace(pixel1, pixel3, pixel4, order, faces, faceNormal, barycentricCoord);
					}
				}

				// Second triangle
				if (this.points[pixel2] && this.points[pixel3]) {
					if (this.points[pixel4]) {
						this.addFace(pixel2, pixel3, pixel4, order, faces, faceNormal, barycentricCoord);
					} else if (this.points[pixel1]) {
						this.addFace(pixel1, pixel2, pixel3, order, faces, faceNormal, barycentricCoord);
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
	frontMaterial = this.createShaderMaterial(vertexShader, fragmentShader, canvas, verticesColors, verticesNormals,
			faceNormal, barycentricCoord, false);
	backMaterial = this.createShaderMaterial(vertexShader, fragmentShader, canvas, verticesColors, verticesNormals,
			faceNormal, barycentricCoord, true);

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
 * Adds a face to the faces, faceNormal and barycentricCoord arrays
 */
Scan.prototype.addFace = function(pixel1, pixel2, pixel3, order, faces, faceNormal, barycentricCoord) {
	var p1, p2, p3, v1, v2, perp;

	p1 = this.points[pixel1];
	p2 = this.points[pixel2];
	p3 = this.points[pixel3];

	if (p1.distanceToSquared(p2) < this.maxSeparationSq && p1.distanceToSquared(p3) < this.maxSeparationSq
			&& p2.distanceToSquared(p3) < this.maxSeparationSq) {
		// Add the face
		faces.push(new THREE.Face3(order[pixel1], order[pixel2], order[pixel3]));

		// Add the face normal
		v1 = new THREE.Vector3().subVectors(p2, p1);
		v2 = new THREE.Vector3().subVectors(p3, p1);
		perp = new THREE.Vector3().crossVectors(v1, v2).normalize();
		faceNormal.push([ perp, perp, perp ]);

		// Add the barycentric coordinates
		barycentricCoord.push([ new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1) ]);
	}
};

/*
 * Creates the appropriate scan shader material
 */
Scan.prototype.createShaderMaterial = function(vertexShader, fragmentShader, canvas, verticesColors, verticesNormals,
		faceNormal, barycentricCoord, backScan) {
	var pointMaterial, attributes, uniforms, texture, material;

	// The faceNormal array is not defined for point materials
	pointMaterial = faceNormal ? false : true;

	// Define the fragment attributes
	attributes = {};

	attributes.aColor = {
		type : 'c',
		value : verticesColors
	};

	attributes.aNormal = {
		type : 'v3',
		value : verticesNormals
	};

	if (!pointMaterial) {
		attributes.aFaceNormal = {
			type : 'v3',
			boundTo : 'faceVertices',
			value : faceNormal
		};

		attributes.aBarycentricCoord = {
			type : 'v3',
			boundTo : 'faceVertices',
			value : barycentricCoord
		};
	}

	// Define the fragment uniforms
	uniforms = {};

	uniforms.pointCloud = {
		type : 'i',
		value : pointMaterial
	};

	uniforms.backScan = {
		type : 'i',
		value : pointMaterial ? 0 : backScan
	};

	uniforms.backColor = {
		type : 'c',
		value : new THREE.Color(1, 1, 1)
	};

	uniforms.showLines = {
		type : 'i',
		value : 0
	};

	uniforms.pointSize = {
		type : 'f',
		value : 2
	};

	uniforms.effect = {
		type : 'i',
		value : 0
	};

	uniforms.invertEffect = {
		type : 'i',
		value : 0
	};

	uniforms.fillWithColor = {
		type : 'i',
		value : 0
	};

	uniforms.effectColor = {
		type : 'c',
		value : new THREE.Color(1, 1, 1)
	};

	uniforms.effectTransparency = {
		type : 'f',
		value : 1
	};

	uniforms.lightPosition = {
		type : 'v3',
		value : new THREE.Vector3(0)
	};

	uniforms.cursor = {
		type : 'v3',
		value : new THREE.Vector2(0)
	};

	uniforms.time = {
		type : 'f',
		value : 0
	};

	// Add the mask texture uniform if the canvas is defined
	if (canvas) {
		texture = new THREE.Texture();
		texture.image = canvas.elt;
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;

		uniforms.mask = {
			type : 't',
			value : texture
		};
	}

	// Create the shader material
	material = new THREE.ShaderMaterial({
		attributes : attributes,
		uniforms : uniforms,
		vertexShader : vertexShader,
		fragmentShader : fragmentShader,
		side : pointMaterial ? THREE.DoubleSide : backScan ? THREE.BackSide : THREE.FrontSide,
		transparent : true
	});

	return material;
};
