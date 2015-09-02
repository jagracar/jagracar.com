function runSketch() {
	var scene, renderer, camera, light, cube, composer;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight, controls, cubeGeometry, cubeMaterial;

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
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(canvasWidth, canvasHeight);
		renderer.setClearColor(new THREE.Color(0.93, 0.93, 0.93));

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 2000);
		camera.position.set(0, 3, 10);

		// Initialize the camera controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		// Initialize the directional light
		light = new THREE.DirectionalLight();
		scene.add(light);

		// Initialize the ambient light
		ambientLight = new THREE.AmbientLight(0x0c0c0c);
		scene.add(ambientLight);

		// Create the cube
		cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
		cubeMaterial = new THREE.MeshLambertMaterial({
			color : 0xff0000
		});
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(0, 0, 0);
		scene.add(cube);

		var renderPass = new THREE.RenderPass(scene, camera);
		renderPass.clear = true;
        renderer.autoClear = false;

		var cubeMask = new THREE.MaskPass(scene, camera);
        cubeMask.inverse = false;
        var clearMask = new THREE.ClearMaskPass();
        
		var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
		effectFilm.renderToScreen = false;

        var effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
        effectColorify.uniforms[ 'color' ].value.setRGB(0.5, 0.5, 1);
		effectColorify.renderToScreen = false;

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;

		composer = new THREE.EffectComposer(renderer);
        composer.renderTarget1.stencilBuffer = true;
        composer.renderTarget2.stencilBuffer = true;
		
		composer.addPass(renderPass);
		composer.addPass(cubeMask);
		composer.addPass(effectColorify);
		composer.addPass(clearMask);
        composer.addPass(effectCopy);
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		// Update the light position
		light.position.copy(camera.position);

		// Rotate the cube around the y axis
		cube.rotation.y += 0.02;

		// Render the scene

		// renderer.render(scene, camera);
		composer.render();
	}
}