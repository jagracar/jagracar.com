<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, scan, kinect, dat.GUI';
$descriptionText = 'three.js Kinect scan viewer sketch';
$titleText = 'Kinect scan viewer sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'kinectScanViewer';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="<?php echo $homeDir;?>threejsSketches.php">Three.js
					sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'threejsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas">
					<div class="sketch-gui" id="sketch-gui"></div>
				</div>

				<script id="vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/scan.vert';?></script>
				<script id="fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/scan.frag';?></script>

				<p>
					This is a modification of an old <a
						href="http://www.openprocessing.org/sketch/84561">Processing
						sketch</a> that I wrote some years ago to visualize scan meshes
					taken with my <a href="http://www.openprocessing.org/sketch/78606">Kinect
						3D scanner application</a>. Instead of Processing, the sketch now
					uses the <a href="http://threejs.org/">three.js</a> <a
						href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> library to
					display the scan mesh in 3D. Most of the calculations are done on
					the GPU using <a
						href="https://en.wikipedia.org/wiki/OpenGL_Shading_Language">GLSL
						shaders</a>. Some of the effects use a 2D texture mask that is
					updated every frame with the <a href="http://p5js.org/">p5.js</a>
					library.
				</p>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a
						href="sourceCode/kinectScanViewer.js">sketch source code</a>, the
					<a href="sourceCode/Scan.js">Scan.js</a> class and the <a
						href="sourceCode/shaders/scan.vert">vertex</a> and <a
						href="sourceCode/shaders/scan.frag">fragment</a> shaders.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.2/dat.gui.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/three.js/95/three.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/OrbitControls.js"></script>
	<script src="sourceCode/Scan.js"></script>
	<script src="sourceCode/kinectScanViewer.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch-gui";
		var sketchContainer = "sketch-canvas";
		window.onload = runSketch;
	</script>
</body>
</html>