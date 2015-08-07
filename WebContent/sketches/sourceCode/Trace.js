/*
 * The Circle class
 */
function Circle(point1, point2, refPoint, refNormal, radius, sides) {
	var c, intersection, perpPoint, deltaAng;

	// The class properties
	this.center = new THREE.Vector3().addVectors(point2, point1).divideScalar(2);
	this.normal = new THREE.Vector3().subVectors(point2, point1).normalize();
	this.points = [];

	// Calculate the intersection between the reference line and the plane defined by the circle
	c = (new THREE.Vector3().subVectors(this.center, refPoint).dot(this.normal)) / refNormal.dot(this.normal);
	intersection = new THREE.Vector3().copy(refNormal).multiplyScalar(c).add(refPoint);

	// Calculate the circle points
	perpPoint = new THREE.Vector3().subVectors(intersection, this.center).setLength(radius);
	deltaAng = 2 * Math.PI / sides;

	for (i = 0; i < sides; i++) {
		this.points[i] = new THREE.Vector3().addVectors(this.center, perpPoint);
		perpPoint.applyAxisAngle(this.normal, deltaAng);
	}
}

/*
 * The Trace class
 */
function Trace() {
	this.points = [];
	this.mesh = undefined;
}

/*
 * Initializes the trace from a file
 */
Trace.prototype.initFromFile = function(fileData) {
	var rows, i, point;

	// Split the file data into rows
	rows = fileData.split("\n");

	// Add the points to the trace
	this.points = [];

	for (i = 0; i < rows.length; i++) {
		point = rows[i].split(" ");
		this.points[i] = new THREE.Vector3(parseFloat(point[0]), parseFloat(point[1]), parseFloat(point[2]));
	}
};

/*
 * Moves the trace center to the origin
 */
Trace.prototype.center = function() {
	var center, i;

	if (this.points.length > 0) {
		// Calculate the trace center
		center = new THREE.Vector3();

		for (i = 0; i < this.points.length; i++) {
			center.add(this.points[i]);
		}

		center.divideScalar(this.points.length);

		// Subtract the center to the points
		for (i = 0; i < this.points.length; i++) {
			this.points[i].sub(center);
		}
	}
};

/*
 * Increases or decreases the trace size
 */
Trace.prototype.scale = function(factor) {
	for (var i = 0; i < this.points.length; i++) {
		this.points[i].multiplyScalar(factor);
	}
};

/*
 * Calculates the circles that form the trace
 */
Trace.prototype.calculateCircles = function(tightness, subdivissions, radius, sides) {
	var spline, i, point, vertices, circles, refPoint, refNormal;

	// We need at least 3 points to calculate the spline
	if (this.points.length > 2) {
		// Create the spline and add the trace points to it
		spline = new toxi.geom.Spline3D();
		spline.setTightness(tightness);

		for (i = 0; i < this.points.length; i++) {
			point = this.points[i];
			spline.add(new toxi.geom.Vec3D(point.x, point.y, point.z));
		}

		// Calculate the spline vertices
		vertices = spline.computeVertices(subdivissions);

		// Calculate the trace circles
		circles = [];
		refPoint = new THREE.Vector3();
		refNormal = new THREE.Vector3().subVectors(vertices[1], vertices[0]).normalize();

		for (i = 0; i < vertices.length - 1; i++) {
			circles[i] = new Circle(vertices[i], vertices[i + 1], refPoint, refNormal, radius, sides);
			refPoint.copy(circles[i].points[0]);
			refNormal.copy(circles[i].normal);
		}

		return circles;
	} else {
		return [];
	}
};

/*
 * Creates the trace mesh
 */
Trace.prototype.createMesh = function(tightness, subdivissions, radius, sides, color, flatShading, showLines) {
	var circles, vertices, i, j, circlePoints, faces, pos, geometry, material;

	// Calculate the trace circles
	circles = this.calculateCircles(tightness, subdivissions, radius, sides);

	if (circles.length > 0) {
		// Fill the vertices array
		vertices = [];

		for (i = 0; i < circles.length; i++) {
			circlePoints = circles[i].points;

			for (j = 0; j < circlePoints.length; j++) {
				vertices.push(circlePoints[j]);
			}
		}

		// Add the centers of the trace sides
		vertices.push(circles[0].center);
		vertices.push(circles[circles.length - 1].center);

		// Fill the faces array
		faces = [];

		for (i = 0; i < circles.length - 1; i++) {
			// Add the back side
			if (i === 0) {
				pos = vertices.length - 2;

				for (j = 0; j < sides - 1; j++) {
					faces.push(new THREE.Face3(pos, j + 1, j));
				}

				faces.push(new THREE.Face3(pos, 0, sides - 1));
			}

			// Add the faces between two consecutive circles
			for (j = 0; j < sides - 1; j++) {
				pos = i * sides + j;
				faces.push(new THREE.Face3(pos, pos + 1, pos + sides));
				faces.push(new THREE.Face3(pos + 1, pos + 1 + sides, pos + sides));
			}

			pos = i * sides + sides - 1;
			faces.push(new THREE.Face3(pos, pos - (sides - 1), pos + sides));
			faces.push(new THREE.Face3(pos - (sides - 1), pos - (sides - 1) + sides, pos + sides));

			// Add the front
			if (i == circles.length - 2) {
				pos = vertices.length - 1;

				for (j = 0; j < sides - 1; j++) {
					faces.push(new THREE.Face3(pos, (i + 1) * sides + j, (i + 1) * sides + j + 1));
				}

				faces.push(new THREE.Face3(pos, (i + 1) * sides + sides - 1, (i + 1) * sides));
			}
		}

		// Define the mesh geometry
		geometry = new THREE.Geometry();
		geometry.vertices = vertices;
		geometry.faces = faces;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		// Define the mesh material
		material = new THREE.MeshLambertMaterial({
			color : new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255),
			shading : flatShading ? THREE.FlatShading : THREE.SmoothShading,
			wireframe : showLines,
			side : THREE.FrontSide
		});

		// Create the trace mesh
		this.mesh = new THREE.Mesh(geometry, material);
	} else {
		this.mesh = undefined;
	}
};
