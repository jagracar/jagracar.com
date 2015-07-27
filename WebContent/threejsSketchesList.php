<?php $activeSketch = 'active-sketch';?>

<div class="sketches-list">
	<h2>Examples</h2>
	<ul>
		<li><a href="<?php echo $homeDir;?>sketches/test.php"
			class="<?php if($sketch == 'test') { echo $activeSketch; }?>">Test</a></li>
		<li><a href="<?php echo $homeDir;?>sketches/kinectScanViewer.php"
			class="<?php if($sketch == 'kinectScanViewer') { echo $activeSketch; }?>">Kinect scan viewer</a></li>
	</ul>
</div>
