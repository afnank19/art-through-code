export const chroma = `precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 palette( in float t )
{
    vec3 a = vec3(0.70, 0.60, 0.80);
    vec3 b = vec3(0.30, 0.20, 0.40);
    vec3 c = vec3(1.00, 1.00, 1.00);
    vec3 d = vec3(0.90, 0.10, 0.40);

    return a + b*cos( 6.283185*(c*t+d) );
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

void main() {
    vec2 st =(2.0 * gl_FragCoord.xy - u_resolution.xy )/u_resolution.y;
    vec2 uv0 = st;
    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*1.25);

    float pattern = pos.x;

    pos = rotate2d( noise2(pos) ) * pos; // rotate the space
    pattern = lines(pos,.25); // draw lines

    // Use the noise function
    float n = noise2(vec2(pos.x - u_time / 12. , pos.y));

    float b =   noise2(pos + u_time / 16.)*.5+.5;
    vec3 col = palette(b + n * 2. - u_time / 16.);

    // col += smoothstep(.15,.2,noise2(pos*1.5));
    // col -= smoothstep(.35,.4,noise(pos*1.5));
    float e = length(uv0) - 0.5;
    e = smoothstep(0.1, 0.7, e / 2.);
    e = 1.0 - e / 1.1;

    // col -= pattern;
    // col += col / 2.;
    col *= e;

    gl_FragColor = vec4(col, 1.0);
}
`

export const stringTheory = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 palette( in float t )
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos( 6.283185*(c*t+d) );
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

void main() {
    vec2 st =(2.0 * gl_FragCoord.xy - u_resolution.xy )/u_resolution.y;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*1.25);

    float pattern = pos.x;

    pos = rotate2d( noise2(pos) ) * pos; // rotate the space
    pattern = lines(pos +  u_time / 5.,.25); // draw lines

    // Use the noise function
    float n = noise2(vec2(pos.x , pos.y));

    vec3 col = palette(n * 2. + u_time / 16.);
    // col += smoothstep(.15,.2,noise2(pos*1.5));
    // col -= smoothstep(.35,.4,noise(pos*1.5));

    col -= pattern;
    col += col / 2.;

    gl_FragColor = vec4(col, 1.0);
}
`

export const learn = `
precision mediump float;

uniform vec2 u_resolution;  // Screen resolution
uniform float u_time;
uniform vec2 u_mouse;

vec3 palette( in float t )
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.10, 0.20);

    return a + b*cos( 6.283185*(c*t+d) );
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}



void main() {
    vec2 st = (2.0 * gl_FragCoord.xy - u_resolution.xy  )/u_resolution.y;
    vec2 uv0 = st;
    vec3 finalColor = vec3(.0);


    st = fract(st * .8) - 0.5;
    vec3 col = palette(length(uv0) + u_time / 2.);

    float d = abs(length(st) - 0.5) - 0.1;
    float e = sdBox(st, vec2(0.5,0.5));
    // d -= e;
    // d = smoothstep(0.0, 0.9, d);

    finalColor += col * d * 2.;


	gl_FragColor = vec4(finalColor,1.0);
}
`

export const sdfs = `
#define t u_time
precision mediump float;

uniform vec2 u_resolution;  // Screen resolution
uniform float u_time;
uniform vec2 u_mouse;

vec3 palette( in float t )
{
    vec3 a = vec3(0.70, 0.60, 0.80);
    vec3 b = vec3(0.30, 0.20, 0.40);
    vec3 c = vec3(1.00, 1.00, 1.00);
    vec3 d = vec3(0.90, 0.10, 0.40);

    return a + b*cos( 6.283185*(c*t+d) );
}

float sdRoundedX( in vec2 p, in float w, in float r )
{
    p = abs(p);
    return length(p-min(p.x+p.y,w)*0.5) - r;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main() {
    vec2 st = (2.0 * gl_FragCoord.xy - u_resolution.xy )/u_resolution.y;
    vec2 uv0 = st;
    vec3 fc = vec3(.0);

    st = rotate2d( (u_time)/6. ) * st;


    for (float i = 0.0; i < 2.0; ++i) {
        st = fract(st * 1.25) - 0.5;
        vec3 col = palette(length(uv0) + t / 2.0 + i*.4);
        float d = sdRoundedX(st * 1.5, 1.0, 0.0) ;
        d =abs(sin(d * 8. + u_time) / 6.);
        d = 0.005/d;
        d = pow(d, 1.1);
        d = smoothstep(0.0, 0.1, d);
        // float e = 0.005 / d;
        // d += e;
        float e = length(uv0) - 0.5;
        e = smoothstep(0.1, 0.7, e);
        e = 1.0 - e;
        d *= e;

        fc += col * d;
    }


    gl_FragColor = vec4(fc, 1.0);
}
`

export const shade = `

precision mediump float;

uniform vec2 u_resolution;  // Screen resolution
uniform float u_time;
uniform vec2 u_mouse;

vec3 red() {
    return vec3(1.0,0.0,0.0);
}

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.009, pct, st.y) -
          smoothstep( pct, pct+0.009, st.y);
}

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

vec3 palette( in float t )
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.10, 0.20);

    return a + b*cos( 6.283185*(c*t+d) );
}

void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution;
    // vec2 normalized_mouse = u_mouse / u_resolution;

	// gl_FragColor = vec4(st.x,normalized_mouse.x,normalized_mouse.y,1.0);
    vec2 st = (2.0 * gl_FragCoord.xy - u_resolution.xy )/u_resolution.y;
    vec2 uv0 = st;
    vec3 finalColor = vec3(0.);

    // st.x *= 6.14;

    for (float i = 0.; i < 2.0; i++) {
        st = fract(st * 1.5) - 0.5;
        vec3 col = palette(length(uv0 * 1.5) + i*.4 + u_time / 2.);
        // float d = length(vec2(st.x, st.y));
        float d = sdCircle(st, 0.5 );
        // float d = sdBox(st, vec2(0.5, 0.5)) - 0.1;
    
        d = abs(sin(d * 8. + u_time) / 8.);
        d = 0.015/d;
        d = pow(d, 1.1);
        // d = smoothstep(0.0, 0.1, d );
        // d = 1. - d;

        finalColor += col * d;
    }

	gl_FragColor = vec4(finalColor,1.0);
}
`

export const tangerine = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    float waveCenter = 0.3
        + 0.05 * sin(u_time/2. + uv.x * 4.0)
        + 0.03 * sin(u_time/2. * 1.7 + uv.x * 7.0);

    float wC = 0.3 + 0.05 * sin(u_time + uv.x * 8.0) + 0.03 * sin(u_time * 0.7 + uv.x * 4.0);

    float bandStart = waveCenter - 0.025;  // Lower boundary for the gradient
    float bandEnd   = waveCenter + 0.025;  // Upper boundary for the gradient

    float bS = wC - 0.2;
    float bE   = wC + 0.2;

    float t = smoothstep(bandStart , bandEnd, uv.y);
    float s = smoothstep(bS, bE, uv.y);
    t = t * s;

    vec3 orange = vec3(1.0, 0.3, 0.0);
    vec3 black  = vec3(0.0);

    vec3 lightOrange = vec3(1.0, 0.6, 0.);  // Lighter orange
    vec3 redderOrange = vec3(1.0, 0.1, 0.0);   // Redder orange

    float mixFactor = 0.8 + 0.2 * sin(u_time + uv.x * 5.0);

    vec3 dO = mix(lightOrange, redderOrange, mixFactor);

    vec3 color = mix(dO, black, t);

    float noise = (rand(gl_FragCoord.xy) - 0.5) * 0.05; // adjust 0.1 to change intensity
    color += noise;

    gl_FragColor = vec4(color, 1.0);
}
`