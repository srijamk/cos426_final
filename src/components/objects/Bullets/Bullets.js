import * as THREE from 'three';
import { Vector3 } from "three";
import { Player } from "objects";
import { BULLET_L1, BULLET_L2 } from "../../textures"
/**
 * status should include:
 *  position
 *  speed
 *  direction
 *  parent
 */

const BULLET_MATERIAL = [BULLET_L1, BULLET_L2]

class Bullets extends THREE.Group {
    constructor (status) {
        super();
        let {initPos, boundary, owner, velocity, level} = status;
        // create mesh
        //var geometry = new THREE.BoxGeometry(8, 3, 3);
        //var material = new THREE.MeshBasicMaterial({ color: 0xf0dc24 });
        
        // let texture = new THREE.TextureLoader().load(BULLET_L1);
        // texture.center.set(0.5, 0.5);
        // //texture.repeat.set(-0.5, 0.5);
        // if (owner === "enemy")
        //     texture.rotation = -Math.PI/2;
        // else texture.rotation = Math.PI/2;
        // let material = new THREE.SpriteMaterial({map:texture});
        // let sprite = new THREE.Sprite(material);
        // sprite.scale.set(50, 50, 1);
        // // this.add(sprite);

        // material.transparent = true;
        // material.opacity = 0.0;
        // // this.particle = new THREE.Mesh(
        // //     geometry, material
        // // )
        // this.particle = sprite;
        this.owner = owner;
        this.level = level;
        
        this.createBulletMaterial(owner, BULLET_MATERIAL[this.level]);
        
        // initialize variables
        this.initPos = initPos.clone();
        this.particle.position.set(initPos.x, initPos.y, initPos.z - 11);
        this.velocity = new Vector3(0, 0, velocity);
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

    handleBulletCollisions(enemies) {
        // check if in radius of enemy:
        for (let i = 0; i < enemies.length; i++) {
            let dist = this.distance(enemies[i].position, this.particle.position);
            if (dist < 25 && enemies[i].isAlive) {
                this.bulletIsAlive = false;
                enemies[i].isAlive = false;
                this.particle.material.opacity = 0.0;
                enemies[i].explode();
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

    createBulletMaterial (owner, image) {
        let texture = new THREE.TextureLoader().load(image);
        texture.center.set(0.5, 0.5);
        //texture.repeat.set(-0.5, 0.5);
        if (owner === "enemy")
            texture.rotation = -Math.PI/2;
        else texture.rotation = Math.PI/2;
        let material = new THREE.SpriteMaterial({map:texture});
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(50, 50, 1);
        // this.add(sprite);

        material.transparent = true;
        material.opacity = 0.0;
        // this.particle = new THREE.Mesh(
        //     geometry, material
        // )
        this.particle = sprite;
    }

    // upgrade bullet
    upgrade() {
        this.createBulletMaterial(this.owner, BULLET_L2);
        this.velocity.multiplyScalar(3);
    }
}

export default Bullets;
