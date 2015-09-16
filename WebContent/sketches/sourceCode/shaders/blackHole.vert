// Varyings
varying vec2 vUv;

//
// Main program
//
void main() {
	// Save the varyings
	vUv = uv;
		
	// Vertex shader output
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
