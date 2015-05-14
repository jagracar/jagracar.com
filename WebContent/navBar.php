<?php $active = 'is-active-item';?>

<nav>
	<div class="nav-logo">
		<a href="<?php echo $homeDir;?>index.php"
			class="nav-item is-logo-item">jagracar</a>
	</div>

	<div class="nav-menu-wrapper">
		<span class="nav-item is-menu-item menu-icon"></span>

		<div class="nav-blocks-wrapper">
			<div class="nav-block">
				<ul class="nav-list is-main-list">
					<li><a href="<?php echo $homeDir;?>astronomy.php"
						class="nav-item <?php if($page == 'astronomy') { echo $active; }?>">Astronomy</a></li>
					<li><a href="<?php echo $homeDir;?>p5jsSketches.php"
						class="nav-item <?php if($page == 'p5js') { echo $active; }?>">P5.js</a></li>
					<li><a href="<?php echo $homeDir;?>grafica.php"
						class="nav-item <?php if($page == 'grafica') { echo $active; }?>">Grafica</a></li>
					<li><a href="<?php echo $homeDir;?>threejsSketches.php"
						class="nav-item <?php if($page == 'threejs') { echo $active; }?>">Three.js</a></li>
					<li><a href="<?php echo $homeDir;?>kinect.php"
						class="nav-item <?php if($page == 'kinect') { echo $active; }?>">Kinect</a></li>
					<li><a href="<?php echo $homeDir;?>cv.php"
						class="nav-item <?php if($page == 'cv') { echo $active; }?>">CV</a></li>
				</ul>
			</div>

			<!--
			<div class="nav-block">
				<span class="nav-item is-list-toogle-item">Creative Coding</span>
				<ul class="nav-list">
					<li><a href="<?php echo $homeDir;?>processing.php" 
						class="nav-item <?php if($page == 'processing') { echo $active; }?>">Processing</a></li>
					<li><a href="<?php echo $homeDir;?>javascript.php"
						class="nav-item <?php if($page == 'javascript') { echo $active; }?>">Javascript</a></li>
				</ul>
			</div>
			-->

			<div class="nav-block is-secondary-block">
				<span class="nav-item is-list-toogle-item">Social</span>
				<ul class="nav-list">
					<li><a href="https://github.com/jagracar"
						class="nav-item github-icon">GitHub</a></li>
					<li><a href="http://www.facebook.com/jgraciacarpio"
						class="nav-item facebook-icon">Facebook</a></li>
					<li><a href="https://twitter.com/jagracar"
						class="nav-item twitter-icon">Twitter</a></li>
					<li><a href="https://vimeo.com/jagracar"
						class="nav-item vimeo-icon">Vimeo</a></li>
					<li><a href="https://www.linkedin.com/in/javiergraciacarpio"
						class="nav-item linkedin-icon">LinkedIn</a></li>
				</ul>
			</div>
		</div>
	</div>
</nav>
