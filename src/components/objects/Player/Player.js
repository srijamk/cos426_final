import * as THREE from 'three';
import { Vector3 } from 'three';
// <<<<<<< test
import PLAYER from '../../textures/main_shooter.png';
// =======
// import { MainShooter, MainShooter1, Shooter } from '../../../assets';
// >>>>>>> main

class Player extends THREE.Group {

    // playerStatus: color, health
    constructor (playerStatus, camera) {
        super();

        let { radius, playerPos, boundary } = playerStatus;
        
        // draw a triangle
// <<<<<<< test
        this.initPlayer(playerStatus.scale);
// =======
//         const map = new THREE.TextureLoader().load( MainShooter1 );
//         const material = new THREE.SpriteMaterial( { map: map, transparent: true } );

//         const sprite = new THREE.Sprite( material );
//         const player = sprite;
//         player.material.depthTest = false;
//         //const player = this.makeTriangle();
//         console.log(player.position);
// >>>>>>> main

        this.radius = radius;
        this.position.set(playerPos.x, playerPos.y, playerPos.z);
        this.speed = 8;
        this.camera = camera;
        this.currentState = 0; // -1 is right, +1 is left, 0 is stop
        this.max_health = 8;
        this.health = 8;

        this.velocity = new Vector3();
        this.netForces = new Vector3();

        this.boundary = boundary;

        this.frozen = false;
    }

    initPlayer (scale) {
        let texture = new THREE.TextureLoader().load(PLAYER);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, 1);
        this.add(sprite);
    }

    removeOneHealth() {
        this.health--;
    }

    handLeftRightMovement() {
        if (this.velocity.x !== 0) this.velocity.x = 0;

        let f = new Vector3(this.speed * this.currentState, 0, 0);
        this.netForces.add(f);
        
        this.currentState = 0;
    }

    handleWallCollision() {
        if (this.position.x - this.radius < this.boundary.left) {
            this.position.x = this.boundary.left;
        }
        
        if (this.position.x + this.radius > this.boundary.right)
            this.position.x = this.boundary.right;
    }

    updateVelocity () {
        this.velocity.add(this.netForces);
    }

    updatePosition() {
        this.position.add(this.velocity);
    }

    freeze () {
        this.frozen = true;
    }

    unfreeze () {
        this.frozen = false;
    }

    update() {
        if (this.frozen) return;
        // reset
        this.netForces = new Vector3();
        this.handLeftRightMovement();
        this.updateVelocity();
        this.updatePosition();

        this.handleWallCollision();

    }
}

export default Player;