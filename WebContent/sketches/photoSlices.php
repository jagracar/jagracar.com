<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, image processing';
$descriptionText = 'p5.js photo slices sketch';
$titleText = 'Photo slices sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'photoSlices';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/photoSlices.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
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

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(photoSlicesSketch, "sketch-canvas");
					};
				</script>

				<p>In this sketch an image is cut in vertical slices. Each slice
					moves independent from the others with some random noise.</p>

				<p>Clicking the canvas will increase or decrease the number of
					slices. Move the cursor around for some interaction.</p>

				<p>
					The background picture is from <a
						href="https://www.flickr.com/photos/sukanto_debnath/2354607553">Sukanto
						Debnath</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/photoSlices.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/csht44kc/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>