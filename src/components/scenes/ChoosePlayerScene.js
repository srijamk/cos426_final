import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from '../../fonts';
import PLAYER from '../textures/main_shooter.png';
import PLAYER2 from '../textures/main_shooter_2.png';
import PLAYER3 from '../textures/main_shooter_3.png';

class ChoosePlayerScene extends THREE.Scene {
    constructor(rot) {
        super();

        var curScene = this;
        this.background = new THREE.Color(0x000000);
        this.rotn = new THREE.Euler().copy(rot);
        this.rotn.x += 0.1;
        this.level = 0; // defaults to Easy (0)


        const geometry = new THREE.BoxGeometry( 100, 50, 10 );
        var material = new THREE.MeshBasicMaterial({
            color: 0x59007f,
          });
        var easyBox = new THREE.Mesh(geometry, material);
        easyBox.rotation.copy(curScene.rotn);
        easyBox.translateX(-150);
        easyBox.translateZ(100);
        easyBox.translateY(-20);
        let texture = new THREE.TextureLoader().load(PLAYER);
        let spritematerial = new THREE.SpriteMaterial ( {map:texture, color:0xffffff} );
        let sprite1 = new THREE.Sprite(spritematerial);
        sprite1.rotation.copy(curScene.rotn);
        sprite1.translateX(-146);
        sprite1.translateZ(110);
        sprite1.translateY(-20);
        let scale = 40;
        sprite1.scale.set(scale, scale, 1);

        this.add( easyBox );
        this.add(sprite1);

        var mediumBox = new THREE.Mesh(geometry, material);
        mediumBox.rotation.copy(curScene.rotn);
        mediumBox.translateX(0);
        mediumBox.translateZ(100);
        mediumBox.translateY(-20);
        texture = new THREE.TextureLoader().load(PLAYER2);
        spritematerial = new THREE.SpriteMaterial ( {map:texture, color:0x000000} );
        let sprite2 = new THREE.Sprite(spritematerial);
        sprite2.rotation.copy(curScene.rotn);
        sprite2.translateX(0);
        sprite2.translateZ(110);
        sprite2.translateY(-20);
        sprite2.scale.set(scale, scale, 1);

        this.add( mediumBox );
        this.add(sprite2);

        var hardBox = new THREE.Mesh(geometry, material);
        hardBox.rotation.copy(curScene.rotn);
        hardBox.translateX(150);
        hardBox.translateZ(100);
        hardBox.translateY(-20);
        texture = new THREE.TextureLoader().load(PLAYER3);
        spritematerial = new THREE.SpriteMaterial ( {map:texture, color:0x000000} );
        let sprite3 = new THREE.Sprite(spritematerial);
        sprite3.rotation.copy(curScene.rotn);
        sprite3.translateX(150);
        sprite3.translateZ(110);
        sprite3.translateY(-20);
        sprite3.scale.set(scale, scale, 1);

        this.add( hardBox );
        this.add(sprite3);


        // font from https://www.fontspace.com/category/space
        const loader = new FontLoader();

        // load TextGeometry with title of game
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Choose your player.', {
                font: font,
                size: 40,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x59007f,
              });
              
            var txt = new THREE.Mesh(geometry, material);
            txt.translateZ(-50);
            txt.translateY(40);
            txt.rotation.copy(curScene.rotn);
            txt.renderOrder = 1;

            curScene.add(txt);
        } );

        // load toggle instructions
        loader.load( CyberskyFont, function ( font ) {
        
            const geometry = new TextGeometry( 'Toggle through players with your arrow keys.', {
                font: font,
                size: 20,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial({
                color: 0x5e4e5d,
              });
              
            var txt = new THREE.Mesh(geometry, material);
            txt.translateZ(-50);
            txt.rotation.copy(curScene.rotn);
            txt.renderOrder = 1;

            curScene.add(txt);
        } );

        /*
        // load TextGeometry with instructions
        loader.load( CyberskyFont, function ( font ) {
        
            const easyGeometry = new TextGeometry( 'Easy', {
                font: font,
                size: 20,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );

            const mediumGeometry = new TextGeometry( 'Medium', {
                font: font,
                size: 18,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );

            const hardGeometry = new TextGeometry( 'Hard', {
                font: font,
                size: 20,
                height: 1,
                curveSegments: 13,
                bevelEnabled: false,
            } );

            var easyMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
              });
            var mediumMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });

            var hardMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });

            var easyTxt = new THREE.Mesh(easyGeometry, easyMaterial);
            easyTxt.rotation.copy(curScene.rotn);
            easyTxt.translateX(-175);
            easyTxt.translateZ(120);
            easyTxt.translateY(-25);
            easyTxt.renderOrder = 1;
            curScene.add(easyTxt);

            var mediumTxt = new THREE.Mesh(mediumGeometry, mediumMaterial);
            mediumTxt.rotation.copy(curScene.rotn);
            mediumTxt.translateX(-40);
            mediumTxt.translateZ(120);
            mediumTxt.translateY(-25);
            mediumTxt.renderOrder = 1;
            curScene.add(mediumTxt);

            var hardTxt = new THREE.Mesh(hardGeometry, hardMaterial);
            hardTxt.rotation.copy(curScene.rotn);
            hardTxt.translateX(112);
            hardTxt.translateZ(120);
            hardTxt.translateY(-25);
            hardTxt.renderOrder = 1;
            curScene.add(hardTxt);
        } );
*/
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

export default ChoosePlayerScene;