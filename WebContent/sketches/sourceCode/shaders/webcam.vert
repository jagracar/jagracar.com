// Uniforms
uniform int flipped;

// Varyings
varying vec2 vUv;

//
// Main program
//
void main() {
	// Save the varyings
	vUv = (flipped == 1)? vec2(1.0 - uv.x, uv.y) : uv;

	// Vertex shader output
	gl_Position = vec4(position, 1.0);
}
