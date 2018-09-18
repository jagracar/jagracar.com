<?php
// General php variables
$homeDir = '';
$page = 'cv';
$keywords = 'CV, curriculum, astronomy, software, developer, job, interests';
$descriptionText = 'Curriculum Vitae of Javier Graciá Carpio';
$titleText = 'Curriculum Vitae - jagracar';
$addP5js = false;
$addThreejs = false;
$addJQuery = true;
?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php require $homeDir . 'head.php';?>
<script src="<?php echo $homeDir; ?>js/cv.js" async></script>
</head>

<body>
	<!-- Navigation bar -->
<?php require $homeDir . 'navBar.php';?>

	<main class="main-container">
	<article class="content">
		<header>
			<h2>
				Dr. Javier Graciá Carpio<br /> <small>Scientific software developer
					/ Astronomer</small>
			</h2>
		</header>

		<section class="cv-section">
			<header>
				<h3>Contact information</h3>
			</header>

			<address>
				Email: jagracar<span class="noSpam-icon"></span>gmail.com
			</address>
		</section>

		<section class="cv-section">
			<header>
				<h3>Personal details</h3>
			</header>

			<dl class="cv-keyvalue-list">
				<dt>Date of birth:</dt>
				<dd>March 19, 1979</dd>

				<dt>Place of birth:</dt>
				<dd>Madrid, Spain</dd>

				<dt>Nationality:</dt>
				<dd>Spanish</dd>

				<dt>Marital status:</dt>
				<dd>Married</dd>
			</dl>
		</section>

		<section class="cv-section">
			<header>
				<h3>Education</h3>
			</header>

			<dl class="cv-achievement-list">
				<dt>2009</dt>
				<dd>
					<p>Ph.D. in Astronomy from the Universidad Autónoma de Madrid.</p>
					<p>
						Dissertation title: <em>Molecular Gas Properties in Luminous and
							Ultraluminous Infrared Galaxies.</em>
					</p>
				</dd>

				<dt>2003 – 2006</dt>
				<dd>
					<p>Master of Advanced Studies at the Universidad Autónoma de
						Madrid.</p>
				</dd>

				<dt>1997 – 2002</dt>
				<dd>
					<p>Degree in Physics at the Universidad Complutense de Madrid.</p>
				</dd>
			</dl>
		</section>

		<section class="cv-section">
			<header>
				<h3>Professional experience</h3>
			</header>

			<dl class="cv-achievement-list">
				<dt>Since August 2016</dt>
				<dd>
					<p>
						Scientific Software Developer at Max Planck Institute for
						Extraterrestrial Physics (<a href="https://www.mpe.mpg.de"
							target="_blank" rel="noopener">MPE</a>), Garching, Germany.
					</p>
					<p>
						<em>Programming environment:</em> Python, C++, XML, XSD, Eclipse,
						redmine, svn, gitlab, Linux.
					</p>
					<p>
						<em>Main tasks:</em> Member of the <a
							href="https://www.cosmos.esa.int/web/euclid" target="_blank"
							rel="noopener">Euclid</a> collaboration. Responsible of the
						definition and maintenance of MER-PF data model.
					</p>
				</dd>

				<dt>January 2013 – July 2016</dt>
				<dd>
					<p>
						Scientific Software Developer at Max Planck Institute for
						Extraterrestrial Physics (<a href="https://www.mpe.mpg.de"
							target="_blank" rel="noopener">MPE</a>), Garching, Germany.
					</p>
					<p>
						<em>Programming environment:</em> Java, Jython, Eclipse, JUnit,
						JIRA, CVS, Linux.
					</p>
					<p>
						<em>Main tasks:</em> Development and maintenance of the <a
							href="https://www.cosmos.esa.int/web/herschel/home"
							target="_blank" rel="noopener">Herschel</a>/<abbr
							title="The Photoconductor Array Camera and Spectrometer">PACS</abbr>
						photometer data reduction pipelines. Implementation of new
						algorithms and tasks to improve the quality of the final
						scientific products. Introduction of a new complete pipeline for
						the reduction of photometer scan maps in astronomical fields with
						extended emission. Improvement of the execution speed and memory
						efficiency of the most critical pipeline tasks. Regular meetings
						with the PACS ICC members and the <a
							href="http://herschel.esac.esa.int/hipe/" target="_blank"
							rel="noopener">HIPE</a> and PACS software development teams.
					</p>
				</dd>

				<dt>March 2008 – December 2012</dt>
				<dd>
					<p>
						Postdoctoral Fellow at Max Planck Institute for Extraterrestrial
						Physics (<a href="https://www.mpe.mpg.de" target="_blank"
							rel="noopener">MPE</a>), Garching, Germany.
					</p>
					<p>
						<em>Research topics:</em> Interstellar medium in galaxies at all
						redshifts, galaxy feedback, active galactic nuclei, galaxy
						formation and evolution.
					</p>
					<p>
						<em>Main tasks:</em> Adapted the Herschel/PACS spectrometer data
						reduction pipeline to the special needs of the <a
							href="https://www.mpe.mpg.de/ir/SHINING" target="_blank"
							rel="noopener">SHINING</a> Herschel Guaranteed Time Key Program.
						Data reduction and analysis of most of the observations from the
						SHINING program. PACS ICC member. Observation with the IRAM radio
						telescopes. Proposal writing for observing time (Herschel, IRAM,
						APEX, ALMA). PI and co-PI of various successful Herschel and ALMA
						programmes. Collaboration in several observing large programmes (<a
							href="https://www.mpa-garching.mpg.de/COLD_GASS/" target="_blank"
							rel="noopener">COLD GASS</a>, <a
							href="http://www.iram-institute.org/EN/content-page-279-7-158-240-279-0.html"
							target="_blank" rel="noopener">PHIBBS</a>). Publication in
						scientific journals: currently more than 60 refereed publications
						with more than 4700 citations. Presentation of scientific results
						in international conferences. Referee for ApJ, A&amp;A and MNRAS.
					</p>
				</dd>

				<dt>May 2007 – March 2008</dt>
				<dd>
					<p>
						Astronomer at <a href="https://www.fractal-es.com" target="_blank"
							rel="noopener">FRACTAL S.L.N.E.</a>, Madrid, Spain.
					</p>
					<p>
						<em>Main task:</em> Development of the Internet home page for the
						Herschel Guaranteed Time Key Program HIFISTARS.
					</p>
				</dd>

				<dt>May 2003 – April 2007</dt>
				<dd>
					<p>
						Ph.D. student at Observatorio Astronómico Nacional (<a
							href="http://astronomia.ign.es/" target="_blank" rel="noopener">OAN</a>)
						with a FPI grant from the Spanish Ministry of Education and
						Science, Madrid, Spain.
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
				</dd>
			</dl>
		</section>

		<section class="cv-section">
			<header>
				<h3>Language knowledge</h3>
			</header>

			<dl class="cv-keyvalue-list">
				<dt>Spanish:</dt>
				<dd>Native</dd>

				<dt>English:</dt>
				<dd>Fluent</dd>

				<dt>German:</dt>
				<dd>Medium</dd>

				<dt>French:</dt>
				<dd>Medium</dd>
			</dl>
		</section>

		<section class="cv-section">
			<header>
				<h3>Computer skills</h3>
			</header>

			<ul>
				<li>Large experience working with the Unix/Linux and MS Windows
					operating systems.</li>
				<li>Programming experience with Java, R, python, Jython, XML/XSD and
					FORTRAN-77. Basic knowledge of C, C++ and Matlab.</li>
				<li>Java development and testing: Eclipse, JUnit, JIRA, CVS, Git.</li>
				<li>Python development and testing: Eclipse, pytest, Redmine, svn,
					Git.</li>
				<li>Web development: HTML5, CSS3, Sass, Compass, JavaScript, jQuery.</li>
				<li>Text editors: Latex, OpenOffice.org and MS Office.</li>
				<li>Highly familiarized with astronomical software: HIPE, GILDAS,
					DS9, XEphem and Cloudy.</li>
				<li>Extensive use of astronomical databases: NED, Simbad, VizieR and
					HSA.</li>
			</ul>
		</section>

		<section class="cv-section">
			<header>
				<h3>Other interests</h3>
			</header>

			<ul>
				<li>Data analysis and data visualization. Computer vision.</li>
				<li>Generative art and creative coding.</li>
				<li>User interaction applications/installations with the MS Kinect
					and Leap Motion controllers.</li>
				<li>Organizer of the <a
					href="https://www.meetup.com/Creative-Coding" target="_blank"
					rel="noopener">Creative Coding Munich</a> meetup group.
				</li>
				<li>Personal projects: <a href="https://github.com/jagracar/grafica"
					target="_blank" rel="noopener">Grafica library</a>, <a
					href="https://www.openprocessing.org/user/16300" target="_blank"
					rel="noopener">Processing</a>.
				</li>
			</ul>
		</section>
	</article>
	</main>

	<!-- Footer -->
<?php require $homeDir . 'footer.php';?>

</body>
</html>