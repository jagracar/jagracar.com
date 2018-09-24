<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, webcam, shaders, dat.GUI';
$descriptionText = 'three.js webcam sketch';
$titleText = 'Webcam sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = true;
$addJQuery = false;
$sketch = 'webcam';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="/js/libs/CopyShader.js" async></script>
<script type="text/javascript" src="/js/libs/FilmShader.js" async></script>
<script type="text/javascript" src="/js/libs/EffectComposer.js" async></script>
<script type="text/javascript" src="/js/libs/MaskPass.js" async></script>
<script type="text/javascript" src="/js/libs/RenderPass.js" async></script>
<script type="text/javascript" src="/js/libs/FilmPass.js" async></script>
<script type="text/javascript" src="/js/libs/ShaderPass.js" async></script>
<script type="text/javascript" src="/js/libs/objectdetect.js" async></script>
<script type="text/javascript"
	src="/js/libs/objectdetect.frontalface_alt.js" async></script>
<script type="text/javascript" src="sourceCode/webcam.js" async></script>
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
				<div class="sketch-wrapper">
					<div class="sketch-canvas" id="sketch-canvas">
						<div class="sketch-gui" id="sketch-gui"></div>
					</div>
				</div>

				<script id="vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/webcam.vert';?></script>
				<script id="fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/webcam.frag';?></script>

				<!-- Run the sketch -->
				<script>
					var guiContainer = "sketch-gui";
					var sketchContainer = "sketch-canvas";

					window.onload =  function() {
						runSketch();
					};
				</script>

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
</body>
</html>