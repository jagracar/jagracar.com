<?php
	// General php variables
	$page = 'grafica';
	$homeDir = '../';
	$sketch = 'multiplePanels';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="processing, p5.js, P5js, javaScript, grafica, grafica.js, examples, plot">
<meta name="description"
	content="p5.js and grafica.js multiple panels sketch">
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

	<div class=main-container>
		<header>
			<h1>
				<a href="<?php echo $homeDir;?>grafica.php">Grafica library</a>
			</h1>
		</header>

		<!-- Examples side bar -->
		<?php include_once $homeDir . 'graficaExamplesSideBar.php';?>

		<div class="p5js-mainContent">
			<div class="p5js-sketch" id="widthRef">
				<div class="p5js-sketch__wrapper">
					<div class="p5js-sketch__canvas" id="p5js-sketch__canvas"></div>
				</div>

				<div class="p5js-sketch__description">
					<p>This example shows a way to create a multiple panel plot
						using several plots. One only needs to take care of the plots
						relative positions and the axes and labels that should be
						displayed for each plot.</p>
					<p>
						For more details, check the <a href="sourceCode/multiplePanels.js">source
							code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/j51efy35/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="<?php echo $homeDir;?>js/grafica.min.js"></script>
	<script src="sourceCode/multiplePanels.js"></script>

	<!-- Run the sketch -->
	<script>
	p5Sketch = new p5(multiplePanelsSketch, "p5js-sketch__canvas");
    </script>
</body>