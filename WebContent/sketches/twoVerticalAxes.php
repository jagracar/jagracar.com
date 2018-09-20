<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js two vertical axes sketch';
$titleText = 'Two vertical axes sketch - jagracar';
$addP5js = true;
$addGrafica = true;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'twoVerticalAxes';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/twoVerticalAxes.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
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

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(twoVerticalAxesSketch, "sketch-canvas");
					};
				</script>

				<p>This example shows a way to display a plot with two different
					vertical axes. Drag the plot area with the mouse to pan in any
					direction.</p>
				<p>
					For more details, check the <a href="sourceCode/twoVerticalAxes.js">source
						code</a> or play with it at <a
						href="https://jsfiddle.net/jagracar/yy20s2mL/4/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>