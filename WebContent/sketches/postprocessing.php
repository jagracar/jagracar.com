<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, postprocessing, dat.GUI';
$descriptionText = 'three.js posprocessing sketch';
$titleText = 'Postprocessing sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = true;
$addJQuery = false;
$sketch = 'postprocessing';
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
				<a href="<?php echo $homeDir;?>threejsSketches.php">Three.js
					sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'threejsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas">
					<div class="sketch-gui" id="sketch-gui"></div>
				</div>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/postprocessing.js">sketch
						source code</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/OrbitControls.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/ShaderPass.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/CopyShader.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/EffectComposer.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/MaskPass.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/FilmPass.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/ColorifyShader.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/FilmShader.js"></script>
	<script type="text/javascript"
		src="<?php echo $homeDir;?>js/libs/RenderPass.js"></script>
	<script type="text/javascript" src="sourceCode/postprocessing.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch-gui";
		var sketchContainer = "sketch-canvas";
		window.onload = runSketch;
	</script>
</body>
</html>