<?php
	// General php variables
	$page = 'threejs';
	$homeDir = '../';
	$sketch = 'trace3d';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="three.js, javaScript, examples, 3D, trace, dat.GUI, toxiclibs">
<meta name="description" content="three.js Trace 3D sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Trace 3D sketch - jagracar</title>

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

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas">
						<div class="sketch__gui" id="sketch__gui"></div>
					</div>
				</div>

				<div class="sketch__description">
					<p>
						A set of points is interpolated with a spline curve using the <a href="http://haptic-data.com/toxiclibsjs">toxiclibs.js</a>
						library. The 3D trace is built over the points using a simple algorithm.
					</p>

					<p>
						If the sketch doesn't work, you probably need to change your browser to one that <a
							href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
					</p>

					<p>
						For more details, check the <a href="sourceCode/trace3d.js">sketch source code</a> and the <a
							href="sourceCode/Trace.js">Trace.js</a> class.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.js"></script>
	<script src="<?php echo $homeDir;?>js/orbitControls.js"></script>
	<script src="<?php echo $homeDir;?>js/toxiclibs.js"></script>
	<script src="sourceCode/Trace.js"></script>
	<script src="sourceCode/trace3d.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch__gui";
		var sketchContainer = "sketch__canvas"
		window.onload = runSketch;
	</script>
</body>
</html>