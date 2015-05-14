<?php
	// General php variables
	$page = 'threejs';
	$homeDir = '../';
	$sketch = 'loadScan';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="three.js, javaScript, examples, 3D, scan, kinect">
<meta name="description" content="three.js test sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Load scan sketch - jagracar</title>

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
				<a href="<?php echo $homeDir;?>threejsSketches.php">Three.js
					sketches</a>
			</h1>
		</header>

		<!-- Examples side bar -->
		<?php include_once $homeDir . 'threejsExamplesSideBar.php';?>

		<div class="p5js-mainContent">
			<div class="p5js-sketch" id="widthRef">
				<div class="p5js-sketch__wrapper">
					<div class="p5js-sketch__canvas" id="p5js-sketch__canvas"></div>
				</div>

				<div class="p5js-sketch__description">
					<p>This is my first test</p>

					<p>
						For more details, check the <a href="sourceCode/loadScan.js">source
							code</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.js"></script>
	<script src="<?php echo $homeDir;?>js/orbitControls.js"></script>
	<script src="sourceCode/loadScan.js"></script>

	<!-- Run the sketch -->
	<script>
	    var sketchContainer = "p5js-sketch__canvas"
		window.onload = runSketch;
    </script>
</body>