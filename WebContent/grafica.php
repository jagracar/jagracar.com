<?php
	// General php variables
	$page = 'grafica';
	$homeDir = '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="grafica, grafica.js, library, processing, p5.js, java, javaScript, examples">
<meta name="description" content="The grafica library home page">
<meta name="author" content="Javier Graciá Carpio">
<title>Grafica library - jagracar</title>

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir; ?>css/styles.css" />

<!-- Useful JavaScript files -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
	<!-- Navigation bar -->
	<?php include_once $homeDir . 'navBar.php';?>

	<div class="main-container">
		<header>
			<h1>
				<a href="<?php echo $homeDir; ?>grafica.php">Grafica library</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php	include_once $homeDir . 'graficaSketchesList.php';?>

		<div class="sketch-container">
			<h2>The library</h2>

			<p>
				Grafica is a simple and configurable plotting library for <a href="https://processing.org/">Processing</a>. With it
				you can easily create 2D plots that will enjoy the full interactive capabilities of Processing.
			</p>

			<p>
				The library is available in two flavors: the <a href="https://github.com/jagracar/grafica">Java version</a> to use
				directly with Processing, and the <a href="https://github.com/jagracar/grafica.js">JavaScript version</a> to use
				with <a href="http://p5js.org/">p5.js</a>.
			</p>

			<h2>Main features</h2>

			<ul>
				<li>Make fancy scatter and linear plots that update in real time.</li>
				<li>Display histograms in the vertical and horizontal directions.</li>
				<li>Add several layers with different properties to the same plot.</li>
				<li>It works both with linear and logarithmic scales.</li>
				<li>Automatic axis tick determination.</li>
				<li>Interactive zooming and panning. Make your data move!</li>
				<li>Add labels to your points and display them with one click.</li>
				<li>You can use images to represent your points.</li>
				<li>Highly customizable. Defaults are nice, but you can tweak almost everything.</li>
				<li>Processing coding style. If you are used to work with Processing (or p5.js), grafica will be very easy.</li>
				<li>It comes with a good set of examples.</li>
				<li>It's open source. Grafica is under the <a href="https://www.gnu.org/licenses/lgpl.html">GNU Lesser
						General Public License</a>. You can find the complete source code <a
					href="https://github.com/jagracar/grafica/tree/master/src/grafica">here</a> and <a
					href="https://github.com/jagracar/grafica.js/tree/master/src">here</a>.
				</li>
			</ul>

			<h2>Installation</h2>

			<p>
				Java version: download the <a href="https://raw.github.com/jagracar/grafica/master/releases/grafica.zip">latest
					library release</a> and follow the steps described in the <a
					href="https://github.com/processing/processing/wiki/How-to-Install-a-Contributed-Library">Processing wiki</a>.
			</p>

			<p>
				JavaScript version: download the <a
					href="https://raw.githubusercontent.com/jagracar/grafica.js/master/releases/grafica.min.js">latest minified
					library release</a> and follow the steps described <a href="http://p5js.org/libraries/">here</a>.
			</p>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>
</body>
</html>