<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, tree, typography, words, toxiclibs.js';
$descriptionText = 'p5.js evolving words sketch';
$titleText = 'Evolving words sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = true;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'evolvingWords';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/evolvingWords.js" async></script>
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
						var sketch = new p5(evolvingWordsSketch, "sketch-canvas");
					};
				</script>

				<p>Particles compose words, words make sentences, and sentences
					evolve into stories.</p>

				<p>
					In addition to <a href="http://p5js.org/">p5.js</a>, this sketch
					makes use of the <a href="http://haptic-data.com/toxiclibsjs">toxiclibs.js</a>
					library to calculate the particle positions with a <a
						href="http://en.wikipedia.org/wiki/Spline_%28mathematics%29">spline</a>
					curve.
				</p>

				<p>
					For more details, check the <a href="sourceCode/evolvingWords.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/s99n4c4p/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>