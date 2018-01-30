var thousandWordsSketch = function(p) {
	// Global variables
	var img = undefined;
	var buffer = undefined;
	var textSize = undefined;
	var textLeading = undefined;
	var initPhrase = "Type some\n text...";
	var phrase = initPhrase;
	var lastLine = "";
	var nLines = 1;

	// Load the image before the sketch is run
	p.preload = function() {
		// Picture by Petras Gagilas
		// https://www.flickr.com/photos/gagilas/4495968987
		img = p.loadImage("img/peep.jpg");
	};

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvas;

		// Resize the image if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;

		if (img.width > maxCanvasWidth) {
			img.resize(maxCanvasWidth, img.height * maxCanvasWidth / img.width);
		}

		// Create the canvas
		canvas = p.createCanvas(img.width, img.height);

		// Change the line separation each time the mouse is pressed inside the canvas
		canvas.mousePressed(updateLineSeparation);
	
		// Set the text properties
		textSize = 0.17 * p.width;
		textLeading = textSize;

		// Create the buffer and set the font properties
		buffer = p.createGraphics(img.width, img.height);
		buffer.textFont("Helvetica");
		buffer.textSize(textSize);
		buffer.textLeading(textLeading);
		buffer.textAlign(p.CENTER, p.CENTER);
		buffer.noStroke();

		// Draw only when it's necessary
		p.noLoop();
	};

	// Execute the sketch
	p.draw = function() {
		// Update the buffer
		var bufferImg = updateBuffer();

		// Draw the buffer image on the canvas
		p.image(bufferImg, 0, 0);
	};

	//
	// Add a new character if the user types a key
	//
	p.keyTyped = function() {
		// Clear the initial text
		if (phrase === initPhrase) {
			phrase = "";
			nLines = 0;
		}

		// Update the text
		if (p.keyCode === p.ENTER) {
			phrase += "\n";
			lastLine = "";
			nLines++;
		} else {
			// Check if we need to start a new line
			if (buffer.textWidth(lastLine + p.key) > 0.95 * buffer.width) {
				phrase += "\n";
				lastLine = "";
				nLines++;
			}

			// Add the new character
			phrase += p.key;
			lastLine += p.key;
		}

		// Redraw the buffer on the canvas
		p.redraw();
	};

	//
	// Updates the line separation
	//
	function updateLineSeparation() {
		if (p.mouseX >= 0 && p.mouseX < buffer.width && p.mouseY >= 0 && p.mouseY < buffer.height) {
			if (p.mouseButton === p.LEFT) {
				textLeading *= 0.8;
			} else if (p.mouseButton === p.RIGHT) {
				textLeading /= 0.8;
			}

			// Set the textLeading property
			buffer.textLeading(textLeading);

			// Redraw the buffer on the canvas
			p.redraw();
		}
	};

	//
	// Updates the buffer image
	//
	function updateBuffer() {
		var x, y, bufferImg, pixel, distance;

		// Clean the buffer
		buffer.background(0);

		// Write the text in red
		x = 0.5 * buffer.width;
		y = 0.5 * buffer.height;
		buffer.fill(buffer.color(255, 0, 0));
		buffer.text(phrase, x, y);

		// Manipulate the buffer pixels
		bufferImg = buffer.get();
		bufferImg.loadPixels();
		img.loadPixels();

		for (x = 0; x < bufferImg.width; x++) {
			for (y = 0; y < bufferImg.height; y++) {
				pixel = 4 * (x + y * bufferImg.width);

				if (bufferImg.pixels[pixel] === 255) {
					bufferImg.pixels[pixel] = img.pixels[pixel];
					bufferImg.pixels[pixel + 1] = img.pixels[pixel + 1];
					bufferImg.pixels[pixel + 2] = img.pixels[pixel + 2];
				} else {
					distance = Math.sqrt(p.sq(x - 0.5 * bufferImg.width) + p.sq(y - 0.5 * bufferImg.height));
					bufferImg.pixels[pixel] = p.map(distance, 0, 0.7 * bufferImg.width, 220, 0);
				}
			}
		}

		bufferImg.updatePixels();
		img.updatePixels();

		return bufferImg;
	}

};
