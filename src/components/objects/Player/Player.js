import * as THREE from 'three';
import { Vector3 } from 'three';
import { MainShooter, MainShooter1, Shooter } from '../../../assets';

class Player extends THREE.Group {

    // playerStatus: color, health
    constructor (playerStatus) {
        super();

        let { radius, playerPos, boundary } = playerStatus;
        
        // draw a triangle
        const map = new THREE.TextureLoader().load( MainShooter1 );
        const material = new THREE.SpriteMaterial( { map: map, transparent: true } );

        const sprite = new THREE.Sprite( material );
        const player = sprite;
        player.material.depthTest = false;
        //const player = this.makeTriangle();
        console.log(player.position);

        this.radius = radius;
        this.position.set(playerPos.x, playerPos.y, playerPos.z);
        this.speed = 0.2;
        this.currentState = 0; // -1 is right, +1 is left, 0 is stop
        this.health = 10;
        this.frozen = false;

        this.velocity = new Vector3();
        this.netForces = new Vector3();

        this.boundary = boundary;
        
        this.add(player);
    }

    makeTriangle () {
        const vertices = [
            0, 10, 0, // top
            5, 0, 10, // right
            -5, 0, 10 // left
        ];

        const faces = [2, 1, 0];
        const geometry = new THREE.PolyhedronGeometry(vertices, faces, this.radius);
        const material = new THREE.MeshNormalMaterial();
        const triangle = new THREE.Mesh(geometry, material);

        return triangle;
    }

    handLeftRightMovement() {
        if (this.frozen) return;
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