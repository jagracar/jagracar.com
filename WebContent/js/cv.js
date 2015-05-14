$(document).ready(function() {
	// Create a special button to slide up and down the cv sections
	var button = $("<button class='toogle-button up-icon'></button>");

	// Define the button click event
	button.click(function() {
		var bt = $(this);
		if (bt.hasClass("up-icon")) {
			bt.parents(".cv-section__header").nextAll().slideUp(400, function() {
				bt.removeClass("up-icon").addClass("down-icon");
			});
		} else if (bt.hasClass("down-icon")) {
			bt.parents(".cv-section__header").nextAll().slideDown(400, function() {
				bt.removeClass("down-icon").addClass("up-icon");
			});
		}
	});

	// Add a button to each section header
	$(".cv-section__header > h1").prepend(button);

	// Add the time to the footer
	$("#timeSpan").text((new Date()).toDateString());
});

function changeElementWidth(id) {
	var el = document.getElementById(id);
	var tmp = document.createElement("span");
	tmp.innerHTML = el.innerHTML;
	document.body.appendChild(tmp);
	var width = tmp.offsetWidth;
	document.body.removeChild(tmp);
	el.style.minWidth = width + "px";
}

function collapse(id) {
	var el = document.getElementById(id);
	if (el.style.display == "none") {
		el.style.display = "block";
	} else {
		el.style.display = "none";
	}
}
