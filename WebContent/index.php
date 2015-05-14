<?php
	// General php variables
	$page = 'home';
	$homeDir = '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="Home page, index">
<meta name="description" content="Home page of Javier Graciá Carpio">
<meta name="author" content="Javier Graciá Carpio">
<title>Home page - jagracar</title>

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
			<h1>Welcome to my home page!</h1>
		</header>

		<p>This is really work in progress...</p>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>
</body>