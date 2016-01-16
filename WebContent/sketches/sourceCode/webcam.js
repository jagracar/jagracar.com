function runSketch() {
	var scene, renderer, camera, composer, webcamPass, clock, guiControlKeys, informationPanel;
	var videoElement, webcamPlane, detector, smoother;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		// Scene setup
		scene = new THREE.Scene();

		// Get the WebGL renderer
		renderer = getWebGLRenderer(640, 480);

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Camera setup
		camera = new THREE.Camera();

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Setup the effect composer
		setupEffectComposer()

		// Initialize the clock
		clock = new THREE.Clock(true);

		// Start the user webcam
		startWebcam();
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		var rectangles, mainFaceRectangle, x, y, width, height;

		// Request the next animation frame
		requestAnimationFrame(animate);

		// Continue if the webcam is sending data
		if (videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
			// Check if the users face should be detected
			if (guiControlKeys["Detect face"]) {
				// Obtain the rectangles of all possible faces
				rectangles = detector.detect(videoElement, false);

				if (rectangles.length > 0) {
					console.log(rectangles[0][4]);
					// Calculate the main face relative coordinates
					mainFaceRectangle = rectangles[0];//smoother.smooth(rectangles[0]);
					x = guiControlKeys["flipped"] ? 1 - (mainFaceRectangle[0] + mainFaceRectangle[2])
							/ detector.canvas.width : mainFaceRectangle[0] / detector.canvas.width;
					y = 1 - (mainFaceRectangle[1] + mainFaceRectangle[3]) / detector.canvas.height;
					width = mainFaceRectangle[2] / detector.canvas.width;
					height = mainFaceRectangle[3] / detector.canvas.height;

					// Update the webcam pass uniforms
					webcamPass.uniforms.facePosition.value.set(x, y);
					webcamPass.uniforms.faceSize.value.set(width, height);
				}

			}

			webcamPass.uniforms.time.value = clock.getElapsedTime();

			// Update the webcam plane texture
			if (webcamPlane) {
				webcamPlane.material.map.needsUpdate = true;
			}

			// Render the scene
			composer.render();
		}
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
			canvasHeight = Math.round(canvasHeight * maxCanvasWidth / canvasWidth);
			canvasWidth = maxCanvasWidth;
		}

		// Create the webGL renderer with the correct dimensions
		webGLRenderer = new THREE.WebGLRenderer({
			antialias : true
		});
		webGLRenderer.setSize(canvasWidth, canvasHeight);

		return webGLRenderer;
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, controller;

		// Initialize the control keys
		guiControlKeys = {
			"Flipped" : true,
			"Detect face" : true,
			"Effect" : "None",
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});
		gui.close();

		// Add the GUI controllers
		controller = gui.add(guiControlKeys, "Flipped");
		controller.onFinishChange(function(value) {
			webcamPass.uniforms.flipped.value = value;
		});

		controller = gui.add(guiControlKeys, "Detect face");

		controller = gui.add(guiControlKeys, "Effect", {
			"None" : 0,
			"Horiz mirror" : 1,
			"Vert mirror" : 2,
			"Twist" : 3,
			"Face detection" : 99
		});
		controller.onFinishChange(function(value) {
			webcamPass.uniforms.effect.value = value;
		});

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);
	}

	/*
	 * Setups the effect composer
	 */
	function setupEffectComposer() {
		var renderPass, uniforms;

		// Create the effect composer
		composer = new THREE.EffectComposer(renderer);

		// Create the render pass
		renderPass = new THREE.RenderPass(scene, camera);

		// Create the webcam effect pass
		uniforms = {
			tDiffuse : {
				type : "t",
				value : null
			},
			size : {
				type : "v2",
				value : new THREE.Vector2(renderer.domElement.width, renderer.domElement.height)
			},
			flipped : {
				type : "i",
				value : guiControlKeys["Flipped"]
			},
			effect : {
				type : "i",
				value : guiControlKeys["Effect"]
			},
			facePosition : {
				type : "v2",
				value : new THREE.Vector2()
			},
			faceSize : {
				type : "v2",
				value : new THREE.Vector2()
			},
			time : {
				type : "f",
				value : 0
			}
		};

		webcamPass = new THREE.ShaderPass({
			uniforms : uniforms,
			vertexShader : document.getElementById("vertexShader").textContent,
			fragmentShader : document.getElementById("fragmentShader").textContent
		});
		webcamPass.renderToScreen = true;

		// Define the render sequence
		composer.addPass(renderPass);
		composer.addPass(webcamPass);
	}

	/*
	 * Starts the user's webcam
	 */
	function startWebcam() {
		// Browser compatibility check
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
				|| navigator.msGetUserMedia;

		// Try to access the user's webcam
		if (!navigator.getUserMedia) {
			displayErrorMessage("navigator.getUserMedia() is not supported in your browser");
		} else {
			navigator.getUserMedia({
				video : true
			}, webcamSuccessCallback, webcamErrorCallback);
		}
	}

	/*
	 * Handles the webcam media stream
	 */
	function webcamSuccessCallback(mediaStream) {
		// Create the video element, but don't add it to the document
		videoElement = document.createElement("video");
		videoElement.autoplay = true;

		// Read the media stream with the video element
		window.URL = window.URL || window.webkitURL;
		videoElement.src = window.URL ? window.URL.createObjectURL(mediaStream) : mediaStream;

		// Run this when the video element metadata information has finished loading (only once)
		videoElement.onloadedmetadata = function() {
			if (this.videoWidth > 0) {
				// Modify the renderer size
				if (renderer.domElement.width > this.videoWidth) {
					renderer.setSize(this.videoWidth, this.videoHeight);
				} else {
					renderer.setSize(renderer.domElement.width, Math.round(renderer.domElement.width * this.videoHeight
							/ this.videoWidth));
				}

				// Update the webcam pass size uniform
				webcamPass.uniforms.size.value.set(renderer.domElement.width, renderer.domElement.height);

				// Initialize the face detector and the smoother
				detectorHeight = 60;
				detectorWidth = Math.round(detectorHeight * this.videoWidth / this.videoHeight);
				detector = new objectdetect.detector(detectorWidth, detectorHeight, 1.1, objectdetect.frontalface_alt);
				smoother = new Smoother([ 0.9999999, 0.9999999, 0.999, 0.999 ], [ 0, 0, 0, 0 ]);
			}

			// Create the webcam plane and add it to the scene
			createWebcamPlane();
		};
	}

	/*
	 * Alerts the user that the webcam video cannot be displayed
	 */
	function webcamErrorCallback(e) {
		if (e.name == "PermissionDeniedError" || e.code == 1) {
			displayErrorMessage("User denied access to the camera");
		} else {
			displayErrorMessage("No camera available");
		}
	}

	/*
	 * Creates an information panel displaying the given message
	 */
	function displayErrorMessage(message) {
		// Add the information panel if it doesn't exist already
		if (informationPanel) {
			informationPanel = document.createElement("p");
			informationPanel.className = "sketch__info";
			document.getElementById(sketchContainer).appendChild(informationPanel);
		}

		informationPanel.textContent = message;
	}

	/*
	 * Creates the plane that will show the webcam video output
	 */
	function createWebcamPlane() {
		var geometry, texture, material;

		// Create the webcam plane geometry
		geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

		// Create the texture that will contain the webcam video output
		texture = new THREE.Texture(videoElement);
		texture.format = THREE.RGBFormat;
		texture.generateMipmaps = false;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		// Create the webcam plane material
		material = new THREE.MeshBasicMaterial();
		material.depthTest = false;
		material.depthWrite = false;
		material.map = texture;

		// Create the webcam plane mesh
		webcamPlane = new THREE.Mesh(geometry, material);

		// Add it to the scene
		scene.add(webcamPlane);
	}
}

/**
 * Double-exponential smoothing based on Wright's modification of Holt's method for irregular data.
 * 
 * Copyright 2014 Martin Tschirsich Released under the MIT license
 * 
 * @param {Array}
 *            alphas Exponential smoothing factors
 * @param {Array}
 *            initialValues Initial values before smoothing
 * @param {Number}
 *            lookAhead Additionally added linear trend, between 0 - 1
 */

var Smoother = function(alphas, initialValues, lookAhead) {
	"use strict";

	var lastUpdate = +new Date(), initialAlphas = alphas.slice(0), alphas = alphas.slice(0), a = initialValues.slice(0), b = initialValues
			.slice(0), numValues = initialValues.length, lookAhead = (typeof lookAhead !== 'undefined') ? lookAhead
			: 1.0;

	this.smooth = function(values) {
		var smoothedValues = [];

		// time in seconds since last update:
		var time = new Date() - lastUpdate;
		lastUpdate += time;
		time /= 1000;

		// update:
		for (var i = 0; i < numValues; ++i) {

			// Wright's modification of Holt's method for irregular data:
			alphas[i] = alphas[i] / (alphas[i] + Math.pow(1 - initialAlphas[i], time));

			var oldA = a[i];
			// a[i] = alphas[i] * values[i] + (1 - alphas[i]) * (a[i] + b[i] * time);
			// b[i] = alphas[i] * (a[i] - oldA) / time + (1 - alphas[i]) * b[i];

			// smoothedValues[i] = a[i] + time * lookAhead * b[i];

			// Alternative approach:
			a[i] = alphas[i] * values[i] + (1 - alphas[i]) * a[i];
			b[i] = alphas[i] * a[i] + (1 - alphas[i]) * b[i];
			smoothedValues[i] = 2 * a[i] - 1 * b[i];
		}

		return smoothedValues;
	};
};