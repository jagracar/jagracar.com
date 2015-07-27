#extension GL_OES_standard_derivatives : enable

// Uniforms
uniform int pointCloud;
uniform int backScan;
uniform vec3 backColor;
uniform int showLines;
uniform int effect;
uniform int invertEffect;
uniform int fillWithColor;
uniform float effectTransparency;
uniform vec3 lightPosition;
uniform float time;
uniform sampler2D mask;

// Varyings
varying vec3 vNormCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vBarycentricCoord;

//
// The hole effect 
//
bool holeEffect() {
	return vNormCoord.z < -0.15 * (1.0 + cos(0.05 * time));
}

//
// The circle effect 
//
bool circleEffect() {
	return length(vNormCoord.xy) > 0.2 * (1.0 + cos(0.03 * time));
}

//
// The vertical cut effect 
//
bool verticalCutEffect() {
	return abs(vNormCoord.x) < 0.2 * (1.0 - 1.2 * cos(0.04 * time));
}

//
// The mask effect
//
bool maskEffect() {
	vec4 maskValue = texture2D(mask, vec2(0.5 - vNormCoord.x, 0.5 + vNormCoord.y));
	return all(greaterThan(maskValue.rgb, vec3(0.5)));
}

//
// Calculates the diffuse factor produced by the light illumination
//
float diffuseFactor() {
	vec4 lightDirection = viewMatrix * vec4(lightPosition, 0.0);
	return dot(normalize(vNormal), normalize(lightDirection.xyz));
}

//
// Calculates how close is the pixel to the triangle edges 
//
float edgeFactor(){
    vec3 derivative = fwidth(vBarycentricCoord);
    vec3 a3 = smoothstep(vec3(0.0), 1.0 * derivative, vBarycentricCoord);
    return min(min(a3.x, a3.y), a3.z);
}

//
// Main program
//
void main() {
	// Apply some of the effects
	bool masked = false;

	if(effect == 2) {
    	masked = (invertEffect == 1)? !holeEffect() : holeEffect();
	} else if(effect == 3) {
		masked = (invertEffect == 1)? !circleEffect(): circleEffect();
	} else if(effect == 4) {
        masked = (invertEffect == 1)? !verticalCutEffect() : verticalCutEffect();
	} else if(effect >= 5) {
       	masked = (invertEffect == 1)? !maskEffect() : maskEffect(); 
	}
	
	// Fragment shader output
	if(masked){
		if(fillWithColor == 1) {
			vec3 effectColor = vec3(1.0);

			if(pointCloud == 1) {
				gl_FragColor = vec4(effectColor * abs(diffuseFactor()), effectTransparency);
			} else {
				gl_FragColor = vec4(effectColor * diffuseFactor(), effectTransparency);
			}
		} else {
			discard;
		}
	} else if(showLines == 1) {
		gl_FragColor = vec4(mix(vec3(0.0), backColor * diffuseFactor(), edgeFactor()), 1);
	} else if(backScan == 1) {
		gl_FragColor = vec4(backColor * diffuseFactor(), 1);
	} else {
		gl_FragColor = vec4(vColor, 1);
	}
}
