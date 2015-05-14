<?php
	// General php variables
	$page = 'grafica';
	$homeDir = '../';
	$sketch = 'multiplePlots';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, grafica, grafica.js, examples, plot">
<meta name="description" content="p5.js and grafica.js multiple plots sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Multiple plots sketch - jagracar</title>

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
				<a href="<?php echo $homeDir;?>grafica.php">Grafica library</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'graficaSketchesList.php';?>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas"></div>
				</div>

				<div class="sketch__description">
					<p>This example shows many of the capabilities of the grafica library in action. Drag the mouse (+control key)
						over the first plot to pan in any direction. Left click to show the point labels. Click left in the second plot to
						re-center and use the mouse wheel to zoom. Click in the third plot to re-center. Click left/right in the fourth
						plot to zoom/un-zoom.</p>

					<p>
						The beer mug image is a slightly modified version of the work by <a
							href="http://www.clker.com/clipart-oktoberfest-beer-mug-1.html">KLARA 78</a>.
					</p>
					<p>
						For more details, check the <a href="sourceCode/multiplePlots.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/uvpxnudo/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/grafica.min.js"></script>
	<script src="sourceCode/multiplePlots.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(multiplePlotsSketch, "sketch__canvas");
	</script>
</body>
</html>