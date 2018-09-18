// To be run when the page finishes loading
window.onload = function() {
	// Create a special button to slide up and down the CV sections
	var button = $("<button></button>").addClass("toogle-button").addClass("up-icon");

	// Define the button click event
	button.click(function() {
		var bt = $(this);

		if (bt.hasClass("up-icon")) {
			bt.siblings("header").nextAll().slideUp("slow", function() {
				bt.removeClass("up-icon").addClass("down-icon");
			});
		} else if (bt.hasClass("down-icon")) {
			bt.siblings("header").nextAll().slideDown("slow", function() {
				bt.removeClass("down-icon").addClass("up-icon");
			});
		}
	});

	// Add a button to each CV section
	$(".cv-section").prepend(button);
};
