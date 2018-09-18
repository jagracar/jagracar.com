<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, words, image processing, sensual';
$descriptionText = 'p5.js thousand words sketch';
$titleText = 'Thousand words sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'thousandWords';
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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'p5jsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas"></div>

				<p>Type some text on the keyboard to reveal the background image.
					Every left/right click will decrease/increase the lines separation.</p>

				<p>
					The background picture is from <a
						href="https://www.flickr.com/photos/gagilas/4495968987">Petras
						Gagilas</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/thousandWords.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/ko4zrh65/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
	<script src="sourceCode/thousandWords.js"></script>

	<!-- Run the sketch -->
	<script>
		var sketch = new p5(thousandWordsSketch, "sketch-canvas");
	</script>
</body>
</html>