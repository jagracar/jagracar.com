function runSketch() {
	var scene, renderer, camera, rayCaster, mouseCanvasPosition, mouseWorldPosition, guiControlKeys;
	var p5Canvas, p5Sketch, vertexShader, fragmentShader, scan, originalScan;
	var time = 0;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight, controls;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 850;
		canvasHeight = 550;

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
		camera.position.set(-300, 0, -500);

		// Initialize the camera controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		// Ray caster setup
		rayCaster = new THREE.Raycaster();
		mouseCanvasPosition = new THREE.Vector2(-100000);
		mouseWorldPosition = new THREE.Vector3(-100000);

		// Add an event listener to the renderer dom element to update the mouseCanvasPosition
		renderer.domElement.addEventListener('mousemove', onMouseMove, false);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Create the p5.js canvas for the animated masks
		p5Canvas = new p5().createGraphics(512, 512);

		// Get the vertex and fragment shaders
		vertexShader = document.getElementById("vertexShader").textContent;
		fragmentShader = document.getElementById("fragmentShader").textContent;

		// Read the default scan and add the scan mesh to the scene
		readScanAndAddMeshToScene();
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		var intersections;

		// Request the next animation frame
		requestAnimationFrame(animate);

		// If necessary, calculate the mouse position on world coordinate units
		if (guiControlKeys.Effect >= 12) {
			// Calculate the rayCaster intersections with the scene objects
			rayCaster.setFromCamera(mouseCanvasPosition, camera);
			intersections = rayCaster.intersectObjects(scene.children, true);

			// Update the mouseWorldPosition vector
			if (intersections.length > 0) {
				mouseWorldPosition.copy(intersections[0].point);
			} else {
				mouseWorldPosition.set(-100000, -100000, -100000);
			}
		}

		// Update the processing sketch
		if (p5Sketch) {
			p5Sketch.update();
			p5Sketch.paint();
		}

		// Update the scan mesh and point cloud uniforms
		updateScanUniforms();

		// Render the scene
		renderer.render(scene, camera);

		// Advance the time
		time += guiControlKeys.Speed;
	}

	/*
	 * Calculate mouse position in normalized device coordinates (-1 to 1)
	 */
	function onMouseMove(event) {
		var rect = this.getBoundingClientRect();
		mouseCanvasPosition.x = 2 * (event.clientX - rect.left) / renderer.domElement.width - 1;
		mouseCanvasPosition.y = -2 * (event.clientY - rect.top) / renderer.domElement.height + 1;
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, f1, f2, controller, i, hueElements;

		// Initialize the control keys
		guiControlKeys = {
			"Scan name" : "scan1",
			"Back side color" : [ 255, 255, 255 ],
			"Resolution" : 2,
			"Smoothness" : 1,
			"Fill holes" : 5,
			"Show lines" : false,
			"Show points" : false,
			"Point size" : 2,
			"Effect" : 0,
			"Invert effect" : false,
			"Fill with color" : true,
			"Color" : [ 50, 50, 50 ],
			"Transparency" : 1.0,
			"Speed" : 0.5
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});

		// Add the GUI sections
		f1 = gui.addFolder("Scan configuration");
		f2 = gui.addFolder("Effect configuration");

		// Add the first folder controllers
		controller = f1.add(guiControlKeys, "Scan name", [ "scan1", "scan2", "scan3", "scan4", "chloe", "diego" ]);
		controller.onFinishChange(readScanAndAddMeshToScene);

		controller = f1.addColor(guiControlKeys, "Back side color");

		controller = f1.add(guiControlKeys, "Resolution", 1, 10).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Smoothness", 0, 5).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Fill holes", 0, 20).step(1);
		controller.onFinishChange(updateScanProperties);

		controller = f1.add(guiControlKeys, "Show lines");

		controller = f1.add(guiControlKeys, "Show points");
		controller.onFinishChange(function(value) {
			if (scan) {
				if (value) {
					// Remove the scan mesh from the scene
					scene.remove(scan.mesh);

					// Add the point cloud to the scene
					scene.add(scan.pointCloud);
				} else {
					// Remove the point cloud from the scene
					scene.remove(scan.pointCloud);

					// Add the scan mesh to the scene
					scene.add(scan.mesh);
				}
			}
		});

		controller = f1.add(guiControlKeys, "Point size", 1, 10);

		// Add the second folder controllers
		controller = f2.add(guiControlKeys, "Effect", {
			"None" : 0,
			"Pulsation 1" : 1,
			"Pulsation 2" : 2,
			"Grid" : 3,
			"Toon" : 4,
			"Perlin noise" : 5,
			"Hole" : 6,
			"Circle" : 7,
			"Vertical cut" : 8,
			"Bouncing balls" : 9,
			"Traces" : 10,
			"Aggregation" : 11,
			"Cursor 1" : 12,
			"Cursor 2" : 13
		});
		controller.onFinishChange(function(value) {
			// Initialize the sketch if necessary
			if (value == 9) {
				p5Sketch = new BallsSketch(300, 30, p5Canvas, 0, 255, true);
			} else if (value == 10) {
				p5Sketch = new BallsSketch(50, 10, p5Canvas, 255, 0, false);
			} else if (value == 11) {
				p5Sketch = new DLASketch(p5Canvas, 255, 0, true);
			} else if (value == 12) {
				p5Sketch = new PaintWithCursorSketch(mouseWorldPosition, 20, p5Canvas, 255, 0, false);
			} else {
				p5Sketch = undefined;
			}

			// Reset the time
			time = 0;
		});

		controller = f2.add(guiControlKeys, "Invert effect");

		controller = f2.add(guiControlKeys, "Fill with color");

		controller = f2.addColor(guiControlKeys, "Color");

		controller = f2.add(guiControlKeys, "Transparency", 0, 1);

		controller = f2.add(guiControlKeys, "Speed", 0, 1);

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);

		// Fix a bug with the dat.GUI hue color selector
		hueElements = document.getElementsByClassName("hue-field");

		for (i = 0; i < hueElements.length; i++) {
			hueElements[i].style.width = "10px";
		}
	}

	/*
	 * Loads the scan from the server and adds the scan mesh to the scene
	 */
	function readScanAndAddMeshToScene() {
		var request = new XMLHttpRequest();
		request.onload = addScanMesh;
		request.open("get", "data/" + guiControlKeys["Scan name"] + ".points", true);
		request.send();
	}

	/*
	 * This function will be executed when the scan file is loaded
	 */
	function addScanMesh() {
		// If it exists, remove the previous scan mesh and point cloud from the scene
		if (scan) {
			scene.remove(scan.mesh);
			scene.remove(scan.pointCloud);
		}

		// Create a new scan object and initialize it with the file content
		scan = new Scan();
		scan.initFromFile(this.responseText);
		scan.crop();

		// Shift diego's scan a bit
		if (guiControlKeys["Scan name"] == "diego") {
			scan.shift(new THREE.Vector3(0, 60, 0));
		}

		// Save a copy of the original scan
		originalScan = scan.clone();

		// Fill the scan holes
		scan.fillHoles(guiControlKeys["Fill holes"]);

		// Smooth the scan points
		scan.gaussianSmooth(guiControlKeys.Smoothness);

		// Reduce the resolution
		scan.reduceResolution(guiControlKeys.Resolution);

		// Create the scan mesh and the point cloud
		scan.createMesh(vertexShader, fragmentShader, p5Canvas);
		scan.createPointCloud(vertexShader, fragmentShader, p5Canvas);

		// Add the mesh or the point cloud to the scene
		if (guiControlKeys["Show points"]) {
			scene.add(scan.pointCloud);
		} else {
			scene.add(scan.mesh);
		}

		// Reset the time
		time = 0;
	}

	/*
	 * Updates the scan properties when the user modifies them with the GUI
	 */
	function updateScanProperties() {
		if (scan) {
			// Remove the previous scan mesh and point cloud from the scene
			scene.remove(scan.mesh);
			scene.remove(scan.pointCloud);

			// Start from the original scan
			scan = originalScan.clone();

			// Fill the scan holes
			scan.fillHoles(guiControlKeys["Fill holes"]);

			// Smooth the scan points
			scan.gaussianSmooth(guiControlKeys.Smoothness);

			// Reduce the resolution
			scan.reduceResolution(guiControlKeys.Resolution);

			// Create the scan mesh and the point cloud
			scan.createMesh(vertexShader, fragmentShader, p5Canvas);
			scan.createPointCloud(vertexShader, fragmentShader, p5Canvas);

			// Add the mesh or the point cloud to the scene
			if (guiControlKeys["Show points"]) {
				scene.add(scan.pointCloud);
			} else {
				scene.add(scan.mesh);
			}
		}
	}

	/*
	 * Updates the scan uniforms for the vertex and fragment shaders
	 */
	function updateScanUniforms() {
		var frontMeshUniforms, backMeshUniforms, pointCloudUniforms, backColor, effectColor;

		if (scan && scan.mesh) {
			// Get the front and back mesh uniforms
			frontMeshUniforms = scan.mesh.getObjectByName("frontMesh").material.uniforms;
			backMeshUniforms = scan.mesh.getObjectByName("backMesh").material.uniforms;

			// Update the uniforms
			backColor = guiControlKeys["Back side color"];
			effectColor = guiControlKeys.Color;
			frontMeshUniforms.backColor.value.setRGB(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255);
			backMeshUniforms.backColor.value.setRGB(backColor[0] / 255, backColor[1] / 255, backColor[2] / 255);
			frontMeshUniforms.showLines.value = guiControlKeys["Show lines"];
			backMeshUniforms.showLines.value = guiControlKeys["Show lines"];
			frontMeshUniforms.effect.value = guiControlKeys.Effect;
			backMeshUniforms.effect.value = guiControlKeys.Effect;
			frontMeshUniforms.invertEffect.value = guiControlKeys["Invert effect"];
			backMeshUniforms.invertEffect.value = guiControlKeys["Invert effect"];
			frontMeshUniforms.fillWithColor.value = guiControlKeys["Fill with color"];
			backMeshUniforms.fillWithColor.value = guiControlKeys["Fill with color"];
			frontMeshUniforms.effectColor.value
					.setRGB(effectColor[0] / 255, effectColor[1] / 255, effectColor[2] / 255);
			backMeshUniforms.effectColor.value.setRGB(effectColor[0] / 255, effectColor[1] / 255, effectColor[2] / 255);
			frontMeshUniforms.effectTransparency.value = guiControlKeys.Transparency;
			backMeshUniforms.effectTransparency.value = guiControlKeys.Transparency;
			frontMeshUniforms.lightPosition.value = camera.position;
			backMeshUniforms.lightPosition.value = camera.position;
			frontMeshUniforms.cursor.value = mouseWorldPosition;
			backMeshUniforms.cursor.value = mouseWorldPosition;
			frontMeshUniforms.time.value = time;
			backMeshUniforms.time.value = time;

			// Update the mask texture only if the sketch is running
			if (p5Sketch) {
				frontMeshUniforms.mask.value.needsUpdate = true;
				backMeshUniforms.mask.value.needsUpdate = true;
			}
		}

		if (scan && scan.pointCloud) {
			// Get the point cloud uniforms
			pointCloudUniforms = scan.pointCloud.material.uniforms;

			// Update the uniforms
			effectColor = guiControlKeys.Color;
			pointCloudUniforms.pointSize.value = guiControlKeys["Point size"];
			pointCloudUniforms.effect.value = guiControlKeys.Effect;
			pointCloudUniforms.invertEffect.value = guiControlKeys["Invert effect"];
			pointCloudUniforms.fillWithColor.value = guiControlKeys["Fill with color"];
			pointCloudUniforms.effectColor.value.setRGB(effectColor[0] / 255, effectColor[1] / 255,
					effectColor[2] / 255);
			pointCloudUniforms.effectTransparency.value = guiControlKeys.Transparency;
			pointCloudUniforms.lightPosition.value = camera.position;
			pointCloudUniforms.cursor.value = mouseWorldPosition;
			pointCloudUniforms.time.value = time;

			// Update the mask texture only if the sketch is running
			if (p5Sketch) {
				pointCloudUniforms.mask.value.needsUpdate = true;
			}
		}
	}

	/*
	 * The Balls Sketch class
	 */
	function BallsSketch(nBalls, ballDiameter, p5Canvas, fillColor, bgColor, clearCanvas) {
		var i, ang, vel;

		// Class parameters
		this.nBalls = nBalls;
		this.ballDiameter = ballDiameter;
		this.p5 = p5Canvas;
		this.fillColor = fillColor;
		this.bgColor = bgColor;
		this.clearCanvas = clearCanvas;
		this.balls = [];

		// Initialize the balls
		for (i = 0; i < this.nBalls; i++) {
			ang = Math.PI * Math.random();
			vel = 0.6;

			this.balls[i] = {
				x : this.p5.width * Math.random(),
				y : this.p5.height * Math.random(),
				vx : vel * Math.cos(ang),
				vy : vel * Math.sin(ang)
			};
		}

		// Processing setup
		this.p5.background(this.bgColor);
		this.p5.fill(this.fillColor);
		this.p5.noStroke();

		// The update method
		this.update = function() {
			var w, h, i, ball;

			w = this.p5.width;
			h = this.p5.height;

			for (i = 0; i < this.nBalls; i++) {
				// Update the ball position
				ball = this.balls[i];
				ball.x += ball.vx;
				ball.y += ball.vy;

				// Make sure that it doesn't leave the canvas
				if (ball.x < 0) {
					ball.x = 0;
					ball.vx *= -1;
				} else if (ball.x > w) {
					ball.x = w;
					ball.vx *= -1;
				}

				if (ball.y < 0) {
					ball.y = 0;
					ball.vy *= -1;
				} else if (ball.y > h) {
					ball.y = h;
					ball.vy *= -1;
				}
			}
		};

		// The paint method
		this.paint = function() {
			var i;

			// Clear the canvas if necessary
			if (this.clearCanvas) {
				this.p5.background(this.bgColor);
			}

			// Draw the balls
			for (i = 0; i < this.nBalls; i++) {
				this.p5.ellipse(this.balls[i].x, this.balls[i].y, this.ballDiameter, this.ballDiameter);
			}
		};
	}

	/*
	 * The DLA Sketch class
	 */
	function DLASketch(p5Canvas, fillColor, bgColor, clearCanvas) {
		var i, x, y;

		// Class parameters
		this.p5 = p5Canvas;
		this.fillColor = fillColor;
		this.bgColor = bgColor;
		this.clearCanvas = clearCanvas;
		this.nParticles = 0.1 * this.p5.width * this.p5.height;
		this.particles = [];
		this.particleDiameter = 3;
		this.buffer = new Int32Array(this.p5.width * this.p5.height);

		// Initialize the particles
		for (i = 0; i < this.nParticles; i++) {
			this.particles[i] = {
				x : Math.floor(this.p5.width * Math.random()),
				y : Math.floor(this.p5.height * Math.random()),
				xPrev : 0,
				yPrev : 0,
				aggregated : false
			};
		}

		// Initialize the buffer
		this.buffer.w = this.p5.width;
		this.buffer.h = this.p5.height;

		for (i = 0; i < this.buffer.length; i++) {
			this.buffer[i] = this.bgColor;
		}

		// The buffer draw function
		this.buffer.draw = function(x, y, color) {
			if (x >= 0 && x < this.w && y >= 0 && y < this.h) {
				this[x + y * this.w] = color;

				if (x - 1 >= 0) {
					if (y - 1 >= 0) {
						this[x - 1 + (y - 1) * this.w] = color;
					}

					if (y + 1 < this.h) {
						this[x - 1 + (y + 1) * this.w] = color;
					}
				}

				if (x + 1 < this.w) {
					if (y - 1 >= 0) {
						this[x + 1 + (y - 1) * this.w] = color;
					}

					if (y + 1 < this.h) {
						this[x + 1 + (y + 1) * this.w] = color;
					}
				}
			}
		};

		// Add some seeds to the buffer
		for (i = 0; i < 10; i++) {
			x = Math.floor(this.buffer.w * (0.2 + 0.6 * Math.random()));
			y = Math.floor(this.buffer.h * (0.2 + 0.6 * Math.random()));
			this.buffer.draw(x, y, this.fillColor);
		}

		// Processing setup
		this.p5.background(this.bgColor);
		this.p5.fill(this.fillColor);
		this.p5.noStroke();

		// The update method
		this.update = function() {
			var i, p;

			// Move the particles if they are not yet aggregated
			for (i = 0; i < this.nParticles; i++) {
				p = this.particles[i];

				if (!p.aggregated) {
					p.xPrev = p.x;
					p.yPrev = p.y;

					switch (Math.floor(8 * Math.random())) {
					case 0:
						p.x++;
						break;
					case 1:
						p.x++;
						p.y++;
						break;
					case 2:
						p.y++;
						break;
					case 3:
						p.x--;
						p.y++;
						break;
					case 4:
						p.x--;
						break;
					case 5:
						p.x--;
						p.y--;
						break;
					case 6:
						p.y--;
						break;
					case 7:
						p.x++;
						p.y--;
						break;
					}

					// If the particle is outside the canvas, set it as aggregated
					if (p.x < 0 || p.x >= this.p5.width || p.y < 0 || p.y >= this.p5.height) {
						p.aggregated = true;
					}
				}
			}
		};

		// The paint method
		this.paint = function() {
			var i, p;

			for (i = 0; i < this.nParticles; i++) {
				p = this.particles[i];

				if (!p.aggregated) {
					// Check if the particle should be aggregated
					if (this.buffer[p.x + p.y * this.buffer.w] == this.fillColor) {
						if (this.buffer[p.xPrev + p.yPrev * this.buffer.w] != this.fillColor) {
							this.p5.ellipse(p.xPrev, p.yPrev, this.particleDiameter, this.particleDiameter);
							this.buffer.draw(p.xPrev, p.yPrev, this.fillColor);
						}

						p.aggregated = true;
					}
				}
			}
		};
	}

	/*
	 * The paint with cursor Sketch class
	 */
	function PaintWithCursorSketch(cursor, cursorDiameter, p5Canvas, fillColor, bgColor, clearCanvas) {
		// Class parameters
		this.cursor = cursor;
		this.cursorDiameter = cursorDiameter;
		this.p5 = p5Canvas;
		this.fillColor = fillColor;
		this.bgColor = bgColor;
		this.clearCanvas = clearCanvas;

		// Processing setup
		this.p5.background(this.bgColor);
		this.p5.fill(this.fillColor);
		this.p5.noStroke();

		// The update method
		this.update = function() {
			// The cursor position updates automatically because we passed the reference
		};

		// The paint method
		this.paint = function() {
			var x, y;

			// Clear the canvas if necessary
			if (this.clearCanvas) {
				this.p5.background(this.bgColor);
			}

			// Draw an ellipse at the cursor position
			x = this.p5.width / 2 - this.cursor.x;
			y = this.p5.height / 2 - this.cursor.y;
			this.p5.ellipse(x, y, this.cursorDiameter, this.cursorDiameter);
		};
	}
}