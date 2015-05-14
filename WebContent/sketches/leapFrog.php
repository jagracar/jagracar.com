<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'leapFrog';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="processing, p5.js, P5js, javaScript, examples, leapfrog algorithm, simulation, image processing">
<meta name="description" content="p5.js leapfrog sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Leapfrog sketch - jagracar</title>

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
					<div class="sketch__canvas is-framed" id="sketch__canvas"></div>
				</div>

				<div class="sketch__description">
					<p>
						The beauty of the <a href="http://en.wikipedia.org/wiki/Leapfrog_integration">leapfrog algorithm</a>. This sketch
						simulates the movement of several solar systems. Planets rotate around their respective suns following <a
							href="http://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation">Newton's law of universal
							gravitation</a>. As they move, the pixels from the background image are revealed. Click the screen to reset.
					</p>

					<p>
						The background picture is from <a href="https://www.flickr.com/photos/proimos/7810727314">Alex Proimos</a>.
					</p>

					<p>
						For more details, check the <a href="sourceCode/leapFrog.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/Lyncdtdz/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="sourceCode/leapFrog.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(leapFrogSketch, "sketch__canvas");
	</script>
</body>
</html>