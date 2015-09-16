// Uniforms
uniform float radius;
uniform float pulsation;
uniform float time;

// Varyings
varying vec3 vPosition;
varying vec3 vNormal;

//
// Main program
//
void main() {
	// Create a small pulsation effect
	vec3 newPosition = position + (pulsation * radius * abs(fract(0.5 * time) - 0.5)) * normal;

	// Save the varyings
	vPosition = newPosition;
	vNormal = normalize(normalMatrix * normal);
	
	// Vertex shader output
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
