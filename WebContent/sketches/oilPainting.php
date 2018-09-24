<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, oil painting, simulation';
$descriptionText = 'p5.js oil painting simulation sketch';
$titleText = 'Oil painting simulation sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'oilPainting';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/oilPainting.js" async></script>
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
						var sketch = new p5(oilPaintingSketch, "sketch-canvas");
					};
				</script>

				<p>
					This sketch simulates an oil paint using a background picture as a
					reference (in this case an old <a href="img/me.jpg">picture</a>
					from me and my sister). The work by <a
						href="http://www.sergioalbiac.com/">Sergio Albiac</a> was the main
					source of inspiration.
				</p>

				<p>
					The sketch has many optional parameters, but not all combinations
					produce optimal results. Probably, the most useful parameter is <em>maxColorDiff</em>.
					Modify it to change the painting precision form high (30, 30, 30)
					to low precision (90, 90, 90).
				</p>

				<p>These videos show the program in action with other pictures:</p>

				<div class="video-container">
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/82769195"></iframe>
					</div>
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/82886433"></iframe>
					</div>
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/84089230"></iframe>
					</div>
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/82768695"></iframe>
					</div>
				</div>

				<p>This one shows the debug mode in action:</p>

				<div class="video-container">
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/82104781"></iframe>
					</div>
				</div>

				<p>Animations are also possible:</p>

				<div class="video-container">
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/84360699"></iframe>
					</div>
					<div class="vimeo-video">
						<iframe src="https://player.vimeo.com/video/84434019"></iframe>
					</div>
				</div>

				<p>
					For more details, check the <a href="sourceCode/oilPainting.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/xhbb2v3t/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>