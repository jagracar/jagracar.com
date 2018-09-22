<?php
// General php variables
$homeDir = '';
$page = 'threejs';
$keywords = 'processing, java, three.js, interactive, examples, 3D';
$descriptionText = 'Three.js experiments';
$titleText = 'three.js sketches - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
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
				<a href="/threejsSketches.php">Three.js sketches</a>
			</h2>
		</header>

		<div class="sketches-container">
			<!-- Sketches list -->
<?php require $homeDir . 'threejsSketchesList.php';?>

    		<section class="sketch">
				<header>
					<h3>The three.js library</h3>
				</header>

				<p>
					Some experiments done with the <a href="http://threejs.org/">three.js</a>
					library.
				</p>
			</section>
		</div>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>