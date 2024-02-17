const shader = {
  vertex: 
  `
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
  
  float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  // END PERLIN NOISE
  
  uniform float uTime;
  uniform float uSpeed;
  uniform float uFrequency;
  uniform vec2 uMousePos;
  uniform float uHoleFactor;
  uniform float uAlphaFactor;
  
  varying float vHeight;
  varying float vAlpha;
  
  float pi = 3.14159265;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Apply Speed
    float timer = uTime * uSpeed;  
    
    // Apply Noise
    vHeight = noise(vec3(uv * uFrequency, timer)) * 0.8;
  
    // Apply MousePos
    vAlpha = distance(uMousePos, modelPosition.xy) * 0.5;
    vAlpha += uHoleFactor;
    vAlpha *= uAlphaFactor;

    modelPosition.z += vHeight;
  
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
  } 
  `
  ,
  fragment: 
  `
  varying float vHeight;
  varying float vAlpha;

  void main(){
    vec3 minColor = vec3(0, 0, 0);
    vec3 maxColor = vec3(1, 1, 1);
    
    vec3 mixColor = mix(minColor, maxColor, vHeight * 0.5);
  
    gl_FragColor = vec4(mixColor, vAlpha);
  }
  `
  ,
};

export default shader;