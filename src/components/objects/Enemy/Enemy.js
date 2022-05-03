import * as THREE from 'three';
import { Vector3 } from 'three';
import ENEMY from '../../textures/main_shooter_1.png';

/**
 * status should have:
 *  1. scale of the sprite
 *  2. health of the enemy
 *  3. position
 *  4. speed
 */

// enemy is going to move in one direction for fixed amount of time
const CHANGE_DIR_INT = 2;

class Enemy extends THREE.Group {

    constructor (status) {
        super();

        this.frozen = false;

        this.boundary = status.boundary;

        // init the enemy image
        this.initEnemy(status.enemy_scale);

        this.speed = status.enemy_speed;
        this.position.set(status.pos.x, status.pos.y, status.pos.z);
        this.radius = 0;
        this.movementStyle = status.enemy_movement;

        this.velocity = new Vector3();
        this.netForces = new Vector3();

        if (this.movementStyle === "random") {
            this.clock = new THREE.Clock();
            this.prevDirTime = this.clock.startTime;
            this.initialDir = new THREE.Vector3(Math.random() * 3 - 1, 0, Math.random() * 3 - 1).normalize();
        } 
        else if (this.movementStyle === "horizontal") {
            const choices = [-1, 1];
            const rand = Math.floor(Math.random() * 2);
            this.initialDir = new THREE.Vector3(choices[rand], 0, 0);
        } else {
            this.initialDir = new THREE.Vector3();
        }
    }

    initEnemy (scale) {
        let texture = new THREE.TextureLoader().load(ENEMY);
        texture.center.set(0.5, 0.5);
        texture.repeat.set(1, -1);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, 1);
        this.add(sprite);
    }

    handleWallCollision() {
        if (this.position.x - this.radius < this.boundary.left) {
            this.position.x = this.boundary.left;
            // this.initialDir.set(1, 0, 0);
            this.hitWall = true;
        }
        else if (this.position.x + this.radius > this.boundary.right) {
            this.position.x = this.boundary.right;
            // this.initialDir.set(-1, 0, 0);
            this.hitWall = true;
        }
        
        if (this.position.z - this.radius < this.boundary.up) {
            this.position.z = this.boundary.up;
            // this.initialDir.set(0, 0, 1);
            this.hitWall = true;
        }
        else if (this.position.z + this.radius > this.boundary.down) {
            this.position.z = this.boundary.down;
            // this.initialDir.set(0, 0, -1);
            this.hitWall = true;
        }
    }

    freeze () {
        this.frozen = true;
    }

    unfreeze () {
        this.frozen = false;
    }

    move (playerPos) {
        if (this.movementStyle === "random") {
            let curr = this.clock.elapsedTime;
            if ((curr - this.prevDirTime) > CHANGE_DIR_INT || this.hitWall) {
                // 60% random movement; 40% move in the direction of the player
                let prob = Math.random()
                if (prob < 0.6) {
                    this.initialDir = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize();
                } else {
                    this.initialDir = new THREE.Vector3(playerPos.x - this.position.x, 0, 0).normalize();
                }
                
                this.prevDirTime = curr;
            }
            let dt = Math.min(this.clock.getDelta(), 0.1);
            this.netForces.copy(this.initialDir).multiplyScalar(dt * this.speed);
            this.position.add(this.netForces);
            this.hitWall = false;
        } else if (this.movementStyle === "horizontal") { 
            if (this.hitWall) {this.initialDir.multiplyScalar(-1);}
            this.netForces.copy(this.initialDir).multiplyScalar(0.01 * this.speed);
            this.position.add(this.netForces);
            this.hitWall = false;
        } 
    }

    // after certain amount of time, the enemy will get upgraded (either speed/bullet shooting speed etc)
    upgrade () {

    }

    update (playerPos, timeStamp) {
        if (this.frozen) return;
        this.move(playerPos);
        this.handleWallCollision();
    }

}

export default Enemy;