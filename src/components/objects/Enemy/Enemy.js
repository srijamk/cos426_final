import * as THREE from 'three';
import { Vector3 } from 'three';
import { Bullets } from 'objects';
import ENEMY from '../../textures/main_shooter_1.png';
import EXPLODE1 from "../../textures/Circle_explosion/Circle_explosion1.png";
import EXPLODE2 from "../../textures/Circle_explosion/Circle_explosion2.png";
import EXPLODE3 from "../../textures/Circle_explosion/Circle_explosion3.png";
import EXPLODE4 from "../../textures/Circle_explosion/Circle_explosion4.png";
import EXPLODE5 from "../../textures/Circle_explosion/Circle_explosion5.png";
import EXPLODE6 from "../../textures/Circle_explosion/Circle_explosion6.png";
import EXPLODE7 from "../../textures/Circle_explosion/Circle_explosion7.png";
import EXPLODE8 from "../../textures/Circle_explosion/Circle_explosion8.png";
import EXPLODE9 from "../../textures/Circle_explosion/Circle_explosion9.png";
import EXPLODE10 from "../../textures/Circle_explosion/Circle_explosion10.png";
import { MainShooter1 } from '../../textures';
// import EXPLODE from "../../textures/explode.mp4";
import { Explode } from "../../textures";
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
        this.exploding = false;
        this.explodingStartTime = undefined;

        this.velocity = new Vector3();
        this.netForces = new Vector3();
        let texture = new THREE.TextureLoader().load(ENEMY);
        texture.center.set(0.5, 0.5);
        texture.repeat.set(1, -1);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        this.sprite = new THREE.Sprite(material);

// <<<<<<< test
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
// =======
//         this.position.set(pos.x, pos.y, pos.z);

//         this.radius = radius;

//         this.clock = new THREE.Clock();
        
        this.isAlive = true;
        
//         this.prevDirTime = this.clock.startTime;
//         this.initialDir = new THREE.Vector3(Math.random() * 3 - 1, 0, Math.random() * 3 - 1).normalize();
// >>>>>>> main
    }

    initEnemy (scale) {
        let texture = new THREE.TextureLoader().load(ENEMY);
        texture.center.set(0.5, 0.5);
        texture.repeat.set(1, -1);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        this.sprite = new THREE.Sprite(material);
        this.sprite.scale.set(scale, scale, 1);
        this.sprite.material.needsUpdate = true;
        this.sprite.material.map.needsUpdate = true;
        this.sprite.name = "Textmapupdate";
        this.add(this.sprite);
        this.bullets = new Array(10);
    }

    explodeWork = (curTime) => {
        if (!this.explodingStartTime) {
            this.explodingStartTime = curTime;
        }
        let explodeAnimations = [EXPLODE1, EXPLODE2, EXPLODE3, EXPLODE4, EXPLODE5, EXPLODE6, EXPLODE7, EXPLODE8, EXPLODE9, EXPLODE10] 
        let elapsedTime = curTime - this.explodingStartTime;
        if (elapsedTime >= 300) {
            this.exploding = false;
            this.explodingStartTime = undefined;
            this.children[0].material.opacity = 0.0;
            return;
        }
        let i = Math.floor(elapsedTime / 30);
        new THREE.TextureLoader().load(
            explodeAnimations[i],
            newTexture => {
                //Update Texture
        this.children[0].material.map.dispose();
        this.children[0].material.map = newTexture;
        this.children[0].material.needsUpdate = true;
        this.children[0].material.map.needsUpdate = true;
            }
            );
    }
    
    explode() {
        //console.log("exploding");
        //window.requestAnimationFrame(this.explodeWork);
        this.exploding = true;
        //return this;
        /*
        let startTime = Math.floor(Date.now() / 1000);
        console.log(startTime);
        //let newTexture = new THREE.TextureLoader().load(MainShooter1);
        let explodeAnimations = [EXPLODE1, EXPLODE2, EXPLODE3, EXPLODE4, EXPLODE5, EXPLODE6, EXPLODE7, EXPLODE8, EXPLODE9, EXPLODE10]
        let curTime = Math.floor(Date.now() / 1000);
        console.log("still outside loop");
        while (curTime < startTime + 10) {
            curTime = Math.floor(Date.now() / 1000);
            let i = Math.floor((curTime - startTime));
            console.log(i);
            new THREE.TextureLoader().load(
                explodeAnimations[i],
                newTexture => {
                    //Update Texture
            this.children[0].material.map.dispose();
            this.children[0].material.map = newTexture;
            this.children[0].material.needsUpdate = true;
            this.children[0].material.map.needsUpdate = true;
                }
                );
        }*/

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
        if (this.exploding) {
            this.explodeWork(timeStamp);
        }
    }

}

export default Enemy;
