<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js moving points sketch';
$titleText = 'Moving points sketch - jagracar';
$addP5js = true;
$addGrafica = true;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'movingPoints';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/movingPoints.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/grafica.php">Grafica library</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'graficaSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas"></div>

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(movingPointsSketch, "sketch-canvas");
					};
				</script>

				<p>It's possible to have multiple data sets (layers) in the same
					plot. It's also possible to display them with different properties.</p>

				<p>In this example we have two layers. We are drawing the points
					from the first layer as red circles, and those in the second layer
					as a closed filled contour. The points from the first layer are
					updated every few frames. Drag the plot area with the mouse to pan.
					Click to change the point rotation.</p>

				<p>
					For more details, check the <a href="sourceCode/movingPoints.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/sjutpjks/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>