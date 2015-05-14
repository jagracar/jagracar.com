function runSketch() {
	var scene = undefined;
	var renderer = undefined;
	var camera = undefined;
	var plane, cube, sphere;
	var step = 0;

	init();
	animate();

	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight;
		var planeGeometry, planeMaterial, cubeGeometry, cubeMaterial, sphereGeometry, sphereMaterial;
		var axes, spotLight, ambientLight;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 600;
		canvasHeight = 500;

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
		renderer.shadowMapEnabled = true;

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
		camera.position.set(-30, 40, 30);
		camera.lookAt(scene.position);

		// Create the ground plane
		planeGeometry = new THREE.PlaneBufferGeometry(60, 20);
		planeMaterial = new THREE.MeshLambertMaterial({
			color : 0xcccccc
		});
		plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.set(15, 0, 0);
		plane.rotation.x = -0.5 * Math.PI;
		plane.receiveShadow = true;
		scene.add(plane);

		// Create a cube
		cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
		cubeMaterial = new THREE.MeshLambertMaterial({
			color : 0xff0000
		});
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(-4, 3, 0);
		// cube.castShadow = true;
		scene.add(cube);

		// Create a sphere
		sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
		sphereMaterial = new THREE.MeshLambertMaterial({
			color : 0x7777ff
		});
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(20, 4, 2);
		// sphere.castShadow = true;
		scene.add(sphere);

		// Show axes in the screen
		axes = new THREE.AxisHelper(20);
		scene.add(axes);

		// add spotlight for the shadows
		spotLight = new THREE.PointLight(0xffffff);
		spotLight.position.set(-40, 60, -10);
		// spotLight.castShadow = true;
		scene.add(spotLight);

		// add subtle ambient lighting
		ambientLight = new THREE.AmbientLight(0x0c0c0c);
		scene.add(ambientLight);

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);
	}

	function animate() {
		// rotate the cube around its axes
		cube.rotation.x += 0.02;
		cube.rotation.y += 0.02;
		cube.rotation.z += 0.02;

		// bounce the sphere up and down
		step += 0.04;
		sphere.position.x = 20 + (10 * (Math.cos(step)));
		sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

}