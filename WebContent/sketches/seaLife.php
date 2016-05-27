<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'seaLife';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, sea, fish, flocking, simulation, dat.GUI">
<meta name="description" content="p5.js flocking sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Sea life sketch - jagracar</title>

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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'p5jsSketchesList.php';?>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas" id="sketch__canvas">
						<div class="sketch__gui" id="sketch__gui"></div>
					</div>
				</div>

				<div class="sketch__description">
					<p>
						Everything started from the <a href="http://libcinder.org/docs/v0.8.4/flocking_chapter1.html">flocking
							tutorial</a> written by <a href="http://roberthodgin.com/">Robert Hodgin</a> and some of the <a
							href="http://libcinder.org/">Cinder</a> crew.
					</p>

					<p>
						The idea is that with simple rules one can simulate complex group behaviors. <a
							href="http://en.wikipedia.org/wiki/Craig_Reynolds_(computer_graphics)">Craig Reynolds</a> was the first one to
						put these ideas into <a href="http://www.red3d.com/cwr/boids/">computer animations</a> back in 1986.
					</p>

					<p>
						In addition to <a href="http://p5js.org/">p5.js</a>, this sketch makes use of the <a
							href="https://code.google.com/p/dat-gui/">dat.GUI</a> JavaScript library to display the controls.
					</p>

					<p>
						For more details, check the <a href="sourceCode/seaLife.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/2ctqfwwo/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/p5.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js"></script>
	<script src="sourceCode/seaLife.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch__gui";
		var sketch = new p5(seaLifeSketch, "sketch__canvas");
	</script>
</body>
</html>