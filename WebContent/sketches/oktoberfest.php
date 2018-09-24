<?php
// General php variables
$homeDir = '../';
$page = 'grafica';
$keywords = 'processing, p5.js, P5js, openFrameworks, javaScript, grafica, grafica.js, ofxGrafica, examples, plot';
$descriptionText = 'p5.js and grafica.js Oktoberfest sketch';
$titleText = 'Oktoberfest sketch - jagracar';
$addP5js = true;
$addGrafica = true;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
$sketch = 'oktoberfest';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script type="text/javascript" src="sourceCode/oktoberfest.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="/grafica.php">Grafica library</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'graficaSketchesList.php';?>

			<section class="sketch" id="widthRef">
				<div class="sketch-wrapper">
					<div class="sketch-canvas" id="sketch-canvas"></div>
				</div>

				<!-- Run the sketch -->
				<script>
					window.onload = function() {
						var sketch = new p5(oktoberfestSketch, "sketch-canvas");
					};
				</script>

				<p>
					Every 4 years two main events in Germany coincide in time. The <a
						href="http://en.wikipedia.org/wiki/Oktoberfest">Oktoberfest</a>
					takes place every year in Munich during the last two weeks of
					September and beginning of October. The German elections day (<a
						href="http://en.wikipedia.org/wiki/Elections_in_Germany">Bundestagswahl</a>)
					happens every 4 year almost a the same time. I wonder how many
					Germans try to vote totally drunk after a whole day at the
					Oktoberfest...
				</p>

				<p>
					The data was obtained from <a href="http://www.google.com/trends/">Google
						trends</a>. Click near the points to display the labels.
				</p>
				<p>
					For more details, check the <a href="sourceCode/oktoberfest.js">source
						code</a> or play with it at <a
						href="http://jsfiddle.net/jagracar/34mm712n/">JSFiddle</a>.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>