<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js exponential trend sketch';
$titleText = 'Exponential trend sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'exponentialTrend';
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
				<a href="<?php echo $homeDir;?>grafica.php">Grafica library</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'graficaSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas"></div>

				<p>You can choose between linear and logarithmic scales. Click the
					plot area to switch between the two.</p>

				<p>
					For more details, check the <a
						href="sourceCode/exponentialTrend.js">source code</a> or play with
					it at <a href="http://jsfiddle.net/jagracar/kzn2rpk4/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/grafica.min.js"></script>
	<script src="sourceCode/exponentialTrend.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(exponentialTrendSketch, "sketch-canvas");
	</script>
</body>
</html>