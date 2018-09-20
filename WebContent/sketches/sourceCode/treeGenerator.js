var treeGeneratorSketch = function(p) {
	// Global variables
	var tree;

	// Initial setup
	p.setup = function() {
		var maxCanvasWidth, canvasWidth, canvasHeight, canvas;

		// Resize the canvas if necessary
		maxCanvasWidth = document.getElementById("widthRef").clientWidth - 20;
		canvasWidth = 600;
		canvasHeight = 450;

		if (canvasWidth > maxCanvasWidth) {
			canvasHeight = canvasHeight * maxCanvasWidth / canvasWidth;
			canvasWidth = maxCanvasWidth;
		}

		// Create the canvas
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Create and paint a new tree each time the mouse is pressed inside the canvas
		canvas.mousePressed(createAndPaintNewTree);

		// We will just paint the tree once
		p.noLoop();

		// Create the tree
		tree = createTree();
	};

	// Execute the sketch
	p.draw = function() {
		p.background(245);
		tree.paint();
	};

	/*
	 * This function creates a new tree recursively
	 */
	function createTree() {
		var position = p.createVector(0.5 * p.width, 0.95 * p.height, 0);
		var length = p.height / 7;
		var diameter = length / 4.5;
		var angle = p.radians(p.random(-5, 5));
		var accumulatedAngle = 0;
		var color = p.color(130, 80, 20);
		var level = 1;
		return new Branch(position, length, diameter, angle, accumulatedAngle, color, level);
	}

	/*
	 * This function creates a new tree and paints it on the canvas
	 */
	function createAndPaintNewTree() {
		// Create a new tree
		tree = createTree();

		// Paint the tree
		p.redraw();
	}

	/*
	 * The Branch class
	 */
	function Branch(position, length, diameter, angle, accumulatedAngle, color, level) {
		this.position = position;
		this.length = length;
		this.diameter = diameter;
		this.angle = angle;
		this.accumulatedAngle = accumulatedAngle;
		this.color = color;
		this.level = level;

		// Create the sub branches
		this.middleBranch = this.createSubBranch(true);
		this.extremeBranch = this.createSubBranch(false);
	}

	/*
	 * This method paints the branch and its sub-branches in the canvas
	 */
	Branch.prototype.paint = function() {
		// Calculate the diameter at the branch top
		var topDiameter = this.extremeBranch ? this.extremeBranch.diameter : 0.65 * this.diameter;

		// Apply the coordinate transformations
		p.push();
		p.translate(this.position.x, this.position.y);
		p.rotate(this.angle);

		// Paint the middle branch
		if (this.middleBranch) {
			this.middleBranch.paint();
		}

		// Paint the extreme branch
		if (this.extremeBranch) {
			this.extremeBranch.paint();
		}

		// Paint the branch
		p.fill(this.color);
		p.noStroke();
		p.beginShape();
		p.vertex(-this.diameter / 2, 0);
		p.vertex(-topDiameter / 2, -1.04 * this.length);
		p.vertex(topDiameter / 2, -1.04 * this.length);
		p.vertex(this.diameter / 2, 0);
		p.endShape();

		p.pop();
	};

	/*
	 * This method creates a new sub-branch
	 */
	Branch.prototype.createSubBranch = function(isMiddleBranch) {
		// Decide if the branch should be created
		var createBranch = false;
		var maxLevel = 18;

		if (isMiddleBranch) {
			if (this.level < 4 && p.random() < 0.7) {
				createBranch = true;
			} else if (this.level >= 4 && this.level < 10 && p.random() < 0.8) {
				createBranch = true;
			} else if (this.level >= 10 && this.level < maxLevel && p.random() < 0.85) {
				createBranch = true;
			}
		} else {
			if (this.level == 1) {
				createBranch = true;
			} else if (this.level < maxLevel && p.random() < 0.85) {
				createBranch = true;
			}
		}

		if (createBranch) {
			// Calculate the starting position of the new branch
			var newPosition = p.createVector(0, isMiddleBranch ? -p.random(0.5, 0.9) * this.length : -this.length);

			// Calculate the length of the new branch
			var newLength = p.random(0.8, 0.9) * this.length;

			// Calculate the diameter of the new branch
			var newDiameter = (this.level < 5) ? p.random(0.8, 0.9) * this.diameter : p.random(0.65, 0.75) * this.diameter;

			// Calculate the inclination angle of the new branch
			var newAngle;

			if (isMiddleBranch) {
				var sign = (p.random() < 0.5) ? -1 : 1;
				newAngle = sign * p.radians(p.random(20, 40));
			} else {
				newAngle = p.radians(p.random(-15, 15));
			}

			// Don't let the branches fall too much
			if (this.level < 8 && (p.abs(this.accumulatedAngle + this.angle + newAngle) > 0.9 * p.HALF_PI)) {
				newAngle *= -1;
			}

			// Calculate the color of the new branch
			var newColor;

			if (newDiameter > 1) {
				var deltaColor = p.random(0, 10);
				newColor = p
						.color(p.red(this.color) + deltaColor, p.green(this.color) + deltaColor, p.blue(this.color));
			} else {
				newColor = p.color(0.75 * p.red(this.color), p.green(this.color), 0.85 * p.blue(this.color));
			}

			// Calculate the new branch level
			var newLevel = this.level + 1;

			if (this.level < 6 && p.random() < 0.3) {
				newLevel++;
			}

			// Return the new branch
			return new Branch(newPosition, newLength, newDiameter, newAngle, this.accumulatedAngle + this.angle,
					newColor, newLevel);
		} else {
			// Return undefined
			return;
		}
	};
};
