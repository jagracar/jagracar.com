<?php
	// General php variables
	$page = 'cv';
	$homeDir = '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="keywords"
	content="CV, curriculum, astronomy, software, developer, job, interests">
<meta name="description"
	content="Curriculum Vitae of Javier Graciá Carpio">
<meta name="author" content="Javier Graciá Carpio">
<title>Curriculum Vitae - jagracar</title>

<!-- CSS files -->
<link rel="stylesheet" href="<?php echo $homeDir;?>css/styles.css" />

<!-- Useful JavaScript files -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
	<!-- Navigation bar -->
	<?php include_once $homeDir . 'navBar.php';?>

	<div class="main-container">
		<header>
			<h1>
				Dr. Javier Graciá Carpio<br /> <small>Scientific software
					developer / Astronomer</small>
			</h1>
		</header>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Contact information</h1>
			</header>
			<p>
				Heimeranstraße, 6<br /> 80339, Munich – Germany<br /> Phone: +49
				171 647 89 61<br /> Email: jagracar<span class="noSpam-icon"></span>gmail.com
			</p>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Personal details</h1>
			</header>
			<ul class="cv-keyValueList">
				<li><span class="cv-keyValueList__key">Date of birth:</span> <span
					class="cv-keyValueList__value">March 19, 1979</span></li>
				<li><span class="cv-keyValueList__key">Place of birth:</span> <span
					class="cv-keyValueList__value">Madrid, Spain</span></li>
				<li><span class="cv-keyValueList__key">Nationality:</span> <span
					class="cv-keyValueList__value">Spanish</span></li>
				<li><span class="cv-keyValueList__key">Marital status:</span> <span
					class="cv-keyValueList__value">Single</span></li>
			</ul>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Education</h1>
			</header>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>2009</p>
				</div>
				<div class="cv-achievement__description">
					<p>Ph.D. in Astronomy from the Universidad Autónoma de Madrid.</p>
					<p>
						Dissertation title: <em>Molecular Gas Properties in Luminous
							and Ultraluminous Infrared Galaxies.</em>
					</p>
				</div>
			</div>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>2003 – 2006</p>
				</div>
				<div class="cv-achievement__description">
					<p>Master of Advanced Studies at the Universidad Autónoma de
						Madrid.</p>
				</div>
			</div>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>1997 – 2002</p>
				</div>
				<div class="cv-achievement__description">
					<p>Degree in Physics at the Universidad Complutense de Madrid.</p>
				</div>
			</div>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Professional experience</h1>
			</header>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>Since January 2013</p>
				</div>
				<div class="cv-achievement__description">
					<p>
						Scientific Software Developer at Max Planck Institute for
						Extraterrestrial Physics (<a href="http://www.mpe.mpg.de">MPE</a>),
						Garching, Germany.
					</p>
					<p>
						<em>Programming environment:</em> Java, Jython, Eclipse, JUnit,
						JIRA, CVS, Linux.
					</p>
					<p>
						<em>Main tasks:</em> Development and maintenance of the <a
							href="http://www.cosmos.esa.int/web/herschel/home">Herschel</a>/<abbr
							title="The Photoconductor Array Camera and Spectrometer">PACS</abbr>
						photometer data reduction pipelines. Implementation of new
						algorithms and tasks to improve the quality of the final
						scientific products. Introduction of a new complete pipeline for
						the reduction of photometer scan maps in astronomical fields with
						extended emission. Improvement of the execution speed and memory
						efficiency of the most critical pipeline tasks. Regular meetings
						with the PACS ICC members and the <a
							href="http://herschel.esac.esa.int/hipe/">HIPE</a> and PACS
						software development teams.
					</p>
				</div>
			</div>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>March 2008 – Dec. 2012</p>
				</div>
				<div class="cv-achievement__description">
					<p>
						Postdoctoral Fellow at Max Planck Institute for Extraterrestrial
						Physics (<a href="http://www.mpe.mpg.de">MPE</a>), Garching,
						Germany.
					</p>
					<p>
						<em>Research topics:</em> Interstellar medium in galaxies at all
						redshifts, galaxy feedback, active galactic nuclei, galaxy
						formation and evolution.
					</p>
					<p>
						<em>Main tasks:</em> Adapted the Herschel/PACS spectrometer data
						reduction pipeline to the special needs of the <a
							href="http://www.mpe.mpg.de/ir/SHINING">SHINING</a> Herschel
						Guaranteed Time Key Program. Data reduction and analysis of most
						of the observations from the SHINING program. PACS ICC member.
						Observation with the IRAM radio telescopes. Proposal writing for
						observing time (Herschel, IRAM, APEX, ALMA). PI and co-PI of
						various successful Herschel and ALMA programmes. Collaboration in
						several observing large programmes (<a
							href="http://www.mpa-garching.mpg.de/COLD_GASS/">COLD GASS</a>, <a
							href="http://www.iram-institute.org/EN/content-page-279-7-158-240-279-0.html">PHIBBS</a>).
						Publication in scientific journals: currently more than 50
						refereed publications with more than 2600 citations. Presentation
						of scientific results in international conferences. Referee for
						ApJ, A&amp;A and MNRAS.
					</p>
				</div>
			</div>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>May 2007 – March 2008</p>
				</div>
				<div class="cv-achievement__description">
					<p>
						Astronomer at <a href="http://www.fractal-es.com">FRACTAL
							S.L.N.E.</a>, Madrid, Spain.
					</p>
					<p>
						<em>Main task:</em> Development of the Internet home page for the
						Herschel Guaranteed Time Key Program HIFISTARS.
					</p>
				</div>
			</div>
			<div class="cv-achievement">
				<div class="cv-achievement__period">
					<p>May 2003 – April 2007</p>
				</div>
				<!-- Keep this comments 
				 -->
				<div class="cv-achievement__description">
					<p>
						Ph.D. student at Observatorio Astronómico Nacional (<a
							href="http://www.oan.es">OAN</a>) with a FPI grant from the
						Spanish Ministry of Education and Science, Madrid, Spain.
					</p>
					<p>
						<em>Research topics:</em> Molecular gas in Ultraluminous Infrared
						Galaxies, star formation, interacting galaxies, molecular gas in
						high-redshift galaxies.
					</p>
					<p>
						<em>Main tasks:</em> Observation with the IRAM 30m and Plateau de
						Bure radio telescopes. Proposal writing for observing time (IRAM,
						JCMT, VLA). Reduction and analysis of astronomical data.
						Publication in scientific journals. Presentation of scientific
						results in international conferences.
					</p>
				</div>
			</div>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Language knowledge</h1>
			</header>
			<ul class="cv-keyValueList">
				<li><span class="cv-keyValueList__key">Spanish:</span> <span
					class="cv-keyValueList__value">Native</span></li>
				<li><span class="cv-keyValueList__key">English:</span> <span
					class="cv-keyValueList__value">Fluent</span></li>
				<li><span class="cv-keyValueList__key">French:</span> <span
					class="cv-keyValueList__value">Medium</span></li>
				<li><span class="cv-keyValueList__key">German:</span> <span
					class="cv-keyValueList__value">Basic</span></li>
			</ul>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Computer skills</h1>
			</header>
			<ul class="cv-list">
				<li>Large experience working with the Unix/Linux and MS Windows
					operating systems.</li>
				<li>Programming experience with Java, R, Jython and FORTRAN-77.
					Basic knowledge of C and C++.</li>
				<li>Java development and testing: Eclipse, JUnit, JIRA, CVS,
					Git.</li>
				<li>Web development: HTML5, CSS3, Sass, Compass, JavaScript,
					jQuery.</li>
				<li>Text editors: Latex, OpenOffice.org and MS Office.</li>
				<li>Highly familiarized with astronomical software: HIPE,
					GILDAS, DS9, XEphem and Cloudy.</li>
				<li>Extensive use of astronomical databases: NED, Simbad,
					VizieR and HSA.</li>
			</ul>
		</section>

		<section class="cv-section">
			<header class="cv-section__header">
				<h1>Other interests</h1>
			</header>
			<ul class="cv-list">
				<li>Data analysis and data visualization. Computer vision.</li>
				<li>Generative art and creative coding.</li>
				<li>User interaction applications/installations with the MS
					Kinect and Leap Motion controllers.</li>
				<li>Organizer of the <a
					href="http://www.meetup.com/Creative-Coding">Creative Coding
						Munich</a> meetup group.
				</li>
				<li>Personal projects: <a
					href="https://github.com/jagracar/grafica">Grafica library</a>, <a
					href="http://www.openprocessing.org/user/16300">Processing</a>.
				</li>
			</ul>
		</section>
	</div>

	<!-- Footer -->
	<?php include_once $homeDir . 'footer.php';?>

	<!-- JavaScript files -->
	<script
		src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="<?php echo $homeDir;?>js/cv.js"></script>
</body>