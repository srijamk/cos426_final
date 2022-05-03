import * as THREE from 'three';
import { Color } from 'three';
import { BasicLights } from 'lights';
import { Player, Wall, Enemy } from 'objects';
import SPARK from '../textures/spark1.png';
import { Vector3 } from 'three';
import Bullets from '../objects/Bullets/Bullets';
import {ShootSound} from '../../assets';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from '../../fonts';

// modified effects from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_custom_attributes_particles.html

const NUM_PARTICLES = 1000;
const PARTICLE_RADIUS = 1.3;
const PLAYER_SCALE = 50;
const ENEMY_SCALE = 50;
const NUM_ENEMIES = 3;
const ENEMY_SPEED = 90; // math.random() * 20 + 90 -> [90, 110]
const ENEMY_RADIUS = 1.3;

const enemy_info = [
    {
        "level": 0, 
        "init_enemy_num": 3,
        "max_enemy_num": 5,
        "enemy_speed": 0, 
        "enemy_movement": "static", 
        "enemy_scale": ENEMY_SCALE, 
        "enemy_radius": ENEMY_RADIUS
    }, 
    {
        "level": 1, 
        "init_enemy_num": 3,
        "max_enemy_num": 7,
        "enemy_speed": 100, 
        "enemy_movement": "horizontal",
        "enemy_scale": ENEMY_SCALE, 
        "enemy_radius": ENEMY_RADIUS
    }, 
    {
        "level": 2,
        "init_enemy_num": 3,
        "max_enemy_num": 7,
        "enemy_speed": 110, 
        "enemy_movement": "random",
        "enemy_scale": ENEMY_SCALE, 
        "enemy_radius": ENEMY_RADIUS
    }
]

class MainScene extends THREE.Scene {
    constructor (bounds, camera, level) {
        super();

        this.bounds = bounds;
        this.level = level;

        this.background = new Color(0x000000);

        this.status = {
            isPaused: false
        }

        this.camera = camera;

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
        this.player = new Player(this.playerStatus, this.camera);

        // show health bar
        this.health_color = 0x00ff00;
        this.health_geometry = new THREE.RingGeometry( 30, 40, 8, 8);
        this.health_material = new THREE.MeshBasicMaterial( { color: this.health_color, side: THREE.DoubleSide } );
        this.health_mesh = new THREE.Mesh( this.health_geometry, this.health_material );
        this.health_mesh.position.copy(this.camera.position);
        this.health_mesh.rotation.copy(this.camera.rotation);
        this.health_mesh.translateX(- 3 * window.innerWidth / 13);
        this.health_mesh.translateY(2 * window.innerHeight / 9);
        this.health_mesh.renderOrder = 1;
        this.health_mesh.needsUpdate = true;
        this.health_mesh.material.needsUpdate = true;
        this.health_mesh.material.color.needsUpdate = true;
        this.health_mesh.geometry.verticesNeedUpdate = true;
        this.health_mesh.geometry.elementsNeedUpdate = true;
        this.health_mesh.geometry.parameters.needsUpdate = true;

        this.add(this.health_mesh);
        this.health_bar_angle = Math.PI * 2;

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

    resetHealth() {
        // TODO: show HEALTH title in top-left with TextGeometry
        // TODO: create ring
        this.health_color = '#00ff00';
    }

    endGame() {
        let curScene = this;
        this.freeze();
        const geometry = new THREE.PlaneGeometry( window.outerWidth * 10, window.outerHeight * 10 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3} );
        const plane = new THREE.Mesh( geometry, material );
        plane.position.copy(this.camera.position);
        plane.rotation.copy(this.camera.rotation);
        plane.translateZ(-10);
        plane.renderOrder = 3;

        const loader = new FontLoader();
        
        // Display a "Game Paused message"
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Game Over', {
                font: font,
                size: 80,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
              });
              
            var txt = new THREE.Mesh(geometry, material);
            txt.position.copy(curScene.camera.position);
            txt.rotation.copy(curScene.camera.rotation);
            txt.translateZ(-10);
            txt.renderOrder = 1;

            curScene.add(txt);
        } );

        // Display a "Press Space to resume" message.
        loader.load( CyberskyFont, function ( font ) {
    
            const geometry = new TextGeometry( 'Press Space to play again.\nPress Esc to return home.', {
                font: font,
                size: 30,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });
              
              var txt = new THREE.Mesh(geometry, material);
              txt.position.copy(curScene.camera.position);
              txt.rotation.copy(curScene.camera.rotation);
              txt.translateZ(-10);
              txt.translateY(-60);
              txt.renderOrder = 2;

              txt.name = "gameover";
              curScene.add(txt);
        } );

        this.add(plane);
    }

    removeOneHealth() {
        // ring health bar inspired by: https://codepen.io/cjonasw/pen/RPbXrR
        this.player.health--;
        let greenComponent = this.player.health / this.player.max_health;
        let redComponent = (this.player.max_health - this.player.health) / this.player.max_health;
        this.health_color = new THREE.Color(redComponent, greenComponent, 0.0);
        this.health_mesh.material.color.setRGB(redComponent, greenComponent, 0.0);
        if (this.player.health == 0) this.endGame();
        this.health_bar_angle -= Math.PI / 4.0;
        this.health_mesh.geometry.dispose();
        this.health_mesh.geometry = new THREE.RingGeometry(30, 40, 8, 8, 0, this.health_bar_angle);
        console.log(this.health_mesh.geometry.parameters.thetaLength);
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
        let bound = {
            left: - this.bounds.width / 2 + 30,
            right: this.bounds.width / 2 - 30,
            up: - this.bounds.height / 2 + 30, 
            down: 0
        }
        let status = enemy_info[this.level];
        status.boundary = bound;
        for (let i = 0; i < NUM_ENEMIES; i++) {
            status.pos = this.generateRandomPostion();
            let enemy = new Enemy(status);
            this.enemies.push(enemy);
            this.add(enemy);
        }
    }

    // generate random position for enemies
    generateRandomPostion () {
        let x = - this.bounds.width * Math.random() + this.bounds.width / 2;
        let z = - this.bounds.height / 2 + Math.random() * this.bounds.height / 4;
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
        this.resetHealth();
        this.resetPlayerStatus();
    }

    freeze() {
        // TODO: freeze all player and enemy activity
        this.status.isPaused = true;

        this.player.freeze();
        for (let e of this.enemies) {
            e.freeze();
        }
    }

    unfreeze() {
        // TODO: unfreeze all player and enemy activity
        this.status.isPaused = false;

        this.player.unfreeze();
        this.enemies.forEach (e => {
            e.unfreeze();
        })
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
        if (this.lastShootTime > 0 && ((timeStamp - this.lastShootTime) < 500)) {
            return;
        } 
        this.lastShootTime = timeStamp;
        for(let i = 0; i < this.bullets.length; i++) {
            if(!this.bullets[i].bulletIsAlive) {
                var myAudio = new Audio(ShootSound);
                myAudio.volume = 0.2;
                myAudio.play();
                this.removeOneHealth();
                this.bullets[i].shootBullet(this.player.position);
                break;
            }
        }
    }

    update (timeStamp) {
        this.player.update();
        for (let i = 0; i < this.bullets.length; i++) {
            let x = this.bullets[i].update(this.enemies);
            if (x != undefined) {
                this.remove(x);
            }
        }
        this.animateStars(timeStamp);
        this.enemies.forEach( e => {
            e.update(this.player.position, timeStamp);
        })
    }
}

export default MainScene;
