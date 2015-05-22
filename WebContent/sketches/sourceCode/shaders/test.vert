uniform float time;
attribute vec3 vNormal;
attribute vec3 vColor;
varying vec3 color;

void main() {
 	vec3 newPosition = position + time*vNormal;
 	color = vColor;
	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
