<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="<?php echo $keywords;?>">
<meta name="description" content="<?php echo $descriptionText;?>">
<meta name="author" content="Javier Gracia Carpio">

<title><?php echo $titleText;?></title>

<link rel="icon" type="image/x-icon"
	href="<?php echo $homeDir;?>favicon.ico">

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css">
<?php if($addP5js || $addGrafica || $addToxiclibs || $addDatGui || $addThreejs || $addJQuery): ?>

<!-- JavaScript files -->
<?php endif ?>
<?php if($addP5js): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/p5.min.js"></script>
<?php endif ?>
<?php if($addGrafica): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/grafica.js"></script>
<?php endif ?>
<?php if($addToxiclibs): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/toxiclibs.min.js"></script>
<?php endif ?>
<?php if($addDatGui): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/dat.gui.min.js"></script>
<?php endif ?>
<?php if($addThreejs): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/three.min.js"></script>
<?php endif ?>
<?php if($addJQuery): ?>
<script type="text/javascript"
	src="<?php echo $homeDir;?>js/libs/jquery-3.3.1.js" async></script>
<?php endif ?>
