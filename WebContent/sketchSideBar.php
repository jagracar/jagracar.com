<?php $activeSketch = 'active-sketch';?>

<div class="p5js-sideMenu">
	<h2>Examples</h2>

	<ul>
		<li><a href="<?php echo $homeDir;?>sketches/oilPainting.php"
			class="<?php if($sketch == 'oilPainting') { echo $activeSketch; }?>">Oil
				painting</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/seaLife.php"
			class="<?php if($sketch == 'seaLife') { echo $activeSketch; }?>">Sea
				life</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/drawingBalls.php"
			class="<?php if($sketch == 'drawingBalls') { echo $activeSketch; }?>">Drawing
				balls</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/photoSlices.php"
			class="<?php if($sketch == 'photoSlices') { echo $activeSketch; }?>">Photo
				slices</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/leapFrog.php"
			class="<?php if($sketch == 'leapFrog') { echo $activeSketch; }?>">Leapfrog</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/thousandWords.php"
			class="<?php if($sketch == 'thousandWords') { echo $activeSketch; }?>">Thousand
				words</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/wordLimits.php"
			class="<?php if($sketch == 'wordLimits') { echo $activeSketch; }?>">Word
				limits</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/treeGenerator.php"
			class="<?php if($sketch == 'treeGenerator') { echo $activeSketch; }?>">Tree
				generator</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/flaringStar.php"
			class="<?php if($sketch == 'flaringStar') { echo $activeSketch; }?>">Flaring
				star</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/recursivePuzzle.php"
			class="<?php if($sketch == 'recursivePuzzle') { echo $activeSketch; }?>">Recursive
				puzzle</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/evolvingWords.php"
			class="<?php if($sketch == 'evolvingWords') { echo $activeSketch; }?>">Evolving
				words</a></li>
	</ul>
</div>
