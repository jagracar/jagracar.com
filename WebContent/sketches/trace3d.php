<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, trace, dat.GUI, toxiclibs';
$descriptionText = 'three.js trace 3D sketch';
$titleText = 'Trace 3D sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = true;
$addDatGui = true;
$addThreejs = true;
$addJQuery = false;
$sketch = 'trace3d';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="/js/libs/OrbitControls.js" async></script>
<script type="text/javascript" src="sourceCode/Trace.js" async></script>
<script type="text/javascript" src="sourceCode/trace3d.js" async></script>
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
				<div class="sketch-wrapper">
					<div class="sketch-canvas" id="sketch-canvas">
						<div class="sketch-gui" id="sketch-gui"></div>
					</div>
				</div>

				<!-- Run the sketch -->
				<script>
					var guiContainer = "sketch-gui";
					var sketchContainer = "sketch-canvas"

					window.onload =  function() {
						runSketch();
					};
				</script>

				<p>
					A set of points is interpolated with a spline curve using the <a
						href="http://haptic-data.com/toxiclibsjs">toxiclibs.js</a>
					library. The 3D trace is built over the points using a simple
					algorithm.
				</p>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/trace3d.js">sketch
						source code</a> and the <a href="sourceCode/Trace.js">Trace.js</a>
					class.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>