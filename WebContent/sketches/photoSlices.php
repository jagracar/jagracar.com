<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '../';
	$sketch = 'photoSlices';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="processing, p5.js, P5js, javaScript, examples, image processing">
<meta name="description" content="p5.js photo slices sketch">
<meta name="author" content="Javier Graciá Carpio">
<title>Photo slices sketch - jagracar</title>

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
					<p>In this sketch an image is cut in vertical slices. Each
						slice moves independent from the others with some random noise.</p>

					<p>Clicking the canvas will increase or decrease the number of
						slices. Move the cursor around for some interaction.</p>

					<p>
						The background picture is from <a
							href="https://www.flickr.com/photos/sukanto_debnath/2354607553">Sukanto
							Debnath</a>.
					</p>

					<p>
						For more details, check the <a href="sourceCode/photoSlices.js">source
							code</a> or play with it at <a
							href="http://jsfiddle.net/jagracar/csht44kc/">JSFiddle</a>.
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
	<script src="sourceCode/photoSlices.js"></script>

	<!-- Run the sketch -->
	<script>
	p5Sketch = new p5(photoSlicesSketch, "p5js-sketch__canvas");
    </script>
</body>