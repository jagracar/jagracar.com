<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, star, astronomy, dat.GUI';
$descriptionText = 'three.js star sketch';
$titleText = 'Star sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = true;
$addJQuery = false;
$sketch = 'star';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="/js/libs/OrbitControls.js" async></script>
<script type="text/javascript" src="sourceCode/star.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/threejsSketches.php">Three.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'threejsSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-canvas" id="sketch-canvas">
					<div class="sketch-gui" id="sketch-gui"></div>
				</div>

				<script id="vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/star.vert';?></script>
				<script id="fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/star.frag';?></script>

				<!-- Run the sketch -->
				<script>
					var guiContainer = "sketch-gui";
					var sketchContainer = "sketch-canvas"

					window.onload =  function() {
						runSketch();
					};
				</script>

				<p>
					This sketch simulates a star using a single sphere and the Ashima <a
						href="https://en.wikipedia.org/wiki/Simplex_noise">simplex noise</a>
					<a href="https://github.com/ashima/webgl-noise">implementation</a>
					for WebGL.
				</p>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/star.js">sketch
						source code</a> and the <a href="sourceCode/shaders/star.vert">vertex</a>
					and <a href="sourceCode/shaders/star.frag">fragment</a> shaders.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>