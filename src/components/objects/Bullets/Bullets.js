import * as THREE from 'three';
import { Vector3 } from "three";
import { Player } from "objects";
import { FirstExplosion } from "../../textures";
import { MainShooter1 } from "../../../assets";
/**
 * status should include:
 *  position
 *  speed
 *  direction
 *  parent
 */

class Bullets extends THREE.Group {
    constructor (status) {
        super();
        let {initPos, boundary} = status;
        // create mesh
        var geometry = new THREE.BoxGeometry(8, 3, 3);
        var material = new THREE.MeshBasicMaterial({ color: 0xf0dc24 });
        material.transparent = true;
        material.opacity = 0.0;
        this.particle = new THREE.Mesh(
            geometry, material
        )
        
        // initialize variables
        this.initPos = initPos.clone();
        this.particle.position.set(initPos.x, initPos.y, initPos.z - 11);
        this.velocity = new Vector3(0, 0, -8);
        this.bulletIsAlive = false;
        this.boundary = boundary;
        this.isEnemy = false;
    }

    shootBullet(start) {
        this.particle.position.set(start.x, start.y, start.z - 11);
        this.bulletIsAlive = true;
        this.particle.material.opacity = 1.0;
    }
    
    distance(pos1, pos2) {
        return ((pos1.x - pos2.x) ** 2 + (pos1.z - pos2.z) ** 2) ** 0.5;
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
      

    handleBulletCollisions(enemies) {
        // check if in radius of enemy:
        for (let i = 0; i < enemies.length; i++) {
            let dist = this.distance(enemies[i].position, this.particle.position);
            if (dist < 25 && enemies[i].isAlive) {
                this.bulletIsAlive = false;
                enemies[i].isAlive = false;
                enemies[i].explode();
                this.particle.material.opacity = 0.0;
                return enemies[i];
            }
        }
    }

    handlePlayerBulletCollision(player) {
        let dist = this.distance(this.particle.position, player.position);
        if(dist < 25) {
            this.bulletIsAlive = false;
            this.particle.material.opacity = 0.0;
            return true;
        }
    }
    enemyUpdate() {
        // if bullet is out of bounds then make clear
        if(this.bulletIsAlive) {
            if(this.particle.position.z > this.boundary.bottom) {
                this.bulletIsAlive = false;
                this.particle.material.opacity = 0.0;
            }
            // let x = this.handleBulletCollisions(enemies);
            // if (x !== undefined) return x;
            this.particle.position.z += 6;
        }
    }
    playerUpdate(enemies) {
        // if bullet is out of bounds then make clear
        if(this.bulletIsAlive) {
            if(this.particle.position.z > this.initPos.z - 11 && this.particle.position.z > this.initPos.z - 22) {
                // play sound
            }
            if(this.particle.position.z < this.boundary.top) {
                this.bulletIsAlive = false;
                this.particle.material.opacity = 0.0;
            }
            let x = this.handleBulletCollisions(enemies);
            if (x !== undefined) return x;
            this.particle.position.z -= 6;
        }

    }
}

export default Bullets;
