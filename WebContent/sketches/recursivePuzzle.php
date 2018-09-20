<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, puzzle, recursion, image processing';
$descriptionText = 'p5.js recursive puzzle sketch';
$titleText = 'Recursive puzzle sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'recursivePuzzle';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/recursivePuzzle.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
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

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(recursivePuzzleSketch, "sketch-canvas");
					};
				</script>

				<p>This sketch simulates a recursive sliding puzzle. Click the
					screen to increase or decrease the level of recursion.</p>

				<p>
					The picture is from <a
						href="https://www.flickr.com/photos/sukanto_debnath/2181170020">Sukanto
						Debnath</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/recursivePuzzle.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/478qvh4o/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>