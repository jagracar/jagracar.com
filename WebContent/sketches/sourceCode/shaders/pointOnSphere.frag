// Uniforms
uniform vec3 color;
uniform vec3 cityCoordinates;
uniform float pointSize;
uniform float time;

// Varyings
varying vec3 vPosition;

//
// Main program
//
void main() {
	float dist = distance(cityCoordinates, vPosition);

	if(dist < pointSize) {
		float wave = 0.8 * (1.0 + cos(20.0 * dist / pointSize - 0.05 * time));
		gl_FragColor = vec4(color, wave * (pointSize - dist) / pointSize);
	} else {
		discard;	
	}
}
