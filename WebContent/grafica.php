<?php
// General php variables
$homeDir = '';
$page = 'grafica';
$keywords = 'grafica, grafica.js, ofxGrafica, library, processing, p5.js, openFrameworks, java, javaScript, examples';
$descriptionText = 'The grafica library home page';
$titleText = 'Grafica library - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = false;
$sketch = '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<!-- Main content -->
	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				<a href="<?php echo $homeDir; ?>grafica.php">Grafica library</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'graficaSketchesList.php';?>

    		<div class="sketch">
				<section>
					<header>
						<h3>The library</h3>
					</header>

					<p>
						Grafica is a simple and configurable plotting library for <a
							href="https://processing.org/">Processing</a>. With it you can
						easily create 2D plots that will enjoy the full interactive
						capabilities of Processing.
					</p>

					<p>
						The library is available in two flavors: the <a
							href="https://github.com/jagracar/grafica">Java version</a> to
						use directly with Processing, and the <a
							href="https://github.com/jagracar/grafica.js">JavaScript version</a>
						to use with <a href="http://p5js.org/">p5.js</a>.
					</p>
				</section>

				<section>
					<header>
						<h3>Main features</h3>
					</header>

					<ul>
						<li>Make fancy scatter and linear plots that update in real time.</li>
						<li>Display histograms in the vertical and horizontal directions.</li>
						<li>Add several layers with different properties to the same plot.</li>
						<li>It works both with linear and logarithmic scales.</li>
						<li>Automatic axis tick determination.</li>
						<li>Interactive zooming and panning. Make your data move!</li>
						<li>Add labels to your points and display them with one click.</li>
						<li>You can use images to represent your points.</li>
						<li>Highly customizable. Defaults are nice, but you can tweak
							almost everything.</li>
						<li>Processing coding style. If you are used to work with
							Processing (or p5.js), grafica will be very easy.</li>
						<li>It comes with a good set of examples.</li>
						<li>It's open source. Grafica is under the <a
							href="https://www.gnu.org/licenses/lgpl.html">GNU Lesser General
								Public License</a>. You can find the complete source code <a
							href="https://github.com/jagracar/grafica/tree/master/src/grafica">here</a>
							and <a
							href="https://github.com/jagracar/grafica.js/tree/master/src">here</a>.
						</li>
					</ul>
				</section>

				<section>
					<header>
						<h3>Installation</h3>
					</header>

					<p>
						Java version: download the <a
							href="https://raw.github.com/jagracar/grafica/master/releases/grafica.zip">latest
							library release</a> and follow the steps described in the <a
							href="https://github.com/processing/processing/wiki/How-to-Install-a-Contributed-Library">Processing
							wiki</a>.
					</p>

					<p>
						JavaScript version: download the <a
							href="https://raw.githubusercontent.com/jagracar/grafica.js/master/releases/grafica.min.js">latest
							minified library release</a> and follow the steps described <a
							href="http://p5js.org/libraries/">here</a>.
					</p>
				</section>
			</div>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>