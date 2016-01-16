// Uniforms
uniform sampler2D tDiffuse;
uniform vec2 size;
uniform int effect;
uniform vec2 facePosition;
uniform vec2 faceSize;
uniform float time;

// Varings
varying vec2 vUv;

//
// Mirrors the x coordinate of the given pixel
//
vec2 mirrorX(vec2 p) {
	return vec2(p.x > 0.5? p.x : 1.0 - p.x, p.y);
}

//
// Mirrors the y coordinate of the given pixel
//
vec2 mirrorY(vec2 p) {
	return vec2(p.x, p.y > 0.5? p.y : 1.0 - p.y);
}

//
// Twists the pixel position
//
vec2 twist(vec2 p) {
	vec2 center = vec2(0.5);
	vec2 v = p - center;
	float r = length(v);	
	float ang = atan(v.y, v.x) + 6.0 * cos(time) * r;
	return vec2(r * cos(ang), r * sin(ang)) + center;
}


//
// Checks if the pixel is inside the face rectangle
//
bool insideFaceRect(vec2 p) {
	return p.x > facePosition.x && p.x < facePosition.x + faceSize.x && p.y > facePosition.y && p.y < facePosition.y + faceSize.y;
}

//
// Main program
//
void main() {
	vec2 p = vUv;

	// Apply the effects
	if(effect == 1) {
		p = mirrorX(p);
	} else if(effect == 2) {
		p = mirrorY(p);
	} else if(effect == 3) {
		p = twist(p);
	}

	// Get the texture color
	vec4 color = texture2D(tDiffuse, p);

	// Fragment shader output
	if(effect == 99 && insideFaceRect(p)) {
		color += vec4(1.0, 0.0, 0.0, 0.2);
 	} 

	gl_FragColor = color;
}
