<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, Earth, cities, travel, dat.GUI';
$descriptionText = 'three.js visited cities sketch';
$titleText = 'Visited cities sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = true;
$addJQuery = false;
$sketch = 'visitedCities';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="/js/libs/OrbitControls.js" async></script>
<script type="text/javascript" src="sourceCode/visitedCities.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/threejsSketches.php">Three.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'threejsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas">
					<div class="sketch-gui" id="sketch-gui"></div>
				</div>

				<script id="vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/pointOnSphere.vert';?></script>
				<script id="fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/pointOnSphere.frag';?></script>

				<!-- Run the sketch -->
				<script>
					var guiContainer = "sketch-gui";
					var infoClass = "sketch-info";
					var sketchContainer = "sketch-canvas";

					window.onload =  function() {
						runSketch();
					};
				</script>

				<p>
					This sketch shows all the cities that I have ever visited or I plan
					to visit in the coming months. The earth images (one for each
					month) are from the <a
						href="http://visibleearth.nasa.gov/view_cat.php?categoryID=1484">Blue
						Marble Next Generation</a> <a
						href="https://en.wikipedia.org/wiki/The_Blue_Marble">project</a>.
				</p>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/visitedCities.js">sketch
						source code</a> and the <a
						href="sourceCode/shaders/pointOnSphere.vert">vertex</a> and <a
						href="sourceCode/shaders/pointOnSphere.frag">fragment</a> shaders.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>