<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'evolvingWords';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="processing, p5.js, P5js, javaScript, examples, tree, typography, words, toxiclibs.js">
<meta name="description" content="p5.js evolving words sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Evolving words sketch - jagracar</title>

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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h1>
		</header>

		<!-- Sketch side bar -->
		<?php include_once $homeDir . 'sketchSideBar.php';?>

		<div class="p5js-mainContent">
			<div class="p5js-sketch" id="widthRef">
				<div class="p5js-sketch__wrapper">
					<div class="p5js-sketch__canvas" id="p5js-sketch__canvas"></div>
				</div>

				<div class="p5js-sketch__description">
					<p>Particles compose words, words make sentences, and sentences
						evolve into stories.</p>

					<p>
						In addition to <a href="http://p5js.org/">p5.js</a>, this sketch
						makes use of the <a href="http://haptic-data.com/toxiclibsjs">toxiclibs.js</a>
						library to calculate the particle positions with a <a
							href="http://en.wikipedia.org/wiki/Spline_%28mathematics%29">spline</a>
						curve.
					</p>

					<p>
						For more details, check the <a href="sourceCode/evolvingWords.js">source
							code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/s99n4c4p/">JSFiddle</a>.
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
	<script src="<?php echo $homeDir;?>js/toxiclibs.js"></script>
	<script src="sourceCode/evolvingWords.js"></script>

	<!-- Run the sketch -->
	<script>
	p5Sketch = new p5(evolvingWordsSketch, "p5js-sketch__canvas");
    </script>
</body>