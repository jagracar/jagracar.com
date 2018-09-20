<?php
// General php variables
$homeDir = '../';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples, sea, fish, flocking, simulation, dat.GUI';
$descriptionText = 'p5.js sea life sketch sketch';
$titleText = 'Sea life sketch sketch - jagracar';
$addP5js = true;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = false;
$addJQuery = false;
$sketch = 'seaLife';
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
				<div class="sketch-canvas" id="sketch-canvas">
					<div class="sketch-gui" id="sketch-gui"></div>
				</div>

				<p>
					Everything started from the <a
						href="http://libcinder.org/docs/v0.8.4/flocking_chapter1.html">flocking
						tutorial</a> written by <a href="http://roberthodgin.com/">Robert
						Hodgin</a> and some of the <a href="http://libcinder.org/">Cinder</a>
					crew.
				</p>

				<p>
					The idea is that with simple rules one can simulate complex group
					behaviors. <a
						href="http://en.wikipedia.org/wiki/Craig_Reynolds_(computer_graphics)">Craig
						Reynolds</a> was the first one to put these ideas into <a
						href="http://www.red3d.com/cwr/boids/">computer animations</a>
					back in 1986.
				</p>

				<p>
					In addition to <a href="http://p5js.org/">p5.js</a>, this sketch
					makes use of the <a href="https://code.google.com/p/dat-gui/">dat.GUI</a>
					JavaScript library to display the controls.
				</p>

				<p>
					For more details, check the <a href="sourceCode/seaLife.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/2ctqfwwo/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript" src="sourceCode/seaLife.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch-gui";
		var sketch = new p5(seaLifeSketch, "sketch-canvas");
	</script>
</body>
</html>