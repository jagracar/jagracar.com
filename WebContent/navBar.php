<?php
function addActiveItemClass($pageName) {
    global $page;
    
    if ($page == $pageName) {
        echo ' is-active-item';
    }
}
?>
    <header class="nav-container">
    	<h1 class="nav-header">
    		<a href="/index.php" class="nav-item is-header-item">jagracar</a>
    	</h1>
    
    	<nav class="nav-menu-wrapper">
    		<span class="nav-item is-menu-item menu-icon" onclick="return false;"></span>
    
    		<ul class="nav-menu-list">
    			<li><a href="/astronomy.php" class="nav-item<?php addActiveItemClass('astronomy');?>">Astronomy</a></li>
    			<li><a href="/p5jsSketches.php" class="nav-item<?php addActiveItemClass('p5js');?>">P5.js</a></li>
    			<li><a href="/grafica.php" class="nav-item<?php addActiveItemClass('grafica');?>">Grafica</a></li>
    			<li><a href="/threejsSketches.php" class="nav-item<?php addActiveItemClass('threejs');?>">Three.js</a></li>
    			<li><a href="/kinect.php" class="nav-item<?php addActiveItemClass('kinect');?>">Kinect</a></li>
    			<li><a href="/cv.php" class="nav-item<?php addActiveItemClass('cv');?>">CV</a></li>
    		</ul>
    	</nav>
    </header>
