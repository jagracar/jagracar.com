<?php
// General php variables
$page = 'grafica';
$homeDir = '../';
$sketch = 'lifeExpectancy';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="processing, p5.js, P5js, javaScript, grafica, grafica.js, examples, plot">
<meta name="description"
	content="p5.js and grafica.js life expectancy sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Multiple panels sketch - jagracar</title>

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css" />

<!-- Useful JavaScript files -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
	<!-- Navigation bar -->
	<?php include_once $homeDir . 'navBar.php';?>

	<div class="main-container">
		<header>
			<h1>
				<a href="<?php echo $homeDir;?>grafica.php">Grafica library</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'graficaSketchesList.php';?>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas"></div>
				</div>

				<div class="sketch__description">
					<p>
						This example was motivated by two <a
							href="http://lisacharlotterost.github.io/2016/05/17/one-chart-tools/">blog</a>
						<a
							href="http://lisacharlotterost.github.io/2016/05/17/one-chart-code/">entries</a>
						posted by Lisa Charlotte Rost on her <a
							href="http://lisacharlotterost.github.io">blog</a>. It shows the
						tight relationship between a country's average personal income
						and the average life expectancy. The point areas are proportional
						to the country's population. Left click on a point to see the
						country name. Drag the plot area with the mouse to pan in any
						direction. Zoom in and out with the mouse central button.
					</p>
					<p>
						For more details, check the <a href="sourceCode/lifeExpectancy.js">source
							code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/eobueeps/1/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/grafica.min.js"></script>
	<script src="sourceCode/lifeExpectancy.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(lifeExpectancySketch, "sketch__canvas");
	</script>
</body>
</html>