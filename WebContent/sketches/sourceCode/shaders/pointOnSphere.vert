// Varyings
varying vec3 vPosition;

//
// Main program
//
void main() {
	vPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
