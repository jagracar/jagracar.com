<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, star, flares, simulation, Perlin noise';
$descriptionText = 'p5.js flaring star sketch';
$titleText = 'Flaring star sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'flaringStar';
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

				<p>Being an astronomer, I had to do it :)</p>

				<p>
					The inspiration came from the <a
						href="http://en.wikipedia.org/wiki/Perlin_noise">Perlin noise</a>
					fire effect <a href="http://www.openprocessing.org/sketch/112601">sketch</a>
					by <a href="http://luis.net/">Luis Gonzalez</a>. Move the cursor to
					change the star's flaring activity and speed.
				</p>

				<p>
					For more details, check the <a href="sourceCode/flaringStar.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/ra9k7wqy/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript" src="sourceCode/flaringStar.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(flaringStarSketch, "sketch-canvas");
	</script>
</body>
</html>