// Uniforms
uniform int pointCloud;
uniform int backScan;
uniform int showLines;
uniform float pointSize;
uniform int effect;
uniform vec3 cursor;
uniform float time;

// Attributes
attribute vec3 aColor;
attribute vec3 aNormal;
attribute vec3 aFaceNormal;
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
// The second pulsation effect 
//
vec3 pulsationEffect2(vec3 normalVector){
	return 70.0 * normalVector * sin(0.08 * time);
}

//
// The ball effect 
//
vec3 ballEffect(vec3 normalVector){
	vec3 diff = position - cursor; 
	float distSq = dot(diff, diff);
	float ballRadiusSq = 400.0;

	if(distSq < ballRadiusSq){
		float a = 1.0;
		float b = 2.0 * dot(normalVector, diff);
		float c = distSq - ballRadiusSq;
		return normalVector * (-b + sqrt(pow(b, 2.0) - 4.0 * a * c))/(2.0 * a);
	} else {
		return vec3(0.0);
	}
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
	vec3 faceNormal = normalize(aFaceNormal);

	// Apply some of the effects
	if(effect == 1) {
		newPosition += pulsationEffect(normal);
	} else if(effect == 2) {
		newPosition += pulsationEffect2(pointCloud == 1? normal : faceNormal);
	} else if(effect == 12 && backScan != 1) {
		newPosition += ballEffect(normal);
	}

	// Shift a bit the position if it's a backscan and invert the normal
	if(backScan == 1) {
		newPosition -= 0.5 * normal;
		normal = -normal;
		faceNormal = -faceNormal;
	}

	// Use the face normal instead of the vertex normal for the second pulsation effect
	if(effect == 2 || showLines == 1){
		normal = faceNormal;
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
