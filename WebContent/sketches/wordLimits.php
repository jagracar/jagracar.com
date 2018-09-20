<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, words, borders, gravity, simulation';
$descriptionText = 'p5.js word limits sketch';
$titleText = 'Word limits sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'wordLimits';
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
				<div class="sketch-canvas" id="sketch-canvas"></div>

				<p>Only words have limits... so don't use them to set yours.</p>

				<p>Works with any kind of font or shape. Click the canvas to
					restart.</p>

				<p>
					For more details, check the <a href="sourceCode/wordLimits.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/n759oogd/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript" src="sourceCode/wordLimits.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(wordLimitsSketch, "sketch-canvas");
	</script>
</body>
</html>