#extension GL_OES_standard_derivatives : enable

// Uniforms
uniform int pointCloud;
uniform int backScan;
uniform vec3 backColor;
uniform int showLines;
uniform int effect;
uniform int invertEffect;
uniform int fillWithColor;
uniform vec3 effectColor;
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
// Clasic 3D Perlin noise implementation by Stefan Gustavson.
// https://github.com/ashima/webgl-noise
//
vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
	vec3 Pi0 = floor(P);
	vec3 Pi1 = Pi0 + vec3(1.0);	
	Pi0 = mod289(Pi0);
	Pi1 = mod289(Pi1);
	vec3 Pf0 = fract(P);
	vec3 Pf1 = Pf0 - vec3(1.0);
	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	vec4 iy = vec4(Pi0.yy, Pi1.yy);
	vec4 iz0 = Pi0.zzzz;
	vec4 iz1 = Pi1.zzzz;
	vec4 ixy = permute(permute(ix) + iy);
	vec4 ixy0 = permute(ixy + iz0);
	vec4 ixy1 = permute(ixy + iz1);
	vec4 gx0 = ixy0 * (1.0 / 7.0);
	vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
	gx0 = fract(gx0);
	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
	vec4 sz0 = step(gz0, vec4(0.0));
	gx0 -= sz0 * (step(0.0, gx0) - 0.5);
	gy0 -= sz0 * (step(0.0, gy0) - 0.5);
	vec4 gx1 = ixy1 * (1.0 / 7.0);
	vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
	gx1 = fract(gx1);
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
	vec4 sz1 = step(gz1, vec4(0.0));
	gx1 -= sz1 * (step(0.0, gx1) - 0.5);
	gy1 -= sz1 * (step(0.0, gy1) - 0.5);
	vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
	vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
	vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
	vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
	vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
	vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
	vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
	vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
	vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x;
	g010 *= norm0.y;
	g100 *= norm0.z;
	g110 *= norm0.w;
	vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x;
	g011 *= norm1.y;
	g101 *= norm1.z;
	g111 *= norm1.w;
	float n000 = dot(g000, Pf0);
	float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
	float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
	float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
	float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
	float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
	float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
	float n111 = dot(g111, Pf1);
	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
	float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
	return 2.2 * n_xyz;
}

//
// The Perlin noise effect 
//
bool perlinNoiseEffect() {
	return cnoise(vec3(10.0 * vNormCoord.xy, 0.01 * time)) > 0.1;
}

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
	// Check if the vertex fragment changed the vertex world position
	if(effect == 1 || (effect == 13 && backScan != 1)) {
		// The varying normal is no longer correct. Calculate the new normal
		vec3 newNormal = cross(dFdx(vNormCoord), dFdy(vNormCoord));
		return dot(normalize(newNormal), normalize(lightPosition));
	} else {
		vec4 lightDirection = viewMatrix * vec4(lightPosition, 0.0);
		return dot(normalize(vNormal), normalize(lightDirection.xyz));
	}
}

//
// Calculates the diffuse factor produced by the light illumination using a toon-like effect
//
float diffuseToonFactor() {
	float df = diffuseFactor();

	if(df < 0.4) {
		return 0.1;	
	} else if(df < 0.8) {
		return 0.5;
	} else {
		return 0.8;
	}
}

//
// Calculates how close is the pixel to one of the grid lines
//
// Uses the method explained in the following tutorial: 
// http://madebyevan.com/shaders/grid/
//
float gridFactor() {
	float coord = 100.0 * vNormCoord.z + 0.01 * time;
    float derivative = fwidth(coord);
	return smoothstep(0.5 - derivative, 0.5, abs(fract(coord) - 0.5));
}

//
// Calculates how close is the pixel to the triangle edges
//
// Uses the method explained in the following tutorial: 
// http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-barycentric-coordinates
//
float edgeFactor() {
    vec3 derivative = fwidth(vBarycentricCoord);
    vec3 relCoord = smoothstep(vec3(0.0), derivative, vBarycentricCoord);
    return 1.0 - min(min(relCoord.x, relCoord.y), relCoord.z);
}

//
// Main program
//
void main() {
	// Apply some of the effects
	bool masked = false;

    if(effect == 5) {
       	masked = perlinNoiseEffect() != (invertEffect == 1); 
	} if(effect == 6) {
    	masked = holeEffect() != (invertEffect == 1);
	} else if(effect == 7) {
		masked = circleEffect() != (invertEffect == 1);
	} else if(effect == 8) {
        masked = verticalCutEffect() != (invertEffect == 1);
	}  else if(effect >= 9 && effect < 13) {
       	masked = maskEffect() != (invertEffect == 1); 
	} 
	
	// Fragment shader output
	if(masked){
		if(fillWithColor == 1) {
			if(pointCloud == 1) {
				gl_FragColor = vec4(effectColor * abs(diffuseFactor()), effectTransparency);
			} else {
				gl_FragColor = vec4(effectColor * diffuseFactor(), effectTransparency);
			}
		} else {
			discard;
		}
	} else if(effect == 3) {
		gl_FragColor = vec4(mix(effectColor * diffuseFactor(), vec3(1.0, 0.0, 0.0), gridFactor()), effectTransparency);
	} else if(effect == 4) {
		gl_FragColor = vec4(effectColor * diffuseToonFactor(), effectTransparency);
	} else if(showLines == 1) {
		gl_FragColor = vec4(mix(backColor * diffuseFactor(), vec3(0.0), edgeFactor()), 1.0);
	} else if(backScan == 1) {
		gl_FragColor = vec4(backColor * diffuseFactor(), 1.0);
	} else {
		gl_FragColor = vec4(vColor, 1.0);
	}
}
