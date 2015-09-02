<?php $activeSketch = 'active-sketch';?>

<div class="sketches-list">
	<h2>Examples</h2>
	<ul>
		<li><a href="<?php echo $homeDir;?>sketches/kinectScanViewer.php"
			class="<?php if($sketch == 'kinectScanViewer') { echo $activeSketch; }?>">Scan viewer</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/trace3d.php"
			class="<?php if($sketch == 'trace3d') { echo $activeSketch; }?>">Trace 3D</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/visitedCities.php"
			class="<?php if($sketch == 'visitedCities') { echo $activeSketch; }?>">Visited cities</a></li>
	</ul>
</div>
