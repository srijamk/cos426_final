import * as THREE from 'three';
import { Vector3 } from 'three';
import PLAYER from '../../textures/main_shooter.png';

class Player extends THREE.Group {

    // playerStatus: color, health
    constructor (playerStatus) {
        super();

        let { radius, playerPos, boundary } = playerStatus;
        
        // draw a triangle
        this.initPlayer();

        this.radius = radius;
        this.position.set(playerPos.x, playerPos.y, playerPos.z);
        this.speed = 8;
        this.currentState = 0; // -1 is right, +1 is left, 0 is stop
        this.health = 10;

        this.velocity = new Vector3();
        this.netForces = new Vector3();

        this.boundary = boundary;
    }

    initPlayer () {
        let texture = new THREE.TextureLoader().load(PLAYER);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(30, 30, 1);
        this.add(sprite);
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

    update() {
        // reset
        this.netForces = new Vector3();
        this.handLeftRightMovement();
        this.updateVelocity();
        this.updatePosition();

        this.handleWallCollision();

    }
}

export default Player;