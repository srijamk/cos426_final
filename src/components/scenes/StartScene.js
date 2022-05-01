import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from '../../fonts';

class StartScene extends THREE.Scene {
    constructor(rotation) {
        super();

        var curScene = this;
        this.background = new THREE.Color(0x7ec0ee);
        this.rotn = rotation;
        this.rotn += 0.1;


        // font from https://www.fontspace.com/category/space
        const loader = new FontLoader();

        // load TextGeometry with title of game
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Defender', {
                font: font,
                size: 80,
                height: 3,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });
              
            var txt = new THREE.Mesh(geometry, material);
            txt.rotation.copy(curScene.rotn);
            txt.translateZ(-50);
            txt.translateY(2);
            txt.renderOrder = 1;

            curScene.add(txt);
        } );

        // load TextGeometry with instructions
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Instructions. Press Space to start.', {
                font: font,
                size: 20,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });
              
            var txt = new THREE.Mesh(geometry, material);
            txt.rotation.copy(curScene.rotn);
            txt.translateZ(-10);
            txt.translateY(-40);
            txt.renderOrder = 1;

            curScene.add(txt);
        } );

    }

    resetEverything () {
    }

    resetPlayerStatus () {
    }

    buildWalls () {

    }

    updatePlayerLocation (isRight) {
    }

    update (timeStamp) {
    }
}

export default StartScene;