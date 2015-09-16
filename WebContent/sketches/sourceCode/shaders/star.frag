// Uniforms
uniform vec3 color;
uniform float radius;
uniform float atmRadius;
uniform float cellsSize;
uniform float spotsSize;
uniform vec3 directionToCamera;
uniform float seed;
uniform float time;

// Varyings
varying vec3 vPosition;
varying vec3 vNormal;

// 
// Simplex 4D noise implementation by Ian McEwan, Ashima Arts
// https://github.com/ashima/webgl-noise
//
vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

float permute(float x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) {
	const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
	vec4 p, s;
	p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
	p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
	s = vec4(lessThan(p, vec4(0.0)));
	p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www; 
	return p;
}
						
#define F4 0.309016994374947451

float snoise(vec4 v) {
	const vec4  C = vec4( 0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
	vec4 i = floor(v + dot(v, vec4(F4)));
	vec4 x0 = v - i + dot(i, C.xxxx);
	vec4 i0;
	vec3 isX = step(x0.yzw, x0.xxx);
	vec3 isYZ = step(x0.zww, x0.yyz);
	i0.x = isX.x + isX.y + isX.z;
	i0.yzw = 1.0 - isX;
	i0.y += isYZ.x + isYZ.y;
	i0.zw += 1.0 - isYZ.xy;
	i0.z += isYZ.z;
	i0.w += 1.0 - isYZ.z;
	vec4 i3 = clamp(i0, 0.0, 1.0);
	vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
	vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);
	vec4 x1 = x0 - i1 + C.xxxx;
	vec4 x2 = x0 - i2 + C.yyyy;
	vec4 x3 = x0 - i3 + C.zzzz;
	vec4 x4 = x0 + C.wwww;
	i = mod289(i); 
	float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
	vec4 j1 = permute(permute(permute(permute(i.w + vec4(i1.w, i2.w, i3.w, 1.0)) + i.z + vec4(i1.z, i2.z, i3.z, 1.0)) + i.y + vec4(i1.y, i2.y, i3.y, 1.0)) + i.x + vec4(i1.x, i2.x, i3.x, 1.0));
	vec4 ip = vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0) ;
	vec4 p0 = grad4(j0, ip);
	vec4 p1 = grad4(j1.x, ip);
	vec4 p2 = grad4(j1.y, ip);
	vec4 p3 = grad4(j1.z, ip);
	vec4 p4 = grad4(j1.w, ip);
	vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	p4 *= taylorInvSqrt(dot(p4, p4));
	vec3 m0 = max(0.6 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
	vec2 m1 = max(0.6 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
	m0 = m0 * m0;
	m1 = m1 * m1;
	return 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4))));
}

// 
// Simplex 3D noise implementation by Ian McEwan, Ashima Arts
// https://github.com/ashima/webgl-noise
//
vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);
  	vec2 i1;
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod289(i); 
	vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
	vec3 g;
	g.x  = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

//
// Main program
//
void main() {
	// Calculate the point radius (0, 1) and angle (-PI, PI) relative to the camera position
	vec3 v = cross(directionToCamera, normalize(vNormal));
	float pointRadius = length(v);
	float pointAngle = atan(-v.x, v.y);

	// Calculate the atmosphere noise
	float atmNoise = abs(snoise(vec2(2.0 * pointAngle, pointRadius - 0.7 * time + 1000.0 * seed)));

	// Calculate the cells noise
	float cellsNoise = abs(snoise(vec4(vPosition / (cellsSize * radius), 1.0 * time + 1000.0 * seed)));

	// Calculate the sunspots noise
	vec3 strechedPosition = vPosition;
	strechedPosition.y *= 1.5 + 0.5 * seed;
	float sunspotsNoise = max(0.4 / (1.0 + spotsSize), snoise(vec4(strechedPosition / (spotsSize * radius), 0.1 * time + 1000.0 * seed)));

	// Calculate the color mixing between the different components
	vec3 brightColor = min(2.0 * color + 0.3 * vec3(1.0), vec3(1.0));
	float mixFactor = 0.0;
	float alpha = 1.0;

	if(pointRadius > atmRadius) {
		mixFactor = 0.3 + 0.6 * atmNoise;
		alpha = (1.0 - 0.5 * atmNoise) * pow(1.0 - (pointRadius - atmRadius)/(1.0 - atmRadius), 2.0);
	} else {
		mixFactor = max(0.0, 0.5 - 0.7 * cos(1.5 * vPosition.y/ radius) * sunspotsNoise + 0.4 * cellsNoise);
	}

	// Fragment shader output
	gl_FragColor = vec4(mix(color, brightColor, mixFactor), alpha);
}
