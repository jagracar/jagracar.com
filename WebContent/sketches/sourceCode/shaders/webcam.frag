uniform sampler2D tDiffuse;

varying vec2 vUv;

//
// Main program
//
void main() {
	vec4 cTextureScreen = texture2D( tDiffuse, vUv.x < 0.5? vUv : vec2(1.0 - vUv.x , vUv.y) );
	gl_FragColor = vec4(cTextureScreen + vec4(1.0,0.0,0.0,1.0)*cos(20.0*vUv.y));
}
