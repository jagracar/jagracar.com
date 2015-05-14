<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'treeGenerator';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, tree, simulation, nature, recursion">
<meta name="description" content="p5.js tree generator sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Tree generator sketch - jagracar</title>

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
						A relatively simple tree generator. The tree grows starting from a single branch using a <a
							href="http://en.wikipedia.org/wiki/Recursion">recursive</a> procedure. Click the screen to generate a new tree.
					</p>

					<p>
						For more details, check the <a href="sourceCode/treeGenerator.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/fqduk0wv/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="sourceCode/treeGenerator.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(treeGeneratorSketch, "sketch__canvas");
	</script>
</body>
</html>