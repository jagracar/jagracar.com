// Global variables
var sketch, gui;
var sketchContainer = "sketch__canvas";
var guiContainer = "sketch__gui";

function runSketch(sketch, element) {
	// Start the new sketch
	sketch = new p5(sketch, sketchContainer);
}

/*
 function runSketchOld(sketch, element) {
 // Remove the active class from the previously selected sketch
 $(".active-sketch").removeClass("active-sketch");

 // Set the current element active
 $(element).addClass("active-sketch");

 // Remove the sketch GUI if it was created
 if ( typeof gui !== 'undefined') {
 document.getElementById(guiContainer).removeChild(gui.domElement);
 gui = undefined;
 }

 // Remove any previous sketch
 if ( typeof p5Sketch !== 'undefined') {
 p5Sketch.remove();
 }

 // Start the new sketch
 p5Sketch = new p5(sketch, sketchContainer);
 }
 */