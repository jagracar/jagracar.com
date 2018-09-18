<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, tree, typography, words, toxiclibs.js';
$descriptionText = 'p5.js evolving words sketch';
$titleText = 'Evolving words sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'evolvingWords';
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

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/toxiclibs.js"></script>
	<script src="sourceCode/evolvingWords.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(evolvingWordsSketch, "sketch-canvas");
	</script>
</body>
</html>