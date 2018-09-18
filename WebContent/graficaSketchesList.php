<?php $activeSketch = 'active-sketch';?>
            <nav class="sketches-list">
            	<header>
            		<h3>Examples</h3>
            	</header>
            
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
            		<li><a href="<?php echo $homeDir;?>sketches/twoVerticalAxes.php"
            			class="<?php if($sketch == 'twoVerticalAxes') { echo $activeSketch; }?>">Two
            				axes</a></li>
            		<li><a href="<?php echo $homeDir;?>sketches/lifeExpectancy.php"
            			class="<?php if($sketch == 'lifeExpectancy') { echo $activeSketch; }?>">Life
            				expectancy</a></li>
            	</ul>
            </nav>
