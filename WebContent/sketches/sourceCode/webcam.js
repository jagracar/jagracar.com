function runSketch() {
	var scene, renderer, camera, composer, webcamPass, clock, guiControlKeys, informationPanel, videoElement, webcamPlane;

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

		// Setup the effect composer
		setupEffectComposer()

		// Initialize the clock
		clock = new THREE.Clock(true);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Add the information panel, but don't display it unless there is a problem
		informationPanel = document.createElement("p");
		informationPanel.className = "sketch__info";
		informationPanel.style.display = "none";
		document.getElementById(sketchContainer).appendChild(informationPanel);

		// Create the video element, but don't add it to the document
		videoElement = document.createElement("video");
		videoElement.autoplay = true;

		// Create the webcam plane and add it to the scene
		createWebcamPlane();

		// Start the user webcam
		startWebcam();
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		// Update the webcam plane texture if necessary
		if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
			webcamPlane.material.map.needsUpdate = true;

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
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
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
				type : 't',
				value : null
			},
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
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, controller;

		// Initialize the control keys
		guiControlKeys = {
			"Effect" : "Effect 1",
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});
		gui.close();

		// Add the GUI controllers
		controller = gui.add(guiControlKeys, "Effect", [ "Effect 1", "Effect 2", "Effect 3" ]);
		controller.onFinishChange(function(value) {
		});

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);
	}

	/*
	 * Creates the plane that will show the webcam video output
	 */
	function createWebcamPlane() {
		var geometry, texture, material;

		// Create the webcam plane geometry
		geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

		// Switch the vertex uvs to flip the x webcam axis
		geometry.faceVertexUvs = [ [ [ new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1) ],
				[ new THREE.Vector2(1, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 1) ] ] ];

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

	/*
	 * Starts the user's webcam
	 */
	function startWebcam() {
		// Browser fallback
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
				|| navigator.msGetUserMedia;

		// Try to access the local webcam
		if (!navigator.getUserMedia) {
			informationPanel.textContent = "navigator.getUserMedia() is not supported in your browser";
			informationPanel.style.display = "block";
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
		// Browser fallback
		window.URL = window.URL || window.webkitURL;

		// Read the media stream with the video element
		videoElement.src = window.URL ? window.URL.createObjectURL(mediaStream) : mediaStream;

		// Modify the renderer size when the video metadata information finished loading
		videoElement.onloadedmetadata = function() {
			if (this.videoWidth > 0) {
				if (renderer.domElement.width > this.videoWidth) {
					renderer.setSize(this.videoWidth, this.videoHeight);
				} else {
					renderer.setSize(renderer.domElement.width, renderer.domElement.width * this.videoHeight
							/ this.videoWidth);
				}
			}
		};

	}

	/*
	 * Indicates the user that the webcam video cannot be displayed
	 */
	function webcamErrorCallback(e) {
		if (e.name == "PermissionDeniedError" || e.code == 1) {
			informationPanel.textContent = "User denied access to the camera";
			informationPanel.style.display = "block";
		} else {
			informationPanel.textContent = "No camera available";
			informationPanel.style.display = "block";
		}
	}
}
