function runSketch() {
	var scene, renderer, camera, clock, guiControlKeys, informationPanel, camvideo, plane;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var canvasWidth, canvasHeight;

		// Scene setup
		scene = new THREE.Scene();

		// Set the optimal sketch dimensions
		canvasWidth = 540;
		canvasHeight = 360;

		// Get the WebGL renderer
		renderer = getWebGLRenderer(canvasWidth, canvasHeight);

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Camera setup
		camera = new THREE.Camera();

		// Initialize the clock
		clock = new THREE.Clock(true);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Add the information panel if it's not yet present
		informationPanel = document.createElement("p");
		informationPanel.className = "sketch__info";
		document.getElementById(sketchContainer).appendChild(informationPanel);

		// Get the video element
		camvideo = document.createElement("video");
		camvideo.autoplay = true;

		videoTexture = new THREE.Texture(camvideo);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;
		videoMaterial = new THREE.MeshBasicMaterial();
		videoMaterial.depthTest = false;
		videoMaterial.depthWrite = false;
		videoMaterial.map = videoTexture;
		planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
		planeGeometry.faceVertexUvs = [ [
				[ new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1) ],
				[ new THREE.Vector2(1, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 1) ] ] ];
		plane = new THREE.Mesh(planeGeometry, videoMaterial);
		console.log(plane);
		// scene.add(plane);

		startWebcam();
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		if (camvideo.readyState === camvideo.HAVE_ENOUGH_DATA) {
			plane.material.map.needsUpdate = true;
		}
		// Render the scene
		renderer.render(scene, camera);
	}

	function startWebcam() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
				|| navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		if (!navigator.getUserMedia) {
			informationPanel.textContent = 'getUserMedia() is not supported in your browser';
		} else {
			navigator.getUserMedia({
				video : true
			}, handleWebcam, onWebcamError);
		}
	}

	function handleWebcam(mediaStream) {
		if (window.URL) {
			camvideo.src = window.URL.createObjectURL(mediaStream);
			console.log(camvideo.height);
			informationPanel.textContent = 'Everthing went ok.';
		} else {
			informationPanel.textContent = 'window.URL is not supported in your browser';
		}

		camvideo.onerror = function(e) {
			informationPanel.textContent = 'stream error';
			mediaStream.stop();
		};

		mediaStream.onended = onWebcamError;
	}

	function onWebcamError(e) {
		console.log(e);

		if (e.name == "PermissionDeniedError" || e.code == 1) {
			informationPanel.textContent = 'User denied access to use camera.';
		} else {
			informationPanel.textContent = 'No camera available.';
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
		var gui, controller;

		// Initialize the control keys
		guiControlKeys = {
			"Rotation velocity" : 0.5,
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

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);
	}
}
