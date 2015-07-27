// Uniforms
uniform int pointCloud;
uniform int backScan;
uniform float pointSize;
uniform int effect;
uniform float time;

// Attributes
attribute vec3 aColor;
attribute vec3 aNormal;
attribute vec3 aBarycentricCoord;

// Varyings
varying vec3 vNormCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vBarycentricCoord;

//
// The pulsation effect 
//
vec3 pulsationEffect(vec3 normalVector){
	return 7.0 * normalVector * (1.0 - cos(0.08 * time));
}

//
// Normalizes the vector coordinates to have values between -0.5 and 0.5 
//
vec3 normalizeCoordinates(vec3 vector){
	return vec3(vector)/500.0;
}

//
// Main program
//
void main() {
	vec3 newPosition = position;
	vec3 normal = normalize(aNormal);

	// Apply some of the effects
	if(effect == 1) {
		newPosition += pulsationEffect(normal);
	}

	// Shift a bit the position if it's a backscan and invert the normal
	if(backScan == 1) {
		newPosition -= 0.5 * normal;
		normal = -normal;
	}

	// Save the varyings
	vNormCoord = normalizeCoordinates(newPosition);
	vColor = aColor;
	vNormal = normalize(normalMatrix * normal);

	if(pointCloud != 1) {
		vBarycentricCoord = aBarycentricCoord;
	}

	// Vertex shader output
	gl_PointSize = pointSize;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
