<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords" content="<?php echo $keywords;?>">
<meta name="description" content="<?php echo $descriptionText;?>">
<meta name="author" content="Javier Gracia Carpio">

<title><?php echo $titleText;?></title>

<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- CSS files -->
<link rel="stylesheet" href="/css/styles.css">
<?php if($addP5js || $addGrafica || $addToxiclibs || $addDatGui || $addThreejs || $addJQuery): ?>

<!-- JavaScript files -->
<?php endif ?>
<?php if($addP5js): ?>
<script type="text/javascript" src="/js/libs/p5.min.js" async></script>
<?php endif ?>
<?php if($addGrafica): ?>
<script type="text/javascript" src="/js/libs/grafica.min.js" async></script>
<?php endif ?>
<?php if($addToxiclibs): ?>
<script type="text/javascript" src="/js/libs/toxiclibs.min.js" async></script>
<?php endif ?>
<?php if($addDatGui): ?>
<script type="text/javascript" src="/js/libs/dat.gui.min.js" async></script>
<?php endif ?>
<?php if($addThreejs): ?>
<script type="text/javascript" src="/js/libs/three.min.js"></script>
<?php endif ?>
<?php if($addJQuery): ?>
<script type="text/javascript" src="/js/libs/jquery-3.3.1.min.js" async></script>
<?php endif ?>
