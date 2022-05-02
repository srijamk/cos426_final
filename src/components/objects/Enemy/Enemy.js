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
const CHANGE_DIR_INT = 1.5;

class Enemy extends THREE.Group {

    constructor (status) {
        super();

        let {scale, pos, speed, boundary, radius} = status;

        this.boundary = boundary;

        // init the enemy image
        this.initEnemy(scale);

        this.speed = speed;

        this.velocity = new Vector3();
        this.netForces = new Vector3();

        this.position.set(pos.x, pos.y, pos.z);

        this.radius = radius;

        this.clock = new THREE.Clock();

        this.prevDirTime = this.clock.startTime;
        this.initialDir = new THREE.Vector3(Math.random() * 3 - 1, 0, Math.random() * 3 - 1).normalize();
    }

    initEnemy (scale) {
        let texture = new THREE.TextureLoader().load(ENEMY);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, 1);
        this.add(sprite);
    }

    handleWallCollision() {
        if (this.position.x - this.radius < this.boundary.left) {
            this.position.x = this.boundary.left;
            this.initialDir.set(1, 0, 0);
        }
        else if (this.position.x + this.radius > this.boundary.right) {
            this.position.x = this.boundary.right;
            this.initialDir.set(-1, 0, 0);
        }
        
        if (this.position.z - this.radius < this.boundary.up) {
            this.position.z = this.boundary.up;
            this.initialDir.set(0, 0, 1);
        }
        else if (this.position.z + this.radius > this.boundary.down) {
            this.position.z = this.boundary.down;
            this.initialDir.set(0, 0, -1);
        }
    }

    move (playerPos) {
        let curr = this.clock.elapsedTime;
        if ((curr - this.prevDirTime) > CHANGE_DIR_INT) {
            // 60% random movement; 40% move in the direction of the player
            let prob = Math.random()
            if (prob < 0.6) {
                this.initialDir = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize();
            } else {
                this.initialDir = new THREE.Vector3(playerPos.x - this.position.x, 0, 0).normalize();
            }
            
            this.prevDirTime = curr;
        }
        let dt = this.clock.getDelta();
        this.netForces.copy(this.initialDir).multiplyScalar(dt * this.speed);
        this.position.add(this.netForces);
    }

    update (playerPos) {
        this.move(playerPos);
        this.handleWallCollision();
    }

}

export default Enemy;