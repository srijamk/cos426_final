import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from '../../fonts';

class StartScene extends THREE.Scene {
    constructor() {
        super();

        console.log(window.location.pathname);
        var curScene = this;
       this.background = new THREE.Color(0x7ec0ee);


        // font from https://www.fontspace.com/category/space
        const loader = new FontLoader();

        // load TextGeometry with title of game
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Defender', {
                font: font,
                size: 80,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });
              
            var txt = new THREE.Mesh(geometry, material);

            curScene.add(txt);
        } );

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
            txt.position.z += 50;

            curScene.add(txt);
        } );

        //console.log(curScene);

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