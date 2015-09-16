// Uniforms
uniform sampler2D tDiffuse;
uniform float size;
uniform float rotation;
uniform float distanceToCamera;

// Varyings
varying vec2 vUv;

//
// Main program
//
void main() {
	// Calculate the black hole radius in UV units
	float blackHoleRadius = size * 10.0 / distanceToCamera;

	// Calculate the vector pointing to the black hole
	vec2 toBlackHole = vec2(0.5) - vUv;
	float distanceToBlackHole = length(toBlackHole);
	float relativeDistance =  distanceToBlackHole / blackHoleRadius;

	// Calculate the final color depending on the pixel position
	vec4 finalColor;

	if(relativeDistance > 1.0){
		finalColor = texture2D(tDiffuse, vUv);
	} else {
		// Rotate the UV coordinates
		float ang = atan(-toBlackHole.y, -toBlackHole.x) + rotation * smoothstep(0.8, 0.2, relativeDistance);
		vec2 rotatedUv = vec2(0.5) + distanceToBlackHole * vec2(cos(ang), sin(ang));
		
		// Calculate the new normalized vector pointing to the black hole
		vec2 v = normalize(vec2(0.5) - rotatedUv);

		// The actual BH effect
		finalColor = texture2D(tDiffuse, rotatedUv + blackHoleRadius * smoothstep(0.8, 0.2, relativeDistance) * v);
		finalColor *= smoothstep(0.25, 0.4, relativeDistance);
	}
			
	// Fragment shader output
	gl_FragColor = finalColor;
}
