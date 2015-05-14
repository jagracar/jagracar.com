<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'flaringStar';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, star, flares, simulation, Perlin noise">
<meta name="description" content="p5.js flaring star sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Flaring star sketch - jagracar</title>

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
					<p>Being an astronomer, I had to do it :)</p>

					<p>
						The inspiration came from the <a href="http://en.wikipedia.org/wiki/Perlin_noise">Perlin noise</a> fire effect <a
							href="http://www.openprocessing.org/sketch/112601">sketch</a> by <a href="http://luis.net/">Luis Gonzalez</a>.
						Move the cursor to change the star's flaring activity and speed.
					</p>

					<p>
						For more details, check the <a href="sourceCode/flaringStar.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/ra9k7wqy/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="sourceCode/flaringStar.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(flaringStarSketch, "sketch__canvas");
	</script>
</body>
</html>