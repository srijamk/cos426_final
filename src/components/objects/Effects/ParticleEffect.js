import * as THREE from 'three'

/**
 * status = {
 *  parentPosition: Vec3, // includes parent position
 *  parentVelocity, 
 *  moveDirection, 
 *  number of particles
 * }
 */

class ParticleEffect {
    constructor (status) {
        this.position = status.parentPosition;
    }

    createParticles () {

    }
}

export default ParticleEffect;
 