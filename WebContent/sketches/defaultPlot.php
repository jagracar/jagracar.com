<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js default plot sketch';
$titleText = 'Default plot sketch - jagracar';
$addP5js = true;
$addGrafica = true;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'defaultPlot';
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

				<p>This example shows how easy is to include a XY plot in your
					sketches. Create a new GPlot, fill an array with points, add the
					array to the plot, write the title and axis labels and you are
					done. It's that simple!</p>

				<p>
					For more details, check the <a href="sourceCode/defaultPlot.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/vzzkrdej/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript" src="sourceCode/defaultPlot.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(defaultPlotSketch, "sketch-canvas");
	</script>
</body>
</html>