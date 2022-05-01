import * as THREE from 'three';
import { Color } from 'three';
import { BasicLights } from 'lights';
import { Player, Wall } from 'objects';
import { Vector3 } from 'three';

class MainScene extends THREE.Scene {
    constructor () {
        super();

        this.status = {
            isPaused: false
        }

        this.background = new Color(0x7ec0ee);

        const lights = new BasicLights();


        let playerStatus = {
            radius: 0.1, 
            playerPos: new THREE.Vector3(0, 0, 0), 
            boundary: {left: -10, right: 10}
        }

        this.player = new Player(playerStatus);

        this.add(lights, this.player);
    }

    resetEverything () {
    }

    freeze() {
        // TODO: freeze all player and enemy activity
        this.status.isPaused = true;
        this.player.frozen = true;
    }

    unfreeze() {
        // TODO: unfreeze all player and enemy activity
        this.status.isPaused = false;
        this.player.frozen = false;
    }

    resetPlayerStatus () {
        this.player.currentState = 0;
    }

    buildWalls () {

    }

    updatePlayerLocation (isRight) {
        if (this.status.isPaused) return;

        this.player.currentState = isRight;
    }

    update (timeStamp) {
        this.player.update();
    }
}

export default MainScene;