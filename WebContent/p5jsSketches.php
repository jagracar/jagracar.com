<?php
// General php variables
$homeDir = '';
$page = 'p5js';
$keywords = 'processing, p5.js, P5js, javaScript, examples';
$descriptionText = 'Some p5.js examples';
$titleText = 'p5.js sketches - jagracar';
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
				<a href="<?php echo $homeDir;?>p5jsSketches.php">p5.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'p5jsSketchesList.php';?>

    		<section class="sketch">
				<header>
					<h3>Processing and P5.js</h3>
				</header>

				<p>
					<a href="https://processing.org/">Processing</a> is an intuitive
					and very easy to use Java library designed to help artist and
					students to create interactive computer animations.
				</p>

				<p>
					Until very recently, <a
						href="http://en.wikipedia.org/wiki/Java_applet">Java applets</a>
					were the only simple way to include Processing sketches in web
					pages. Unfortunately, during the last couple of years these applets
					have become less and less common in the web. Even some web browsers
					like Chrome do not support them anymore. <a href="http://p5js.org/">P5.js</a>
					came to solve that problem. It reproduces most of the Processing 2D
					features (3D still to come) with the added <a
						href="http://en.wikipedia.org/wiki/Document_Object_Model">DOM</a>
					functionalities of JavaScript.
				</p>

				<p>
					This page compiles some of my p5.js sketches. They all have a
					Creative Commons Attribution-ShareAlike <a
						href="http://creativecommons.org/licenses/by-sa/4.0/">license</a>,
					so feel free to modify them to your needs. You only need to give
					the appropriate credit to the original work and share them with a
					similar license. Let's make this world more collaborative and a
					little bit less restrictive!
				</p>

				<p>Note: some of the sketches are quite computational intensive and
					might run slow on mobile devices.</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>