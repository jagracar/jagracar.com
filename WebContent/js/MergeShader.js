/**
 * @author jagracar / http://jagracar.com/
 *
 * Merge shader
 */

THREE.MergeShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"tAdd": { type: "t", value: null },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tAdd;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"vec4 background = texture2D( tAdd, vUv );",

			"gl_FragColor = vec4( texel.xyz + background.xyz * (1.0 - texel.w), 1.0);",

		"}"

	].join("\n")

};
