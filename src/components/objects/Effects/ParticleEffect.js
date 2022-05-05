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
        this.speed = status.speed;

        this.numCurrParticles = status.numParticles;

        this.initParticles(status.pos.x, status.pos.z);
    }

    // https://codepen.io/Xanmia/pen/nqyMgJ
    // blow up at position (x, z)
    initParticles (x, z) {
        const vertices = [];
        const sizes = [];
        const dirs = [];;
        let geometry = new THREE.BufferGeometry();
        for (let i = 0; i < this.numParticles; i++) {
            let vertex = new THREE.Vector3();
            vertex.x = x;
            vertex.y = 0;
            vertex.z = z;
            
            vertices.push(vertex.x);
            vertices.push(vertex.y);
            vertices.push(vertex.z);

            sizes.push(10);

            dirs.push({
                x: (Math.random() * this.speed)-(this.speed/2),
                y: (Math.random() * this.speed)-(this.speed/2),
                z: (Math.random() * this.speed)-(this.speed/2)
            });
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ));

        let material = new THREE.PointsMaterial ({color: 0xffffff});
        this.particles = new THREE.Points(geometry, material);
        this.add(this.particles);
    }

    update () {
        const pCount = this.numParticles;
        while (pCount--) {
            let p = this.particles.geometry.vertices[pCount];
            p.x += dirs[pCount].x;
            p.y += dirs[pCount].y;
            p.z += dirs[pCount].z;
        }
    }
}

export default ParticleEffect;
 