function runSketch() {
	var scene, renderer, camera, controls, clock, guiControlKeys, star;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var canvasWidth, canvasHeight, radius, position, rotationVelocity;
		var atmosphereSize, cellsSize, spotsSize, color, pulsationChange;

		// Scene setup
		scene = new THREE.Scene();

		// Set the optimal sketch dimensions
		canvasWidth = 500;
		canvasHeight = 400;

		// Get the WebGL renderer
		renderer = getWebGLRenderer(canvasWidth, canvasHeight);

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 500);
		camera.position.set(0, 0, 35);

		// Initialize the camera controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enablePan = false;
		controls.zoomSpeed = 0.7;
		controls.minDistance = 20;
		controls.maxDistance = 200;

		// Initialize the clock
		clock = new THREE.Clock(true);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Create the star
		radius = 8.0;
		position = new THREE.Vector3(0, 0, 0);
		rotationVelocity = guiControlKeys["Rotation velocity"];
		atmosphereSize = guiControlKeys["Atmosphere size"];
		cellsSize = guiControlKeys["Cells size"];
		spotsSize = guiControlKeys["Spots size"];
		color = new THREE.Color(guiControlKeys.Color[0] / 255, guiControlKeys.Color[1] / 255,
				guiControlKeys.Color[2] / 255);
		pulsationChange = guiControlKeys["Pulsation change"];
		star = new Star(radius, position, rotationVelocity);
		star.createMesh(color, atmosphereSize, cellsSize, spotsSize, pulsationChange);

		// Add the star mesh to the scene
		scene.add(star.mesh);
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		// Update the camera controls rotation speed
		controls.rotateSpeed = Math.min(0.15 * camera.position.length() / controls.minDistance, 2.0);

		// Update the star
		star.update(clock, camera);

		// Render the scene
		renderer.render(scene, camera);
	}

	/*
	 * Returns the webGL renderer
	 */
	function getWebGLRenderer(canvasWidth, canvasHeight) {
		var maxCanvasWidth, webGLRenderer;

		// Get the maximum possible size for the canvas
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		// Modify the specified canvas width and height if necessary
		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the webGL renderer with the correct dimensions
		webGLRenderer = new THREE.WebGLRenderer({
			antialias : true
		});
		webGLRenderer.setSize(canvasWidth, canvasHeight);
		webGLRenderer.setClearColor(new THREE.Color(0, 0, 0));

		return webGLRenderer;
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, controller, hueElements, i;

		// Initialize the control keys
		guiControlKeys = {
			"Rotation velocity" : 0.5,
			"Atmosphere size" : 0.2,
			"Cells size" : 0.15,
			"Spots size" : 1.0,
			"Pulsation change" : 0.15,
			"Color" : [ 255, 170, 20 ],
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});
		gui.close();

		// Add the GUI controllers
		controller = gui.add(guiControlKeys, "Rotation velocity", 0, 5);
		controller.onFinishChange(function(value) {
			star.rotationVelocity = value;
		});

		controller = gui.add(guiControlKeys, "Atmosphere size", 0, 1);
		controller.onFinishChange(function(value) {
			star.mesh.material.uniforms.atmRadius.value = 1 - value;
		});

		controller = gui.add(guiControlKeys, "Cells size", 0.05, 0.5);
		controller.onFinishChange(function(value) {
			star.mesh.material.uniforms.cellsSize.value = value;
		});

		controller = gui.add(guiControlKeys, "Spots size", 0.2, 2.0);
		controller.onFinishChange(function(value) {
			star.mesh.material.uniforms.spotsSize.value = value;
		});

		controller = gui.add(guiControlKeys, "Pulsation change", 0, 1);
		controller.onFinishChange(function(value) {
			star.mesh.material.uniforms.pulsation.value = value;
		});

		controller = gui.addColor(guiControlKeys, "Color");
		controller.onChange(function(value) {
			star.mesh.material.uniforms.color.value.setRGB(value[0] / 255, value[1] / 255, value[2] / 255);
		});

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);

		// Fix a bug with the dat.GUI hue color selector
		hueElements = document.getElementsByClassName("hue-field");

		for (i = 0; i < hueElements.length; i++) {
			hueElements[i].style.width = "10px";
		}
	}
}

/*
 * The Star class
 */
function Star(radius, position, rotationVelocity) {
	this.radius = radius;
	this.position = position;
	this.rotationVelocity = rotationVelocity;
	this.mesh = undefined;
}

//
// Creates the star mesh
//
Star.prototype.createMesh = function(color, atmosphereSize, cellsSize, spotsSize, pulsationChange) {
	var geometry, uniforms, material;

	// Create the geometry
	geometry = new THREE.SphereGeometry(this.radius, 64, 32);

	// Define the shader uniforms
	uniforms = {
		color : {
			type : 'c',
			value : color
		},
		radius : {
			type : 'f',
			value : this.radius
		},
		atmRadius : {
			type : 'f',
			value : 1 - atmosphereSize
		},
		cellsSize : {
			type : 'f',
			value : cellsSize
		},
		spotsSize : {
			type : 'f',
			value : spotsSize
		},
		pulsation : {
			type : 'f',
			value : pulsationChange
		},
		directionToCamera : {
			type : 'v3',
			value : new THREE.Vector3()
		},
		seed : {
			type : 'f',
			value : Math.random()
		},
		time : {
			type : 'f',
			value : 0
		}
	};

	// Create the shader material
	material = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : document.getElementById("vertexShader").textContent,
		fragmentShader : document.getElementById("fragmentShader").textContent,
		side : THREE.FrontSide,
		transparent : true
	});

	// Create the mesh
	this.mesh = new THREE.Mesh(geometry, material);

	// Rotate the mesh a bit
	this.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.3);

	// Move the mesh to the correct position
	this.mesh.position.copy(this.position);
};

//
// Updates the star coordinates
//
Star.prototype.update = function(clock, camera) {
	var deltaTime, elapsedTime;

	// Calculate the delta time and the elapsed time
	deltaTime = clock.getDelta();
	elapsedTime = clock.getElapsedTime();

	// Update the mesh
	if (this.mesh) {
		// Update the mesh position
		this.mesh.position.copy(this.position);

		// Rotate the mesh
		this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.rotationVelocity * deltaTime);

		// Update the mesh uniforms
		uniforms = this.mesh.material.uniforms;
		uniforms.directionToCamera.value.copy(this.position).applyMatrix4(camera.matrixWorldInverse).negate()
				.normalize();
		uniforms.time.value = 0.3 * elapsedTime;
	}
};
