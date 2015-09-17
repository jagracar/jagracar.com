
varying vec2 vUv;

//
// Main program
//
void main() {
	vUv = uv;

	// Vertex shader output
	gl_Position = vec4(position, 1.0);
}
