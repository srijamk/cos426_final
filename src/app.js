/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import * as THREE from 'three';
import { WebGLRenderer, PerspectiveCamera, OrthographicCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, MainScene, StartScene, DifficultyScene } from 'scenes';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from './fonts';
import { SelectSound, SwitchSound, ShootSound } from './assets';
import { LifeHeart } from './assets';


// <<<<<<< test
// =======

// Initialize core ThreeJS components
// const scene = new SeedScene();
//const scene = new MainScene();
let camera = new PerspectiveCamera();
let frozen = false;
//camera.position.set(0, 50, 0);
camera.position.set(0, 300, 400);
camera.up.set(0, 0, -10);
camera.lookAt(0, 0, 0);

// initialize start scene
let scene = new StartScene(camera.rotation);
let sceneNumber = 0;
let level = 0; // defaults to Easy

// Set up Top-down camera
// >>>>>>> main
const aspect = window.innerWidth / window.innerHeight;
const cameraWidth = 1000;
const cameraHeight = cameraWidth / aspect;
// <<<<<<< test
// // const camera = new THREE.OrthographicCamera(
// //     cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 150
// // );
// // camera.position.set(0, 50, 0);
// // camera.up.set(0, 0, -1);
// // camera.lookAt(0, 0, 0);

const bounds = {width: cameraWidth, height: cameraHeight};

// Set up renderer, canvas, and minor CSS adjustments
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// handle user input

const keyActions = {
    ArrowLeft: { isPressed: false,  keyCode: 37 }, 
    Space: { isPressed: false,  keyCode: 32 }, 
    ArrowRight: { isPressed: false, keyCode: 39 }, 
    ArrowUp: { isPressed: false, keyCode: 38 }, 
    ArrowDown: { isPressed: false, keyCode: 40 }, 
    f: { isPressed: false, keyCode: 70} // press f to shoot
};

// https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
window.addEventListener("keydown", function (event) {

    // if we're on start scene and user presses Space, move to game scene (MainScene)
    if (event.keyCode == 32) {
        if (sceneNumber == 0) {
            var myAudio = new Audio(SelectSound);
            myAudio.play();
            sceneNumber++;
            scene = new DifficultyScene(new THREE.Euler().copy(camera.rotation));
        } else if (sceneNumber == 1) {
            // https://mixkit.co/free-sound-effects/click/
            var myAudio = new Audio(SelectSound);
            myAudio.play();
            sceneNumber++;
            camera = new THREE.OrthographicCamera(
                cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 1000
            );
            camera.position.set(0, 50, 0);
            camera.up.set(0, 0, -1);
            camera.lookAt(0, 0, 0);
            scene = new MainScene(bounds, camera, level);
        } else if (!frozen) {
            // if user presses Space while playing game, freeze and display a pause screen
            frozen = true;
            scene.freeze();
            const geometry = new THREE.PlaneGeometry( window.outerWidth * 10, window.outerHeight * 10 );
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3} );
            const plane = new THREE.Mesh( geometry, material );
            plane.position.copy(camera.position);
            plane.rotation.copy(camera.rotation);
            plane.translateZ(-10);
            plane.renderOrder = 3;
    
            const loader = new FontLoader();
            
            // Display a "Game Paused message"
            loader.load( CyberskyFont, function ( font ) {
            
                const geometry = new TextGeometry( 'Game paused', {
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
                txt.position.copy(camera.position);
                txt.rotation.copy(camera.rotation);
                txt.translateZ(-10);
                txt.renderOrder = 1;
    
                scene.add(txt);
            } );

            // Display a "Press Space to resume" message.
            loader.load( CyberskyFont, function ( font ) {
        
                const geometry = new TextGeometry( 'Press Space to resume.', {
                    font: font,
                    size: 40,
                    height: 1,
                    curveSegments: 13,
                    bevelEnabled: false,
                } );
                geometry.center();
    
                var material = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                  });
                  
                  var txt = new THREE.Mesh(geometry, material);
                  txt.position.copy(camera.position);
                  txt.rotation.copy(camera.rotation);
                  txt.translateZ(-10);
                  txt.translateY(-50);
                  txt.renderOrder = 2;

                  scene.add(txt);
            } );
    
            scene.add(plane);
            // scene.unfreeze();
        } else if (frozen) {
            frozen = false;
            // remove the pause elements from screen
            scene.remove(scene.children[scene.children.length - 1]);
            scene.remove(scene.children[scene.children.length - 1]);
            scene.remove(scene.children[scene.children.length - 1]);
            scene.unfreeze();
        }

        renderer.render(scene, camera);

    } else if (sceneNumber == 1) { 
        
        if (event.keyCode == 37) {
            var myAudio = new Audio(SwitchSound);
            myAudio.play();
            scene.children[scene.children.length - 1 - (2 - level)].material.color.setHex(0x000000);
            level--;
            if (level == -1) level = 2;
            scene.children[scene.children.length - 1 - (2 - level)].material.color.setHex(0xffffff);
        } else if (event.keyCode == 39) {
            var myAudio = new Audio(SwitchSound);
            myAudio.play();
            scene.children[scene.children.length - 1 - (2 - level)].material.color.setHex(0x000000);
            level++;
            if (level == 3) level = 0;
            scene.children[scene.children.length - 1 - (2 - level)].material.color.setHex(0xffffff);
        }
    }
    if (event.defaultPrevented) return; 

    if (!keyActions.hasOwnProperty(event.key)) return;

    keyActions[event.key].isPressed = true;

    event.preventDefault();
  }, true);

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) return; 

    if (!keyActions.hasOwnProperty(event.key)) return;

    keyActions[event.key].isPressed = false;

    event.preventDefault();
  }, true)

// Render loop
const onAnimationFrameHandler = (timeStamp) => {

    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    if (frozen) return;

    // handle player events
    scene.resetPlayerStatus();
    if (keyActions['ArrowLeft'].isPressed) {
        scene.updatePlayerLocation(-1);
    }

    if (keyActions['ArrowRight'].isPressed) {
        scene.updatePlayerLocation(1);
    }
// <<<<<<< test

    if (keyActions['f'].isPressed) {
        scene.updatePlayerShoot(timeStamp);
    }


//     renderer.render(scene, camera);
//     scene.update && scene.update(timeStamp);
//     window.requestAnimationFrame(onAnimationFrameHandler);
// =======
// >>>>>>> main
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;

    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
