<?php
	// General php variables
	$page = 'kinect';
	$homeDir = '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="processing, java, kinect, interactive, examples">
<meta name="description" content="Kinect experiments">
<meta name="author" content="Javier Graciá Carpio">
<title>Kinect - jagracar</title>

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

	<div class="main-container">
		<header>
			<h1>Kinect</h1>
		</header>

		<p>TBD</p>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>
</body>
</html>