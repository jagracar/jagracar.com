<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, tree, simulation, nature, recursion';
$descriptionText = 'p5.js tree generator sketch';
$titleText = 'Tree generator sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'treeGenerator';
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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'p5jsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas is-framed" id="sketch-canvas"></div>

				<p>
					A relatively simple tree generator. The tree grows starting from a
					single branch using a <a
						href="http://en.wikipedia.org/wiki/Recursion">recursive</a>
					procedure. Click the screen to generate a new tree.
				</p>

				<p>
					For more details, check the <a href="sourceCode/treeGenerator.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/fqduk0wv/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript" src="sourceCode/treeGenerator.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(treeGeneratorSketch, "sketch-canvas");
	</script>
</body>
</html>