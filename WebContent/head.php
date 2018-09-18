<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="<?php echo $keywords;?>">
<meta name="description" content="<?php echo $descriptionText;?>">
<meta name="author" content="Javier Gracia Carpio">

<title><?php echo $titleText;?></title>

<link rel="icon" type="image/png"
	href="<?php echo $homeDir;?>favicon.png">

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css">
<?php if($addP5js || $addThreejs || $addJQuery): ?>

<!-- JavaScript files -->
<?php endif ?>
<?php if($addP5js): ?>
<script src="<?php echo $homeDir;?>js/libs/leaflet.js" async></script>
<?php endif ?>
<?php if($addThreejs): ?>
<script src="<?php echo $homeDir;?>js/libs/leaflet.js" async></script>
<?php endif ?>
<?php if($addJQuery): ?>
<script src="<?php echo $homeDir;?>js/libs/jquery-3.3.1.js" async></script>
<?php endif ?>
