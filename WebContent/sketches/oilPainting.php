<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'oilPainting';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples, oil painting, simulation">
<meta name="description" content="p5.js oil painting simulation sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Oil painting simulation sketch - jagracar</title>

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
		<?php include_once $homeDir . 'p5jsSketchesList.php';?>

		<div class="sketch-container">
			<div class="sketch" id="widthRef">
				<div class="sketch__wrapper">
					<div class="sketch__canvas is-framed" id="sketch__canvas"></div>
				</div>

				<div class="sketch__description">
					<p>
						This sketch simulates an oil paint using a background picture as a reference (in this case an old <a
							href="img/me.jpg">picture</a> from me and my sister). The work by <a href="http://www.sergioalbiac.com/">Sergio
							Albiac</a> was the main source of inspiration.
					</p>

					<p>
						The sketch has many optional parameters, but not all combinations produce optimal results. Probably, the most
						useful parameter is <em>maxColorDiff</em>. Modify it to change the painting precision form high (30, 30, 30) to
						low precision (90, 90, 90).
					</p>

					<p>These videos show the program in action with other pictures:</p>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/82769195?title=0&byline=0&portrait=0"></iframe>
					</div>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/82886433?title=0&byline=0&portrait=0"></iframe>
					</div>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/84089230?title=0&byline=0&portrait=0"></iframe>
					</div>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/82768695?title=0&byline=0&portrait=0"></iframe>
					</div>

					<p>This one shows the debug mode in action:</p>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/82104781?title=0&byline=0&portrait=0"></iframe>
					</div>

					<p>Animations are also possible:</p>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/84360699?title=0&byline=0&portrait=0"></iframe>
					</div>

					<div class="video-container">
						<iframe src="https://player.vimeo.com/video/84434019?title=0&byline=0&portrait=0"></iframe>
					</div>

					<p>
						For more details, check the <a href="sourceCode/oilPainting.js">source code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/xhbb2v3t/">JSFiddle</a>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.4/p5.min.js"></script>
	<script src="sourceCode/oilPainting.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(oilPaintingSketch, "sketch__canvas");
	</script>
</body>
</html>