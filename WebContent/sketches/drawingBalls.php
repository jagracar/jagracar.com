<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'drawingBalls';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, simulation, image processing">
<meta name="description" content="p5.js drawing balls sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Drawing balls sketch - jagracar</title>

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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'p5jsSketchesList.php';?>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas"></div>
				</div>

				<div class="sketch__description">
					<p>
						This sketch was inspired by the <a href="http://roberthodgin.com/stippling/">stippling works</a> of Robert Hodgin.
					</p>

					<p>A new ball or particle is added in each frame. The particles take the colors of an underground image, and
						their sizes are proportional to the pixel brightness. Clicking the canvas will produce a small explosion.</p>

					<p>
						The background picture is from <a href="https://www.flickr.com/photos/sukanto_debnath/3081836966/">Sukanto
							Debnath</a>.
					</p>

					<p>
						For more details, check the <a href="sourceCode/drawingBalls.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/25ad67cq/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/p5.min.js"></script>
	<script src="sourceCode/drawingBalls.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(drawingBallsSketch, "sketch__canvas");
	</script>
</body>
</html>