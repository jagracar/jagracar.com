<?php
	// General php variables
	$page = 'threejs';
	$homeDir = '../';
	$sketch = 'visitedCities';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="three.js, javaScript, examples, 3D, Earth, cities, travel, dat.GUI">
<meta name="description" content="three.js visited cities sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Visited cities sketch - jagracar</title>

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css" />

<!-- Useful JavaScript files -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
	<!-- Navigation bar -->
	<?php include_once $homeDir . 'navBar.php';?>

	<div class="main-container">
		<header>
			<h1>
				<a href="<?php echo $homeDir;?>threejsSketches.php">Three.js sketches</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'threejsSketchesList.php';?>

		<script id="vertexShader" type="x-shader/x-vertex"><?php include_once 'sourceCode/shaders/pointOnSphere.vert';?></script>
		<script id="fragmentShader" type="x-shader/x-fragment"><?php include_once 'sourceCode/shaders/pointOnSphere.frag';?></script>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas">
						<div class="sketch__gui" id="sketch__gui"></div>
					</div>
				</div>

				<div class="sketch__description">
					<p>
						This sketch shows all the cities that I have ever visited or I plan to visit in the coming months. The earth
						images (one for each month) are from the <a href="http://visibleearth.nasa.gov/view_cat.php?categoryID=1484">Blue
							Marble Next Generation</a> <a href="https://en.wikipedia.org/wiki/The_Blue_Marble">project</a>.
					</p>

					<p>
						If the sketch doesn't work, you probably need to change your browser to one that <a
							href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
					</p>

					<p>
						For more details, check the <a href="sourceCode/visitedCities.js">sketch source code</a> and the <a
							href="sourceCode/shaders/pointOnSphere.vert">vertex</a> and <a href="sourceCode/shaders/pointOnSphere.frag">fragment</a>
						shaders.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r74/three.js"></script>
	<script src="<?php echo $homeDir;?>js/OrbitControls.js"></script>
	<script src="sourceCode/visitedCities.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch__gui";
		var sketchContainer = "sketch__canvas"
		window.onload = runSketch;
	</script>
</body>
</html>