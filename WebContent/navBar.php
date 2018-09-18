<?php $active = ' is-active-item';?>
    <header class="nav-container">
    	<h1 class="nav-header">
    		<a href="<?php echo $homeDir;?>index.php"
    			class="nav-item is-header-item">jagracar</a>
    	</h1>
    
    	<nav class="nav-menu-wrapper">
    		<span class="nav-item is-menu-item menu-icon" onclick="return false;"></span>
    
    		<ul class="nav-menu-list">
    			<li><a href="<?php echo $homeDir;?>astronomy.php"
    				class="nav-item<?php if($page == 'astronomy') { echo $active; }?>">Astronomy</a></li>
    			<li><a href="<?php echo $homeDir;?>p5jsSketches.php"
    				class="nav-item<?php if($page == 'p5js') { echo $active; }?>">P5.js</a></li>
    			<li><a href="<?php echo $homeDir;?>grafica.php"
    				class="nav-item<?php if($page == 'grafica') { echo $active; }?>">Grafica</a></li>
    			<li><a href="<?php echo $homeDir;?>threejsSketches.php"
    				class="nav-item<?php if($page == 'threejs') { echo $active; }?>">Three.js</a></li>
    			<li><a href="<?php echo $homeDir;?>kinect.php"
    				class="nav-item<?php if($page == 'kinect') { echo $active; }?>">Kinect</a></li>
    			<li><a href="<?php echo $homeDir;?>cv.php"
    				class="nav-item<?php if($page == 'cv') { echo $active; }?>">CV</a></li>
    		</ul>
    	</nav>
    </header>
