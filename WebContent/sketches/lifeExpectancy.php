<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js life expectancy sketch';
$titleText = 'Life expectancy sketch - jagracar';
$addP5js = true;
$addGrafica = true;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'lifeExpectancy';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/lifeExpectancy.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/grafica.php">Grafica library</a>
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
						var sketch = new p5(lifeExpectancySketch, "sketch-canvas");
					};
				</script>

				<p>
					This example was motivated by two <a
						href="http://lisacharlotterost.github.io/2016/05/17/one-chart-tools/">blog</a>
					<a
						href="http://lisacharlotterost.github.io/2016/05/17/one-chart-code/">entries</a>
					posted by Lisa Charlotte Rost on her <a
						href="http://lisacharlotterost.github.io">blog</a>. It shows the
					tight relationship between a country's average personal income and
					the average life expectancy. The point areas are proportional to
					the country's population. Left click on a point to see the country
					name. Drag the plot area with the mouse to pan in any direction.
					Zoom in and out with the mouse central button.
				</p>
				<p>
					For more details, check the <a href="sourceCode/lifeExpectancy.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/eobueeps/1/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>