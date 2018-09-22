<?php
// General php variables
$homeDir = '';
$page = 'home';
$keywords = 'index, home page';
$descriptionText = 'Home page of Javier Graciá Carpio';
$titleText = 'Home page - jagracar';
$addP5js = false;
$addGrafica = false;
$addToxiclibs = false;
$addDatGui = false;
$addThreejs = false;
$addJQuery = false;
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
			<h2>Welcome to my home page!</h2>
		</header>

		<p>This is work in progress...</p>

		<p>
			This web is basically an excuse to improve my HTML, CSS, PHP and
			JavaScript skills. If you want to see how it works internally, you
			can check the <a href="https://github.com/jagracar/jagracar.com">GitHub
				repository</a>
		</p>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>
</body>
</html>