<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js multiple panels sketch';
$titleText = 'Multiple panels sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'multiplePanels';
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
				<a href="<?php echo $homeDir;?>grafica.php">Grafica library</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'graficaSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas"></div>

				<p>This example shows a way to create a multiple panel plot using
					several plots. One only needs to take care of the plots relative
					positions and the axes and labels that should be displayed for each
					plot.</p>
				<p>
					For more details, check the <a href="sourceCode/multiplePanels.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/j51efy35/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/grafica.min.js"></script>
	<script src="sourceCode/multiplePanels.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(multiplePanelsSketch, "sketch-canvas");
	</script>
</body>
</html>