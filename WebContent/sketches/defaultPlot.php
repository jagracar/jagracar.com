<?php
	// General php variables
	$page = 'grafica';
	$homeDir = '../';
	$sketch = 'defaultPlot';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, grafica, grafica.js, examples, plot">
<meta name="description" content="p5.js and grafica.js default plot sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Default plot sketch - jagracar</title>

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
					<p>This example shows how easy is to include a XY plot in your sketches. Create a new GPlot, fill an array with
						points, add the array to the plot, write the title and axis labels and you are done. It's that simple!</p>

					<p>
						For more details, check the <a href="sourceCode/defaultPlot.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/vzzkrdej/">JSFiddle</a>.
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
	<script src="sourceCode/defaultPlot.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(defaultPlotSketch, "sketch__canvas");
	</script>
</body>
</html>