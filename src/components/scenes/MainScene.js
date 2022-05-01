import * as THREE from 'three';
import { Color } from 'three';
import { BasicLights } from 'lights';
import { Player, Wall } from 'objects';
import SPARK from '../textures/spark1.png';

// modified effects from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_custom_attributes_particles.html

const NUM_PARTICLES = 1000;
const PARTICLE_RADIUS = 1.3;
const PLAYER_SCALE = 50;

class MainScene extends THREE.Scene {
    constructor (bounds) {
        super();

        this.status = {
            isPaused: false
        }

        this.playerStatus = {
            radius: 0.1, 
            playerPos: new THREE.Vector3(0, 0, bounds.height / 2 - PLAYER_SCALE), 
            boundary: {left: - bounds.width/2 + PLAYER_SCALE, right: bounds.width/2 - PLAYER_SCALE}, 
            scale: PLAYER_SCALE
        }

        this.init();
    }

    init () {
        // add background
        this.initStars();

        // add player
        this.player = new Player(this.playerStatus);

        // add lights
        const lights = new BasicLights();

        // add everything
        this.add(lights, this.player);
    }

    returnVertexShader() {
        return `
        attribute float size;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }`
    }

    returnFragmentShader() {
        return `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4( vColor, 1 );
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
        }
        `
    }

    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_points_interleaved.html
    initStars () {
        let uniforms = {
            pointTexture: { value: new THREE.TextureLoader().load( SPARK ) }
        };

        const shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: uniforms,
            vertexShader: this.returnVertexShader(),
            fragmentShader: this.returnFragmentShader(),

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true

        } );

        this.geometry = new THREE.BufferGeometry();

        const positions = [];
        const colors = [];
        const sizes = [];

        const n = 1000; const n2 = n/2;

        for ( let i = 0; i < NUM_PARTICLES; i ++ ) {
            const x = (Math.random() * n - n2) * PARTICLE_RADIUS;
            const y = (Math.random() * n - n2) * PARTICLE_RADIUS;
            const z = (Math.random() * n - n2) * PARTICLE_RADIUS;

            positions.push( x );
            positions.push( 0 );
            positions.push( z );

            const vx = ( x / n ) + 0.5;
            const vy = ( y / n ) + 0.5;
            const vz = ( z / n ) + 0.5;

            // color.setRGB( vx, vy, vz );
            // color.setHSL( i / NUM_PARTICLES, 1.0, 0.5 );
            // colors.push( color.r, color.g, color.b );
            colors.push(vx, vy, vz)

            sizes.push( 10 );

        }

        this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        this.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

        this.particleSystem = new THREE.Points( this.geometry, shaderMaterial );
        this.add( this.particleSystem );
    }  

    animateStars (timeStamp) {
        const time = timeStamp / 500;
        const sizes = this.geometry.attributes.size.array;
        for ( let i = 0; i < NUM_PARTICLES; i ++ ) {
            sizes[ i ] = 1.5 * ( 1 + Math.sin( 0.1 * i + time ) );
        }

        this.geometry.attributes.size.needsUpdate = true;
    }

    resetEverything () {
        
    }

    resetPlayerStatus () {
        this.player.currentState = 0;
    }

    buildWalls () {

    }

    updatePlayerLocation (isRight) {
        if (this.status.isPaused) return;

        this.player.currentState = isRight;
    }

    updatePlayerShoot () {
        if (this.status.isPaused) return;
    }

    update (timeStamp) {
        this.player.update();
        this.animateStars(timeStamp);
    }
}

export default MainScene;