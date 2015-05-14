<?php
	// General php variables
	$page = 'p5js';
	$homeDir = '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, p5.js, P5js, javaScript, examples">
<meta name="description" content="Some p5.js examples">
<meta name="author" content="Javier Graciá Carpio">
<title>p5.js sketches - jagracar</title>

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css" />

<!-- Useful JavaScript files -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
	<!-- Navigation bar -->
	<?php include_once $homeDir . 'navBar.php';?>

	<div class=main-container>
		<header>
			<h1>
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h1>
		</header>

		<!-- Sketches list -->
		<?php include_once $homeDir . 'p5jsSketchesList.php';?>

		<div class="sketch-container">
			<h2>Processing and P5.js</h2>

			<p>
				<a href="https://processing.org/">Processing</a> is an intuitive and very easy to use Java library designed to help
				artist and students to create interactive computer animations.
			</p>

			<p>
				Until very recently, <a href="http://en.wikipedia.org/wiki/Java_applet">Java applets</a> were the only simple way to
				include Processing sketches in web pages. Unfortunately, during the last couple of years these applets have become
				less and less common in the web. Even some web browsers like Chrome do not support them anymore. <a
					href="http://p5js.org/">P5.js</a> came to solve that problem. It reproduces most of the Processing 2D features (3D
				still to come) with the added <a href="http://en.wikipedia.org/wiki/Document_Object_Model">DOM</a> functionalities
				of JavaScript.
			</p>

			<p>
				This page compiles some of my p5.js sketches. They all have a Creative Commons Attribution-ShareAlike <a
					href="http://creativecommons.org/licenses/by-sa/4.0/">license</a>, so feel free to modify them to your needs. You
				only need to give the appropriate credit to the original work and share them with a similar license. Let's make this
				world more collaborative and a little bit less restrictive!
			</p>

			<p>Note: some of the sketches are quite computational intensive and might run slow on mobile devices.</p>
		</div>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>
</body>
</html>