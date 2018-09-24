<?php
// General php variables
$homeDir = '../';
$page = 'threejs';
$keywords = 'three.js, javaScript, examples, 3D, galactic center, astronomy, science, dat.GUI, black hole, star';
$descriptionText = 'three.js Galactic center sketch';
$titleText = 'Galactic center sketch - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = true;
$addThreejs = false;
$addJQuery = false;
$sketch = 'galacticCenter';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript"
	src="https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.js"></script>
<script type="text/javascript" src="/js/libs/TrackballControls.js" async></script>
<script type="text/javascript" src="/js/libs/CopyShader.js" async></script>
<script type="text/javascript" src="/js/libs/MergeShader.js" async></script>
<script type="text/javascript" src="/js/libs/EffectComposer.js" async></script>
<script type="text/javascript" src="/js/libs/MaskPass.js" async></script>
<script type="text/javascript" src="/js/libs/RenderPass.js" async></script>
<script type="text/javascript" src="/js/libs/ShaderPass.js" async></script>
<script type="text/javascript" src="sourceCode/galacticCenter.js" async></script>
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

				<script id="star-vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/star.vert';?></script>
				<script id="star-fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/star.frag';?></script>
				<script id="bh-vertexShader" type="x-shader/x-vertex"><?php require 'sourceCode/shaders/blackHole.vert';?></script>
				<script id="bh-fragmentShader" type="x-shader/x-fragment"><?php require 'sourceCode/shaders/blackHole.frag';?></script>

				<!-- Run the sketch -->
				<script>
					var guiContainer = "sketch-gui";
					var infoClass = "sketch-info";
					var sketchContainer = "sketch-canvas";

					window.onload =  function() {
 						runSketch();
					};
				</script>

				<p>
					Some of my colleagues at the <a href="http://www.mpe.mpg.de/ir">MPE
						IR group</a> have been monitoring for more than 20 years the
					apparent position of the closest stars to the <a
						href="https://en.wikipedia.org/wiki/Galactic_Center">center</a> of
					the <a href="https://en.wikipedia.org/wiki/Milky_Way">Milky Way</a>.
					From those observations they managed to reconstruct their stellar
					orbits and found that their foci coincide with a single point in
					the sky, with an estimated mass of the order of 4.3 million times
					the mass of the Sun. The density derived from this mass and the
					length of the closest stellar approach is so high that the only
					plausible explanation is that a <a
						href="https://en.wikipedia.org/wiki/Supermassive_black_hole">supermassive
						black hole</a> resides at the center of the Milky Way.
				</p>

				<p>
					This sketch tries to simulate the movement of the stars around the
					Galactic Center black hole. The starting point uses the real
					deprojected stellar positions and velocities at a given moment in
					time kindly provided by Stefan Gillessen. The subsequent positions
					are calculated using <a
						href="https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation">Newton's
						law of universal gravitation</a> and the <a
						href="https://en.wikipedia.org/wiki/Leapfrog_integration">leapfrog
						algorithm</a>. The stellar colors and diameters are not real, as
					well as the black hole size and the optical effects that it
					produces.
				</p>

				<p>
					The background image is a 70 micron continuum <a
						href="http://archives.esac.esa.int/hsa/aio/jsp/postcardPage.jsp?OBSERVATION_OID=8387907">map</a>
					of the central 2 arcminutes of the Milky Way obtained with the <a
						href="http://www.mpe.mpg.de/ir/Pacs">PACS</a> photometer
					instrument on board of the <a href="http://sci.esa.int/herschel/">Herschel
						satellite</a>. The map was reduced using an automatic data
					processing pipeline that I have helped to develop as part of my
					work at MPE.
				</p>

				<p>
					If the sketch doesn't work, you probably need to change your
					browser to one that <a
						href="https://en.wikipedia.org/wiki/WebGL#Support">supports WebGL</a>.
				</p>

				<p>
					For more details, check the <a href="sourceCode/galacticCenter.js">sketch
						source code</a>, the star <a href="sourceCode/shaders/star.vert">vertex</a>
					and <a href="sourceCode/shaders/star.frag">fragment</a> shaders,
					and the black hole <a href="sourceCode/shaders/blackHole.vert">vertex</a>
					and <a href="sourceCode/shaders/blackHole.frag">fragment</a>
					shaders.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>