<?php $activeSketch = 'active-sketch';?>

<div class="p5js-sideMenu">
	<h2>Examples</h2>

	<ul>
		<li><a href="<?php echo $homeDir;?>sketches/defaultPlot.php"
			class="<?php if($sketch == 'defaultPlot') { echo $activeSketch; }?>">Default
				plot</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/exponentialTrend.php"
			class="<?php if($sketch == 'exponentialTrend') { echo $activeSketch; }?>">Exponential
				trend</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/movingPoints.php"
			class="<?php if($sketch == 'movingPoints') { echo $activeSketch; }?>">Moving
				points</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/multiplePanels.php"
			class="<?php if($sketch == 'multiplePanels') { echo $activeSketch; }?>">Multiple
				panels</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/oktoberfest.php"
			class="<?php if($sketch == 'oktoberfest') { echo $activeSketch; }?>">Oktoberfest</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/multiplePlots.php"
			class="<?php if($sketch == 'multiplePlots') { echo $activeSketch; }?>">Multiple
				plots</a></li>
	</ul>
</div>
