import * as THREE from 'three'

/**
 * status = {
 *  type
 *  parentPosition: Vec3, // includes parent position
 *  parentVelocity, 
 *  moveDirection, 
 *  number of particles, 
 *  selfVelocity
 * }
 */

class ParticleEffect {
    constructor (status) {
        this.type = status.type
        this.position = status.parentPosition;
        this.numParticles = status.numParticles;
        this.parentSpeed = status.parentSpeed;
        this.speed = status.speed;
    }

    createParticles () {
        let geometry = new THREE.BufferGeometry();

    }
}

export default ParticleEffect;
 