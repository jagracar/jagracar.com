<?php $activeSketch = 'active-sketch';?>

<div class="p5js-sideMenu">
	<h2>Examples</h2>

	<ul>
		<li><a href="<?php echo $homeDir;?>sketches/test.php"
			class="<?php if($sketch == 'test') { echo $activeSketch; }?>">Test</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/loadScan.php"
			class="<?php if($sketch == 'loadScan') { echo $activeSketch; }?>">Load scan</a></li>
	</ul>
</div>
