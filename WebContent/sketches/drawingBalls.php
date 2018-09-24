<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, simulation, image processing';
$descriptionText = 'p5.js drawing balls sketch';
$titleText = 'Drawing balls sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'drawingBalls';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/drawingBalls.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/p5jsSketches.php">p5.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'p5jsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-wrapper">
					<div class="sketch-canvas" id="sketch-canvas"></div>
				</div>

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(drawingBallsSketch, "sketch-canvas");
					};
				</script>

				<p>
					This sketch was inspired by the <a
						href="http://roberthodgin.com/stippling/">stippling works</a> of
					Robert Hodgin.
				</p>

				<p>A new ball or particle is added in each frame. The particles take
					the colors of an underground image, and their sizes are
					proportional to the pixel brightness. Clicking the canvas will
					produce a small explosion.</p>

				<p>
					The background picture is from <a
						href="https://www.flickr.com/photos/sukanto_debnath/3081836966/">Sukanto
						Debnath</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/drawingBalls.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/25ad67cq/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>