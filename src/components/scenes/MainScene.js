import * as THREE from 'three';
import { Color } from 'three';
import { BasicLights } from 'lights';
import { Player, Wall } from 'objects';
import STAR from '../textures/star.png';
import { Vector3 } from 'three';
import { Scene } from 'three';

class MainScene extends THREE.Scene {
    constructor (bounds) {
        super();

        this.status = {
            isPaused: false
        }

        this.playerStatus = {
            radius: 0.1, 
            playerPos: new THREE.Vector3(0, 0, bounds.height / 2 - 30), 
            boundary: {left: - bounds.width/2 + 30, right: bounds.width/2 - 30}
        }

        this.init();
    }

    init () {
        // build background
        // let points = []
        // for (let i = 0; i < 1000; i ++) {
        //     let star = new THREE.Vector3(
        //         Math.random() * 600 - 300, 
        //         0,
        //         Math.random() * 600 - 300,
        //     )
        //     star.velocity = 0;
        //     star.acceleration = 0.02;
        //     points.push(star);
        // }
        // let starGeo = new THREE.BufferGeometry().setFromPoints( points );
        // let sprite = new THREE.TextureLoader().load(STAR);
        // let starMaterial = new THREE.PointsMaterial (
        //     {
        //         color: 0xaaaaa, 
        //         size: Math.random(),
        //         map: sprite
        //     }
        // );
        // this.stars = new THREE.Points(starGeo, starMaterial);
        // //this.animateStars();
        // this.add(this.stars);

        // attempt 2
        this.initStars();

        // add player
        this.player = new Player(this.playerStatus);

        // add lights
        const lights = new BasicLights();

        // add everything
        this.add(lights, this.player);
    }

    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_points_interleaved.html
    initStars () {
        const NUM_PARTICLES = 2000;
        const geometry = new THREE.BufferGeometry();
        const arrayBuffer = new ArrayBuffer( NUM_PARTICLES * 16 );
        const interleavedFloat32Buffer = new Float32Array( arrayBuffer );
		const interleavedUint8Buffer = new Uint8Array( arrayBuffer );
        const color = new THREE.Color();

        const n = 1000, n2 = n / 2; // particles spread in the cube

        for ( let i = 0; i < interleavedFloat32Buffer.length; i += 4 ) {

            // position (first 12 bytes)

            const x = Math.random() * n - n2;
            const y = 0;
            const z = Math.random() * n - n2;

            interleavedFloat32Buffer[ i + 0 ] = x;
            interleavedFloat32Buffer[ i + 1 ] = y;
            interleavedFloat32Buffer[ i + 2 ] = z;

            // color (last 4 bytes)

            const vx = ( x / n ) + 0.5;
            const vy = ( y / n ) + 0.5;
            const vz = ( z / n ) + 0.5;

            color.setRGB( vx, vy, vz );

            const j = ( i + 3 ) * 4;

            interleavedUint8Buffer[ j + 0 ] = color.r * 255;
            interleavedUint8Buffer[ j + 1 ] = color.g * 255;
            interleavedUint8Buffer[ j + 2 ] = color.b * 255;
            interleavedUint8Buffer[ j + 3 ] = 0; // not needed

        }

        const interleavedBuffer32 = new THREE.InterleavedBuffer( interleavedFloat32Buffer, 4 );
        const interleavedBuffer8 = new THREE.InterleavedBuffer( interleavedUint8Buffer, 16 );

        geometry.setAttribute( 'position', new THREE.InterleavedBufferAttribute( interleavedBuffer32, 3, 0, false ) );
        geometry.setAttribute( 'color', new THREE.InterleavedBufferAttribute( interleavedBuffer8, 3, 12, true ) );
        const material = new THREE.PointsMaterial( { size: 1, vertexColors: true } );

        this.points = new THREE.Points( geometry, material );
        this.add( this.points );
    }  

    animateStars (timeStamp) {
        this.points.x = timeStamp / 10000;
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
        // this.animateStars(timeStamp);
    }
}

export default MainScene;