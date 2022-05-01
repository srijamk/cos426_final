import * as THREE from 'three';
import { Color } from 'three';
import { BasicLights } from 'lights';
import { Player, Wall, Enemy } from 'objects';
import SPARK from '../textures/spark1.png';
import { Vector3 } from 'three';

// modified effects from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_custom_attributes_particles.html

const NUM_PARTICLES = 1000;
const PARTICLE_RADIUS = 1.3;
const PLAYER_SCALE = 50;
const ENEMY_SCALE = 50;
const NUM_ENEMIES = 3;

class MainScene extends THREE.Scene {
    constructor (bounds) {
        super();

        this.bounds = bounds;

        this.background = new Color(0x000000);

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

        // add enemies
        this.initEnemies();

        // add lights
        const lights = new BasicLights();

        // add everything
        this.add(lights, this.player);
        
        // add bullets
        this.bullets = new Array(100);
        let bulletStatus = {
          initPos: this.player.position,
          boundary: {
            top: -this.bounds.height / 2 + 30,
            bottom: this.bounds.height / 2 - 30,
          },
        };
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i] = new Bullets(bulletStatus);
            this.add(this.bullets[i].particle);
        }
        this.lastShootTime = -1;
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

        const n1 = this.bounds.width; const n12 = n1/2;
        const n2 = this.bounds.height; const n22 = n2/2;

        for ( let i = 0; i < NUM_PARTICLES; i ++ ) {
            const x = (Math.random() * n1 - n12) * PARTICLE_RADIUS;
            const y = (Math.random() * 1000 - 500) * PARTICLE_RADIUS;
            const z = (Math.random() * n2 - n22) * PARTICLE_RADIUS;

            positions.push( x );
            positions.push( 0 );
            positions.push( z );

            const vx = ( x / 1000 ) + 0.5;
            const vy = ( y / 1000 ) + 0.5;
            const vz = ( z / 1000 ) + 0.5;

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

    initEnemies () {
        this.enemies = []
        for (let i = 0; i < NUM_ENEMIES; i++) {
            let status = {
                scale: ENEMY_SCALE, 
                pos: this.generateRandomPostion()
            }
            let enemy = new Enemy(status);
            this.enemies.push(enemy);
            this.add(enemy);
        }
    }

    // generate random position for enemies
    generateRandomPostion () {
        let x = - this.bounds.width * Math.random() + this.bounds.width / 2;
        let z = - this.bounds.height * Math.random() + this.bounds.height / 2;
        console.log(x, z)
        return new Vector3(x, 0, z);
    }

    animateStars (timeStamp) {
        const time = timeStamp / 500;
        const sizes = this.geometry.attributes.size.array;
        for ( let i = 0; i < NUM_PARTICLES; i ++ ) {
            sizes[ i ] = 1.8 * ( 1 + Math.sin( 0.1 * i + time ) );
        }

        this.geometry.attributes.size.needsUpdate = true;
    }

    resetEverything () {
    }

    freeze() {
        // TODO: freeze all player and enemy activity
        this.status.isPaused = true;
    }

    unfreeze() {
        // TODO: unfreeze all player and enemy activity
        this.status.isPaused = false;
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

    updatePlayerShoot (timeStamp) {
        if (this.status.isPaused) return;
        // shooting delay
        if (this.lastShootTime > 0 && ((timeStamp - this.lastShootTime) < 600)) {
            return;
        } 
        this.lastShootTime = timeStamp;
        for(let i = 0; i < this.bullets.length; i++) {
            if(!this.bullets[i].bulletIsAlive) {
                this.bullets[i].shootBullet(this.player.position);
                break;
            }
        }
    }

    update (timeStamp) {
        this.player.update();
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update();
        }
        this.animateStars(timeStamp);
    }
}

export default MainScene;
