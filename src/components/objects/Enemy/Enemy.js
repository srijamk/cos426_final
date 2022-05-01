import * as THREE from 'three';
import ENEMY from '../../textures/main_shooter_1.png';


class Enemy extends THREE.Group {

    constructor (status) {
        super();

        let {scale, pos} = status;

        this.initEnemy(50);

        this.position.set(pos.x, pos.y, pos.z);
    }

    initEnemy (scale) {
        let texture = new THREE.TextureLoader().load(ENEMY);
        let material = new THREE.SpriteMaterial ( {map:texture} );
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, 1);
        this.add(sprite);
    }

    update () {
        
    }

}

export default Enemy;