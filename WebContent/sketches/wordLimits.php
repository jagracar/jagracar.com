<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'wordLimits';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, words, borders, gravity, simulation">
<meta name="description" content="p5.js word limits sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Word limits sketch - jagracar</title>

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
					<p>Only words have limits... so don't use them to set yours.</p>

					<p>Works with any kind of font or shape. Click the canvas to restart.</p>

					<p>
						For more details, check the <a href="sourceCode/wordLimits.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/n759oogd/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/p5.min.js"></script>
	<script src="sourceCode/wordLimits.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(wordLimitsSketch, "sketch__canvas");
	</script>
</body>
</html>