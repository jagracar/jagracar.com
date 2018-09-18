<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, webcam, shaders, dat.GUI';
$descriptionText = 'three.js webcam sketch';
$titleText = 'Webcam sketch - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'webcam';
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

				<script id="vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/webcam.vert';?></script>
				<script id="fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/webcam.frag';?></script>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/webcam.js">sketch
						source code</a> and the <a
						href="sourceCode/shaders/pointOnSphere.vert">vertex</a> and <a
						href="sourceCode/shaders/pointOnSphere.frag">fragment</a> shaders.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.2/dat.gui.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/three.js/95/three.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/CopyShader.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/FilmShader.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/EffectComposer.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/MaskPass.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/RenderPass.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/FilmPass.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/ShaderPass.js"></script>
	<script src="<?php echo $homeDir;?>js/libs/objectdetect.js"></script>
	<script
		src="<?php echo $homeDir;?>js/libs/objectdetect.frontalface_alt.js"></script>
	<script src="sourceCode/webcam.js"></script>

	<!-- Run the sketch -->
	<script>
		var guiContainer = "sketch-gui";
		var sketchContainer = "sketch-canvas";
		window.onload = runSketch;
	</script>
</body>
</html>