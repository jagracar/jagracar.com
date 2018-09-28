function runSketch() {
	var backScene, frontScene, renderer, camera, controls, clock, backComposer, finalComposer, blackHolePass, guiControlKeys;
	var informationPanel, blackHole, stars, trajectories, sky, elapsedTime, textureFinishedLoading;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		// Scenes setup
		backScene = new THREE.Scene();
		frontScene = new THREE.Scene();

		// Add the WebGL renderer
		renderer = addWebGLRenderer(850,550);

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, renderer.getSize().width / renderer.getSize().height, 0.1, 2500);
		camera.position.set(0, 0, 50);
		camera.up.set(0, 1, 0);

		// Initialize the camera controls
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.noPan = true;
		controls.zoomSpeed = 1.0;
		controls.minDistance = 10;
		controls.maxDistance = 500;

		// Initialize the clock
		clock = new THREE.Clock(true);

		// Effect composers setup
		setupEffectComposers();

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Add the information panel
		informationPanel = document.createElement("p");
		informationPanel.className = infoClass;
		document.getElementById(sketchContainer).appendChild(informationPanel);

		// Create the black hole
		createBlackHole();

		// Load the stars properties from the file and create them
		loadStars("sstars.csv");

		// Create the sky background
		createSky();

		// Set the elapsed time to zero and update the information panel
		elapsedTime = 0;
		informationPanel.textContent = "Loading...";
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		// Wait until the stars and the background texture are loaded
		if (stars && textureFinishedLoading) {
			// Update the camera controls
			controls.rotateSpeed = Math.min(0.3 * camera.position.length() / controls.minDistance, 0.7);
			controls.update();

			// Update the stars properties
			updateStars();

			// Update the scenes
			updateScenes();

			// Update the black hole pass uniforms
			blackHolePass.uniforms.distanceToCamera.value = camera.position.length();

			// Update the information panel
			informationPanel.textContent = "Elapsed time: " + elapsedTime.toFixed(2) + " yr";

			// Render the scene
			backComposer.render();
			finalComposer.render();
		}
	}

	/*
	 * Creates and adds the webGL renderer
	 */
	function addWebGLRenderer(canvasWidth, canvasHeight) {
		var referenceElement, maxCanvasWidth, webGLRenderer;

		// Calculate the renderer dimensions
		referenceElement = document.getElementById("widthRef");
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = maxCanvasWidth * canvasHeight / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the webGL renderer with the correct dimensions
		webGLRenderer = new THREE.WebGLRenderer({
			antialias : true
		});
		webGLRenderer.setSize(canvasWidth, canvasHeight);

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(webGLRenderer.domElement);

		// Resize the renderer if necessary
		maxCanvasWidth = referenceElement.clientWidth - 1;

		if (canvasWidth > maxCanvasWidth) {
			webGLRenderer.setSize(maxCanvasWidth, maxCanvasWidth * canvasHeight / canvasWidth);
		}

		return webGLRenderer;
	}

	/*
	 * Setups the two effect composers and defines the render sequence
	 */
	function setupEffectComposers() {
		var canvasWidth, canvasHeight, renderTargetParameters, backRenderTarget, finalRenderTarget;
		var backRenderPass, frontRenderPass, uniforms, blackHoleShader, mergePass;

		// Get the canvas dimensions
		canvasWidth = renderer.domElement.width;
		canvasHeight = renderer.domElement.height;

		// Create the render targets
		renderTargetParameters = {
			minFilter : THREE.NearestFilter,
		};
		backRenderTarget = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight, renderTargetParameters);
		finalRenderTarget = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight, renderTargetParameters);

		// Create the effect composers
		backComposer = new THREE.EffectComposer(renderer, backRenderTarget);
		finalComposer = new THREE.EffectComposer(renderer, finalRenderTarget);

		// Create the render passes
		backRenderPass = new THREE.RenderPass(backScene, camera);
		frontRenderPass = new THREE.RenderPass(frontScene, camera);

		// Create the black hole effect pass
		uniforms = {
			tDiffuse : {
				type : 't',
				value : null
			},
			size : {
				type : 'f',
				value : 0.3
			},
			rotation : {
				type : 'f',
				value : 0
			},
			distanceToCamera : {
				type : 'f',
				value : 0
			}
		};

		blackHoleShader = {
			uniforms : uniforms,
			vertexShader : document.getElementById("bh-vertexShader").textContent,
			fragmentShader : document.getElementById("bh-fragmentShader").textContent
		};
		blackHolePass = new THREE.ShaderPass(blackHoleShader);
		blackHolePass.needsSwap = false;

		// Create the shader pass to merge the two renders
		mergePass = new THREE.ShaderPass(THREE.MergeShader);
		mergePass.uniforms.tAdd.value = backComposer.renderTarget1.texture;
		mergePass.renderToScreen = true;

		// Define the render sequence
		backComposer.addPass(backRenderPass);
		backComposer.addPass(blackHolePass);
		finalComposer.addPass(frontRenderPass);
		finalComposer.addPass(mergePass);
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, controller;

		// Initialize the control keys
		guiControlKeys = {
			"BH size" : blackHolePass.uniforms.size.value,
			"BH rotation" : blackHolePass.uniforms.rotation.value,
			"Show trajectories" : false,
			"Show background" : true
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});
		gui.close();

		// Add the GUI controllers
		controller = gui.add(guiControlKeys, "BH size", 0, 1);
		controller.onFinishChange(function(value) {
			blackHolePass.uniforms.size.value = value;
		});

		controller = gui.add(guiControlKeys, "BH rotation", 0, 8);
		controller.onFinishChange(function(value) {
			blackHolePass.uniforms.rotation.value = value;
		});

		controller = gui.add(guiControlKeys, "Show trajectories");
		controller.onFinishChange(function(value) {
			trajectories.visible = value;
		});

		controller = gui.add(guiControlKeys, "Show background");
		controller.onFinishChange(function(value) {
			sky.visible = value;
		});

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);
	}

	/*
	 * Creates the galactic center black hole
	 */
	function createBlackHole() {
		var mass, position;

		// Create the black hole: M_BH = 4.31e6 M_Sun, M_Sun = 1.989e30 kg
		mass = 4.31e6 * 1.989e30;
		position = new THREE.Vector3();
		blackHole = new BlackHole(mass, position);
	}

	/*
	 * Loads the stars file from the server
	 */
	function loadStars(fileName) {
		var request = new XMLHttpRequest();
		request.onload = createStars;
		request.open("get", "data/" + fileName, true);
		request.send();
	}

	/*
	 * Creates the stars
	 */
	function createStars() {
		var rows, i, coordinates, position, velocity, rotationVelocity, radius, color, star;

		// Split the file data into rows
		rows = this.responseText.split("\n");

		// Create the stars (first row is the header)
		stars = [];

		for (i = 1; i < rows.length; i++) {
			// The (position, velocity) coordinates are in units of km and km/s
			coordinates = rows[i].split(",");
			position = new THREE.Vector3(parseFloat(coordinates[0]), parseFloat(coordinates[1]),
					parseFloat(coordinates[2]));
			velocity = new THREE.Vector3(parseFloat(coordinates[3]), parseFloat(coordinates[4]),
					parseFloat(coordinates[5]));

			// Transform the coordinates units to m and m/s
			position.multiplyScalar(1000);
			velocity.multiplyScalar(1000);

			// Add the star to the array
			rotationVelocity = 0.015 + 0.01 * Math.random();
			radius = 1.0 + 0.25 * Math.random();
			stars.push(new Star(position, velocity, rotationVelocity, radius, blackHole));
		}

		// Create the star meshes and the star trajectories
		trajectories = new THREE.Object3D();

		for (i = 0; i < stars.length; i++) {
			// Use a different color for the first star (S-2)
			color = (i === 0) ? new THREE.Color(0.7, 0.7, 1) : new THREE.Color().setHSL(
					0.07 + 0.1 * (Math.random() - 0.5), 1.0, 0.5);
			star = stars[i];
			star.createMesh(color);
			star.createTrajectory(new THREE.Color(0.3, 0.3, 1.0));
			trajectories.add(star.trajectory);
		}

		// Check if the trajectories should be shown
		trajectories.visible = guiControlKeys["Show trajectories"];

		// Add the star trajectories to the front scene
		backScene.add(trajectories);
	}

	/*
	 * Creates the sky background
	 */
	function createSky() {
		var geometry, material, loader;

		// Create the sky mesh
		geometry = new THREE.SphereGeometry(1500, 32, 16);
		material = new THREE.MeshBasicMaterial();
		material.depthTest = false;
		material.depthWrite = false;
		material.side = THREE.BackSide;
		sky = new THREE.Mesh(geometry, material);

		// Rotate the mesh to have the galactic center in front
		sky.scale.z *= -1;
		sky.rotation.y += Math.PI / 2;

		// Load the texture and update the Earth material when is loaded
		textureFinishedLoading = false;
		loader = new THREE.TextureLoader();
		loader.load("img/gc-70.jpg", function(texture) {
			sky.material.map = texture;
			sky.material.needsUpdate = true;
			textureFinishedLoading = true;
		});

		// Add the sky mesh to the back scene
		backScene.add(sky);
	}

	/*
	 * Updates the stars
	 */
	function updateStars() {
		var nSteps, deltaTime, i, star, step;

		// Make sure the stars file loading finished
		if (stars) {
			// Define the number of steps per frame and time involved in each step in units of seconds
			nSteps = Math.min(Math.round(4000 * clock.getDelta()), 300);
			deltaTime = 3600;

			// Keep track of the elapsed time in years since the beginning of the simulation
			elapsedTime += deltaTime * nSteps / (3600 * 24 * 365);

			// Calculate the new positions
			for (i = 0; i < stars.length; i++) {
				star = stars[i];

				// Make several position updates per frame
				for (step = 0; step < nSteps; step++) {
					star.update(deltaTime);
				}

				// Update the mesh position and the trajectory points
				star.updateMesh(camera, elapsedTime);
				star.updateTrajectory();
			}
		}
	}

	/*
	 * Updates the scenes
	 */
	function updateScenes() {
		var i, star;

		if (stars) {
			for (i = 0; i < stars.length; i++) {
				// Remove the star mesh from the scenes
				star = stars[i];
				backScene.remove(star.mesh);
				frontScene.remove(star.mesh);

				// Add the star mesh to the correct scene according to its position with respect to the camera
				if (star.mesh.position.dot(camera.position) < 0.0) {
					backScene.add(star.mesh);
				} else {
					frontScene.add(star.mesh);
				}
			}
		}
	}
}

/*
 * The BlackHole class
 */
function BlackHole(mass, position) {
	this.mass = mass;
	this.position = position;
}

/*
 * The Star class
 */
function Star(position, velocity, rotationVelocity, radius, blackHole) {
	this.G = 6.67384e-11;
	this.scalingFactor = 1e-13;
	this.position = position;
	this.velocity = velocity;
	this.rotationVelocity = rotationVelocity;
	this.acceleration = new THREE.Vector3();
	this.buffer = new THREE.Vector3();
	this.radius = radius;
	this.blackHole = blackHole;
	this.mesh = undefined;
	this.trajectory = undefined;

	// Calculate the acceleration at the current position
	this.buffer.subVectors(this.position, this.blackHole.position);
	this.buffer.multiplyScalar(-this.G * this.blackHole.mass / Math.pow(this.buffer.length(), 3));
	this.acceleration.copy(this.buffer);
}

//
// Creates the star mesh
//
Star.prototype.createMesh = function(color) {
	var geometry, uniforms, material, planeNormal, meshOrientation, rotationAxis, rotationAngle;

	// Create the geometry
	geometry = new THREE.SphereGeometry(this.radius, 32, 16);

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
			value : 0.8
		},
		cellsSize : {
			type : 'f',
			value : 0.15
		},
		spotsSize : {
			type : 'f',
			value : 1.0
		},
		pulsation : {
			type : 'f',
			value : 0
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
		vertexShader : document.getElementById("star-vertexShader").textContent,
		fragmentShader : document.getElementById("star-fragmentShader").textContent,
		side : THREE.FrontSide,
		transparent : true
	});

	// Create the mesh
	this.mesh = new THREE.Mesh(geometry, material);

	// Rotate the mesh to align it with the normal vector defined by the trajectory plane
	planeNormal = new THREE.Vector3().crossVectors(this.velocity, this.position).normalize();
	meshOrientation = new THREE.Vector3(0, 1, 0);
	rotationAxis = new THREE.Vector3().crossVectors(meshOrientation, planeNormal).normalize();
	rotationAngle = Math.acos(meshOrientation.dot(planeNormal));
	this.mesh.rotateOnAxis(rotationAxis, rotationAngle);

	// Move the mesh to the correct position
	this.mesh.position.copy(this.position).multiplyScalar(this.scalingFactor);
};

//
// Creates the star trajectory
//
Star.prototype.createTrajectory = function(color) {
	var geometry, material, i;

	// Create the geometry
	geometry = new THREE.Geometry();

	// Fill all the vertices with the current position
	for (i = 0; i < 300; i++) {
		geometry.vertices.push(this.position.clone().multiplyScalar(this.scalingFactor));
	}

	// Create the material
	material = new THREE.LineBasicMaterial({
		linewidth : 1,
		color : color,
	});

	// Create the mesh
	this.trajectory = new THREE.Line(geometry, material);
};

//
// Updates the star coordinates using the leap-frog algorithm
//
Star.prototype.update = function(dt) {
	// Advance the velocity half step
	this.buffer.copy(this.acceleration).multiplyScalar(dt / 2);
	this.velocity.add(this.buffer);

	// Advance the position one step with the new velocity
	this.buffer.copy(this.velocity).multiplyScalar(dt);
	this.position.add(this.buffer);

	// Calculate the acceleration at the new position
	this.buffer.subVectors(this.position, this.blackHole.position);
	this.buffer.multiplyScalar(-this.G * this.blackHole.mass / Math.pow(this.buffer.length(), 3));
	this.acceleration.copy(this.buffer);

	// Advance the velocity another half step with the new acceleration
	this.buffer.copy(this.acceleration).multiplyScalar(dt / 2);
	this.velocity.add(this.buffer);
};

//
// Updates the star mesh
//
Star.prototype.updateMesh = function(camera, time) {
	var uniforms;

	if (this.mesh) {
		// Update the mesh position
		this.mesh.position.copy(this.position).multiplyScalar(this.scalingFactor);

		// Rotate the mesh a bit in each step
		this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -this.rotationVelocity);

		// Update the mesh uniforms
		uniforms = this.mesh.material.uniforms;
		uniforms.directionToCamera.value.copy(this.mesh.position).applyMatrix4(camera.matrixWorldInverse).negate()
				.normalize();
		uniforms.time.value = time;
	}
};

//
// Updates the star trajectory
//
Star.prototype.updateTrajectory = function() {
	var vertices, newPosition;

	if (this.trajectory) {
		// Get the trajectory vertices
		vertices = this.trajectory.geometry.vertices;

		// Update the vertices if the star moved enough
		newPosition = this.position.clone().multiplyScalar(this.scalingFactor);

		if (vertices[vertices.length - 1].distanceToSquared(newPosition) > 0.5) {
			// Add the new position at the end of the vertices array
			vertices.push(vertices.shift().copy(newPosition));

			// Make sure the trajectory is updated
			this.trajectory.geometry.verticesNeedUpdate = true;
			this.trajectory.geometry.computeBoundingSphere();
		}
	}
};
