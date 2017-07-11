function runSketch() {
	var scene, renderer, camera, controls, light, guiControlKeys;
	var earthRadius, earth, textureFinishedLoading, visitedCities, selectedCity, informationPanel;

	init();
	animate();

	/*
	 * Initializes the sketch
	 */
	function init() {
		var maxCanvasWidth, canvasWidth, canvasHeight;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 700;
		canvasHeight = 500;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Scene setup
		scene = new THREE.Scene();

		// Renderer setup
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(canvasWidth, canvasHeight);
		renderer.setClearColor(new THREE.Color(0, 0, 0));

		// Paint the objects in the order that they are added (better for transparent effects)
		renderer.sortObjects = false;

		// Add the renderer to the sketch container
		document.getElementById(sketchContainer).appendChild(renderer.domElement);

		// Add an event listener to the renderer dom element to select the closest city to the mouse
		renderer.domElement.addEventListener('click', selectCity, false);

		// Camera setup
		camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 2000);
		camera.position.set(500, 350, 0);

		// Initialize the camera controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enablePan = false;
		controls.zoomSpeed = 0.6;
		controls.minDistance = 240;
		controls.maxDistance = 900;

		// Initialize the directional light
		light = new THREE.DirectionalLight(0xffffff, 1.2);
		scene.add(light);

		// Create the GUI and initialize the GUI control keys
		createGUI();

		// Add the Earth mesh to the scene
		addEarthMesh();

		// Add the visited cities to the scene
		addVisitedCitiesMesh();
	}

	/*
	 * Animates the sketch
	 */
	function animate() {
		// Request the next animation frame
		requestAnimationFrame(animate);

		if (textureFinishedLoading) {
			// Update the camera controls rotation speed
			controls.rotateSpeed = Math.min(0.08 * camera.position.length() / controls.minDistance, 2.0);

			// Update the light position
			light.position.copy(camera.position);

			// Update the visited cities uniforms
			updateVisitedCitiesUniforms();

			// Render the scene
			renderer.render(scene, camera);
		}
	}

	/*
	 * Select the closest city to the mouse when it's clicked
	 */
	function selectCity(event) {
		var rect, mouseCanvasPosition, rayCaster, intersections, closestCity, minDistance, i, city, point, distance;

		// Get the mouse position on the canvas
		rect = this.getBoundingClientRect();
		mouseCanvasPosition = new THREE.Vector2();
		mouseCanvasPosition.x = 2 * (event.clientX - rect.left) / renderer.domElement.width - 1;
		mouseCanvasPosition.y = -2 * (event.clientY - rect.top) / renderer.domElement.height + 1;

		// Calculate the intersections with the scene objects
		rayCaster = new THREE.Raycaster();
		rayCaster.setFromCamera(mouseCanvasPosition, camera);
		intersections = rayCaster.intersectObjects(visitedCities.children, true);

		// Get the closest city
		closestCity = undefined;
		minDistance = Number.MAX_VALUE;

		for (i = 0; i < intersections.length; i++) {
			city = intersections[i].object;
			point = city.worldToLocal(intersections[i].point);
			distance = city.material.uniforms.cityCoordinates.value.distanceTo(point);

			if (distance < minDistance && distance < city.material.uniforms.pointSize.value) {
				closestCity = city;
				minDistance = distance;
			}
		}

		// Do something only if we clicked on one of the cities
		if (closestCity) {
			// Reset the properties of the previously selected city
			if (selectedCity) {
				selectedCity.material.uniforms.color.value.setRGB(1, 0, 0);
			}

			// Select the city
			selectedCity = closestCity;

			// Change the selected city properties
			selectedCity.material.uniforms.color.value.setRGB(0, 1, 0);

			// Add the information panel if it's not yet present
			if (!informationPanel) {
				informationPanel = document.createElement("p");
				informationPanel.className = "sketch__info";
				document.getElementById(sketchContainer).appendChild(informationPanel);
			}

			informationPanel.textContent = selectedCity.name + ", " + selectedCity.country;
		}
	}

	/*
	 * Creates the sketch GUI
	 */
	function createGUI() {
		var gui, controller;

		// Initialize the control keys
		guiControlKeys = {
			"Month" : 6,
			"Show cities" : true
		};

		// Create the GUI
		gui = new dat.GUI({
			autoPlace : false
		});
		gui.close();

		// Add the GUI controllers
		controller = gui.add(guiControlKeys, "Month", 1, 12).step(1);
		controller.onFinishChange(updateEarthTexture);

		controller = gui.add(guiControlKeys, "Show cities");
		controller.onFinishChange(function(value) {
			visitedCities.visible = value;
		});

		// Add the GUI to the correct DOM element
		document.getElementById(guiContainer).appendChild(gui.domElement);
	}

	/*
	 * Initializes the Earth mesh and adds it to the scene
	 */
	function addEarthMesh() {
		var geometry, material;

		// Create the Earth mesh
		earthRadius = 200;
		geometry = new THREE.SphereGeometry(earthRadius, 64, 64);
		material = new THREE.MeshLambertMaterial();
		earth = new THREE.Mesh(geometry, material);

		// Update The Earth texture
		textureFinishedLoading = false;
		updateEarthTexture(guiControlKeys.Month);

		// Add the Earth mesh to the scene
		scene.add(earth);
	}

	/*
	 * Updates the earth texture
	 */
	function updateEarthTexture(month) {
		var textureFileName, loader;

		// Calculate the texture file name
		textureFileName = "img/blueMarble/world.topo.2004" + (month > 9 ? "" : "0") + month + ".3x5400x2700.jpg";

		// Load the texture and update the Earth material when is loaded
		loader = new THREE.TextureLoader();
		loader.load(textureFileName, function(texture) {
			texture.minFilter = THREE.NearestFilter;
			earth.material.map = texture;
			earth.material.needsUpdate = true;
			textureFinishedLoading = true;
		});
	}

	/*
	 * Initializes the visited cities mesh and adds it to the scene
	 */
	function addVisitedCitiesMesh() {
		var uniforms, material, visitedCitiesInfo, i, radius, cityGeometry, cityMaterial, cityMesh;

		// Define the shader uniforms
		uniforms = {
			color : {
				type : 'c',
				value : new THREE.Color(1, 0, 0)
			},
			cityCoordinates : {
				type : 'v3',
				value : new THREE.Vector3(0)
			},
			pointSize : {
				type : 'f',
				value : 1
			},
			time : {
				type : 'f',
				value : 0
			}
		};

		// Create the shader material
		material = new THREE.ShaderMaterial({
			uniforms : uniforms,
			vertexShader : document.getElementById("vertexShader").textContent,
			fragmentShader : document.getElementById("fragmentShader").textContent,
			side : THREE.FrontSide,
			transparent : true
		});

		// Get the visited cities information
		visitedCitiesInfo = getVisitedCitiesInfo();

		// Add each city to the visited cities object container
		visitedCities = new THREE.Object3D();

		for (i = 0; i < visitedCitiesInfo.names.length; i++) {
			// Use a slightly different radius for each city
			radius = (1.001 + 0.005 * i / visitedCitiesInfo.names.length) * earthRadius;

			// Create the visited city mesh
			cityGeometry = new THREE.SphereGeometry(radius, 16, 2, 0, 2 * Math.PI, 0, Math.PI / 70);
			cityMaterial = material.clone();
			cityMaterial.uniforms.cityCoordinates.value.set(0, radius, 0);
			cityMaterial.uniforms.time.value = 500 * Math.random();
			cityMesh = new THREE.Mesh(cityGeometry, cityMaterial);
			cityMesh.name = visitedCitiesInfo.names[i];
			cityMesh.country = visitedCitiesInfo.countries[i];

			// Rotate the mesh to the correct position
			cityMesh.rotation.z = (visitedCitiesInfo.coordinates[i].x - 90) * Math.PI / 180;
			cityMesh.rotation.y = visitedCitiesInfo.coordinates[i].y * Math.PI / 180;

			// Add the mesh to the container
			visitedCities.add(cityMesh);
		}

		// Add the meshes to the scene
		scene.add(visitedCities);
	}

	/*
	 * Updates the visited cities uniforms
	 */
	function updateVisitedCitiesUniforms() {
		var cities, canvasWidth, pointSize, i;

		// Get the visited cities meshes
		cities = visitedCities.children;
		canvasWidth = renderer.domElement.width;
		pointSize = Math.max((camera.position.length() - earthRadius) / (0.08 * canvasWidth), 0.5);

		// Update the uniforms
		for (i = 0; i < cities.length; i++) {
			cities[i].material.uniforms.pointSize.value = pointSize;
			cities[i].material.uniforms.time.value += 1;
		}
	}

	/*
	 * Returns an object with the name and coordinate information from all the visited cities. The coordinate
	 * information is from http://www.latlong.net
	 */
	function getVisitedCitiesInfo() {
		var cities = {
			names : [],
			countries : [],
			coordinates : [],
			addCity : function(cityName, country, latitude, longitude) {
				this.names.push(cityName);
				this.countries.push(country);
				this.coordinates.push(new THREE.Vector2(latitude, longitude));
			}
		};

		// Spain
		cities.addCity("Alcalá de Henares", "Spain", 40.481979, -3.363542);
		cities.addCity("Alicante", "Spain", 38.345996, -0.490686);
		cities.addCity("Ávila", "Spain", 40.656685, -4.681209);
		cities.addCity("Badajoz", "Spain", 38.879449, -6.970654);
		cities.addCity("Barcelona", "Spain", 41.385064, 2.173403);
		cities.addCity("Bilbao", "Spain", 43.263013, -2.934985);
		cities.addCity("Cáceres", "Spain", 39.475276, -6.372425);
		cities.addCity("Cádiz", "Spain", 36.527061, -6.288596);
		cities.addCity("Ciudad Real", "Spain", 38.984829, -3.927378);
		cities.addCity("Córdoba", "Spain", 37.888175, -4.779383);
		cities.addCity("Cuenca", "Spain", 40.070392, -2.137416);
		cities.addCity("El Escorial", "Spain", 40.583347, -4.127044);
		cities.addCity("Granada", "Spain", 37.177336, -3.598557);
		cities.addCity("Santa Cruz de la Palma", "Spain", 28.683989, -17.764575);
		cities.addCity("Madrid", "Spain", 40.416775, -3.703790);
		cities.addCity("Marbella", "Spain", 36.510071, -4.882447);
		cities.addCity("Mérida", "Spain", 38.914296, -6.349197);
		cities.addCity("Murcia", "Spain", 37.992240, -1.130654);
		cities.addCity("Oviedo", "Spain", 43.361914, -5.849389);
		cities.addCity("Palma", "Spain", 39.569600, 2.65016);
		cities.addCity("Pinoso", "Spain", 38.403516, -1.041111);
		cities.addCity("Salamanca", "Spain", 40.970104, -5.66354);
		cities.addCity("Salou", "Spain", 41.077758, 1.13152);
		cities.addCity("San Sebastián", "Spain", 43.318334, -1.981231);
		cities.addCity("Santander", "Spain", 43.462306, -3.80998);
		cities.addCity("Santiago de Compostela", "Spain", 42.878213, -8.544844);
		cities.addCity("Segovia", "Spain", 40.942903, -4.108807);
		cities.addCity("Sevilla", "Spain", 37.389092, -5.984459);
		cities.addCity("Sóller", "Spain", 39.767069, 2.715787);
		cities.addCity("Tenerife", "Spain", 28.291564, -16.629130);
		cities.addCity("Toledo", "Spain", 39.862832, -4.027323);
		cities.addCity("Torrevieja", "Spain", 37.984700, -0.680823);
		cities.addCity("Valencia", "Spain", 39.469907, -0.376288);
		cities.addCity("Vejer de la Frontera", "Spain", 36.252034, -5.966736);

		// Portugal
		cities.addCity("Lisboa", "Portugal", 38.722252, -9.139337);
		cities.addCity("Faro", "Portugal", 37.019355, -7.93044);

		// France
		cities.addCity("Ajaccio", "France", 41.919229, 8.738635);
		cities.addCity("Annecy", "France", 45.899247, 6.129384);
		cities.addCity("Avignon", "France", 43.949317, 4.805528);
		cities.addCity("Bastia", "France", 42.697283, 9.450881);
		cities.addCity("Beauvais", "France", 49.429539, 2.080712);
		cities.addCity("Bonifacio", "France", 41.387174, 9.159269);
		cities.addCity("Calvi", "France", 42.567651, 8.757222);
		cities.addCity("Cannes", "France", 43.552847, 7.017369);
		cities.addCity("Castellane", "France", 43.846242, 6.5137);
		cities.addCity("Chambéry", "France", 45.564601, 5.917781);
		cities.addCity("Châtellerault", "France", 46.816487, 0.548146);
		cities.addCity("Corte", "France", 42.309409, 9.149022);
		cities.addCity("Èze", "France", 43.727819, 7.361792);
		cities.addCity("Grenoble", "France", 45.188529, 5.724524);
		cities.addCity("Lyon", "France", 45.764043, 4.835659);
		cities.addCity("Marseille", "France", 43.296482, 5.36978);
		cities.addCity("Paris", "France", 48.856614, 2.352222);
		cities.addCity("Saintes-Maries-de-la-Mer", "France", 43.453241, 4.429074);
		cities.addCity("Sartène", "France", 41.621822, 8.97472);
		cities.addCity("Solenzara", "France", 41.837115, 9.372646);
		cities.addCity("Toulouse", "France", 43.604652, 1.444209);

		// Italy
		cities.addCity("Alberobello", "Italy", 40.786423, 17.24093);
		cities.addCity("Amalfi", "Italy", 40.634003, 14.602681);
		cities.addCity("Bari", "Italy", 41.117143, 16.871871);
		cities.addCity("Cagliary", "Italy", 39.223841, 9.121661);
		cities.addCity("Cannobio", "Italy", 46.059692, 8.698279);
		cities.addCity("Capri", "Italy", 40.553201, 14.222154);
		cities.addCity("Finale Ligure", "Italy", 44.168903, 8.341621);
		cities.addCity("Florence", "Italy", 43.769560, 11.255814);
		cities.addCity("Frascati", "Italy", 41.808521, 12.676104);
		cities.addCity("Gallipolli", "Italy", 40.055851, 17.992614);
		cities.addCity("Lazise", "Italy", 45.506020, 10.735072);
		cities.addCity("Lecce", "Italy", 40.351515, 18.175016);
		cities.addCity("Levanto", "Italy", 44.168614, 9.610654);
		cities.addCity("Milan", "Italy", 45.465422, 9.185924);
		cities.addCity("Naples", "Italy", 40.851775, 14.268124);
		cities.addCity("Oria", "Italy", 40.499341, 17.63888);
		cities.addCity("Otranto", "Italy", 40.143898, 18.491168);
		cities.addCity("Paestum", "Italy", 40.423151, 15.007163);
		cities.addCity("Pisa", "Italy", 43.722839, 10.401689);
		cities.addCity("Portovenere", "Italy", 44.054126, 9.836628);
		cities.addCity("Rom", "Italy", 41.902783, 12.496366);
		cities.addCity("Taormina", "Italy", 37.851637, 15.285313);
		cities.addCity("Tindary", "Italy", 38.141744, 15.045148);

		// Switzerland
		cities.addCity("Bern", "Switzerland", 46.947922, 7.444608);
		cities.addCity("Geneva", "Switzerland", 46.198392, 6.142296);
		cities.addCity("Zurich", "Switzerland", 47.368650, 8.539183);

		// Austria
		cities.addCity("Kitzbuhel", "Austria", 47.444990, 12.39143);
		cities.addCity("Vienna", "Austria", 48.208174, 16.373819);
		cities.addCity("Salzburg", "Austria", 47.809490, 13.05501);
		cities.addCity("Sölden", "Austria", 46.965494, 11.007623);

		// Germany
		cities.addCity("Ausburg", "Germany", 48.370545, 10.89779);
		cities.addCity("Berlin", "Germany", 52.520007, 13.404954);
		cities.addCity("Bonn", "Germany", 50.737430, 7.098207);
		cities.addCity("Dresden", "Germany", 51.050409, 13.737262);
		cities.addCity("Eichstätt", "Germany", 48.891251, 11.189986);
		cities.addCity("Füssen", "Germany", 47.569648, 10.700433);
		cities.addCity("Garmisch-Partenkirchen", "Germany", 47.491695, 11.095498);
		cities.addCity("Heidelberg", "Germany", 49.398752, 8.672434);
		cities.addCity("Karlsruhe", "Germany", 49.006890, 8.403653);
		cities.addCity("Kochel", "Germany", 47.655882, 11.365602);
		cities.addCity("Lindau", "Germany", 47.579782, 9.678933);
		cities.addCity("Munich", "Germany", 48.135125, 11.581981);
		cities.addCity("Nuremberg", "Germany", 49.452030, 11.07675);
		cities.addCity("Prien am Chiemsee", "Germany", 47.856181, 12.349098);
		cities.addCity("Regensburg", "Germany", 49.013430, 12.101624);
		cities.addCity("Schönau am Königssee", "Germany", 47.598379, 12.981548);
		cities.addCity("Speyer", "Germany", 49.317276, 8.441217);
		cities.addCity("Starnberg", "Germany", 47.999961, 11.339009);
		cities.addCity("Tegernsee", "Germany", 47.705139, 11.764725);

		// Netherlands
		cities.addCity("Amsterdam", "Netherlands", 52.370216, 4.895168);
		cities.addCity("Dwingeloo", "Netherlands", 52.835356, 6.365817);
		cities.addCity("Groningen", "Netherlands", 53.219383, 6.566502);
		cities.addCity("Leiden", "Netherlands", 52.160114, 4.49701);
		cities.addCity("Rotterdam", "Netherlands", 51.924420, 4.477733);

		// Belgium
		cities.addCity("Antwerp", "Belgium", 51.219448, 4.402464);
		cities.addCity("Bruges", "Belgium", 51.209348, 3.2247);
		cities.addCity("Brussels", "Belgium", 50.850340, 4.35171);
		cities.addCity("Ghent", "Belgium", 51.054342, 3.717424);
		cities.addCity("Leuven", "Belgium", 50.886450, 4.703888);

		// England
		cities.addCity("Brighton", "England", 50.822530, -0.137163);
		cities.addCity("Hastings", "England", 50.854259, 0.573453);
		cities.addCity("Jodrell Bank", "England", 53.236896, -2.307501);
		cities.addCity("London", "England", 51.507351, -0.127758);
		cities.addCity("Manchester", "England", 53.480759, -2.242631);
		cities.addCity("Wolverhampton", "England", 52.586973, -2.12882);

		// Greece
		cities.addCity("Agios Nikolaos", "Greece", 35.189960, 25.716417);
		cities.addCity("Athens", "Greece", 37.983917, 23.729360);
		cities.addCity("Heraklion", "Greece", 35.338735, 25.144213);

		// Hungary
		cities.addCity("Budapest", "Hungary", 47.497912, 19.040235);

		// Czech Republic
		cities.addCity("Prague", "Czech Republic", 50.075538, 14.4378);

		// Croatia
		cities.addCity("Brela", "Croatia", 43.368570, 16.929904);
		cities.addCity("Cres", "Croatia", 44.960694, 14.40917);
		cities.addCity("Dubrovnik", "Croatia", 42.650661, 18.094424);
		cities.addCity("Dugi Otok", "Croatia", 43.966862, 15.090815);
		cities.addCity("Hvar", "Croatia", 43.172948, 16.441114);
		cities.addCity("Krk", "Croatia", 45.080936, 14.592586);
		cities.addCity("Mjlet", "Croatia", 42.747771, 17.515014);
		cities.addCity("Pula", "Croatia", 44.866623, 13.849579);
		cities.addCity("Rab", "Croatia", 44.756910, 14.759968);
		cities.addCity("Rovinj", "Croatia", 45.081166, 13.638707);
		cities.addCity("Zadar", "Croatia", 44.119371, 15.231365);

		// Slovenia
		cities.addCity("Ljubljana", "Slovenia", 46.056947, 14.505751);

		// Turkey
		cities.addCity("Antalya", "Turkey", 36.896891, 30.713323);
		cities.addCity("Çeşme", "Turkey", 38.324311, 26.303215);
		cities.addCity("Çıralı", "Turkey", 36.417500, 30.4775);
		cities.addCity("Dalyan", "Turkey", 36.834167, 28.6425);
		cities.addCity("Fethiye", "Turkey", 36.659246, 29.126347);
		cities.addCity("Istanbul", "Turkey", 41.008238, 28.978359);
		cities.addCity("İzmir", "Turkey", 38.423734, 27.142826);
		cities.addCity("Ölüdeniz", "Turkey", 36.549333, 29.115);
		cities.addCity("Pamukkale", "Turkey", 37.918609, 29.110307);
		cities.addCity("Selçuk", "Turkey", 37.950845, 27.369954);

		// Russia
		cities.addCity("Saint Petersburg", "Russia", 59.934280, 30.335099);

		// Israel
		cities.addCity("Capernaum", "Israel", 32.880330, 35.573307);
		cities.addCity("Eilat", "Israel", 29.557669, 34.951925);
		cities.addCity("Ein Gedi", "Israel", 31.451191, 35.383571);
		cities.addCity("Haifa", "Israel", 32.794046, 34.989571);
		cities.addCity("Jerusalem", "Israel", 31.768319, 35.21371);
		cities.addCity("Kaş", "Israel", 36.199913, 29.63955);
		cities.addCity("Nimrod", "Israel", 33.244978, 35.750842);

		// Jordan
		cities.addCity("Petra", "Jordan", 30.329002, 35.444665);

		// Mexico
		cities.addCity("Cancún", "Mexico", 21.161908, -86.851528);
		cities.addCity("Chichen Itzá", "Mexico", 20.678333, -88.568889);
		cities.addCity("Mexico City", "Mexico", 19.432608, -99.133208);

		// China
		cities.addCity("Hangzhou", "China", 30.274085, 120.15507);
		cities.addCity("Nanjing", "China", 32.060255, 118.796877);
		cities.addCity("Shanghai", "China", 31.230416, 121.473701);
		cities.addCity("Suzhou", "China", 31.298974, 120.585297);

		// USA
		cities.addCity("Joshua Tree", "USA", 34.134728, -116.313066);
		cities.addCity("Los Angeles", "USA", 34.052234, -118.243685);
		cities.addCity("Pasadena", "USA", 34.147785, -118.144516);

		// Australia
		cities.addCity("Brooklyn on Hawkesbury", "Australia", -33.547946, 151.212277);
		cities.addCity("Katoomba", "Australia", -33.714955, 150.311407);
		cities.addCity("Kiama", "Australia", -34.670266, 150.854387);
		cities.addCity("Sydney", "Australia", -33.867487, 151.20699);

		return cities;
	}
}