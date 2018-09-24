<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, leapfrog algorithm, simulation, image processing';
$descriptionText = 'p5.js leapfrog sketch';
$titleText = 'Leapfrog sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'leapFrog';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/leapFrog.js" async></script>
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
					<div class="sketch-canvas is-framed" id="sketch-canvas"></div>
				</div>

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(leapFrogSketch, "sketch-canvas");
					};
				</script>

				<p>
					The beauty of the <a
						href="http://en.wikipedia.org/wiki/Leapfrog_integration">leapfrog
						algorithm</a>. This sketch simulates the movement of several solar
					systems. Planets rotate around their respective suns following <a
						href="http://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation">Newton's
						law of universal gravitation</a>. As they move, the pixels from
					the background image are revealed. Click the screen to reset.
				</p>

				<p>
					The background picture is from <a
						href="https://www.flickr.com/photos/proimos/7810727314">Alex
						Proimos</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/leapFrog.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/Lyncdtdz/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>