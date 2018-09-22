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
            		<li><a href="/sketches/defaultPlot.php"<?php addActiveSketchClass('defaultPlot');?>>Default plot</a></li>
            		<li><a href="/sketches/exponentialTrend.php"<?php addActiveSketchClass('exponentialTrend');?>>Exponential trend</a></li>
            		<li><a href="/sketches/movingPoints.php"<?php addActiveSketchClass('movingPoints');?>>Moving points</a></li>
            		<li><a href="/sketches/multiplePanels.php"<?php addActiveSketchClass('multiplePanels');?>>Multiple panels</a></li>
            		<li><a href="/sketches/oktoberfest.php"<?php addActiveSketchClass('oktoberfest');?>>Oktoberfest</a></li>
            		<li><a href="/sketches/multiplePlots.php"<?php addActiveSketchClass('multiplePlots');?>>Multiple plots</a></li>
            		<li><a href="/sketches/twoVerticalAxes.php"<?php addActiveSketchClass('twoVerticalAxes');?>>Two axes</a></li>
            		<li><a href="/sketches/lifeExpectancy.php"<?php addActiveSketchClass('lifeExpectancy');?>>Life expectancy</a></li>
            	</ul>
            </nav>
