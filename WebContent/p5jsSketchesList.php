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
            		<li><a href="/sketches/oilPainting.php"<?php addActiveSketchClass('oilPainting');?>>Oil painting</a></li>
            		<li><a href="/sketches/seaLife.php"<?php addActiveSketchClass('seaLife');?>>Sea life</a></li>
            		<li><a href="/sketches/drawingBalls.php"<?php addActiveSketchClass('drawingBalls');?>>Drawing balls</a></li>
            		<li><a href="/sketches/photoSlices.php"<?php addActiveSketchClass('photoSlices');?>>Photo slices</a></li>
            		<li><a href="/sketches/leapFrog.php"<?php addActiveSketchClass('leapFrog');?>>Leapfrog</a></li>
            		<li><a href="/sketches/thousandWords.php"<?php addActiveSketchClass('thousandWords');?>>Thousand words</a></li>
            		<li><a href="/sketches/wordLimits.php"<?php addActiveSketchClass('wordLimits');?>>Word limits</a></li>
            		<li><a href="/sketches/treeGenerator.php"<?php addActiveSketchClass('treeGenerator');?>>Tree generator</a></li>
            		<li><a href="/sketches/flaringStar.php"<?php addActiveSketchClass('flaringStar');?>>Flaring star</a></li>
            		<li><a href="/sketches/recursivePuzzle.php"<?php addActiveSketchClass('recursivePuzzle');?>>Recursive puzzle</a></li>
            		<li><a href="/sketches/evolvingWords.php"<?php addActiveSketchClass('evolvingWords');?>>Evolving words</a></li>
            	</ul>
            </nav>
