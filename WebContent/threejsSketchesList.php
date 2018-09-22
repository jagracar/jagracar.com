<?php
function addActiveSketchClass($sketchName) {
    global $sketch;
    
    if ($sketch == $sketchName) {
        echo ' class="active-sketch"';
    }
}
?>
            <nav class="sketches-list">
            	<header>
            		<h3>Examples</h3>
            	</header>
            
            	<ul>
            		<li><a href="/sketches/kinectScanViewer.php"<?php addActiveSketchClass('kinectScanViewer');?>>Scan viewer</a></li>
            		<li><a href="/sketches/trace3d.php"<?php addActiveSketchClass('trace3d');?>>Trace 3D</a></li>
            		<li><a href="/sketches/visitedCities.php"<?php addActiveSketchClass('visitedCities');?>>Visited cities</a></li>
            		<li><a href="/sketches/galacticCenter.php"<?php addActiveSketchClass('galacticCenter');?>>Galactic center</a></li>
            		<li><a href="/sketches/star.php"<?php addActiveSketchClass('star');?>>Star</a></li>
            		<li><a href="/sketches/webcam.php"<?php addActiveSketchClass('webcam');?>>Webcam</a></li>
            	</ul>
            </nav>
