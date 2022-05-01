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
import { SeedScene, MainScene, StartScene } from 'scenes';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { StartFont, SpaceMissionFont, CyberskyFont } from './fonts';


function handleKey() {

}

// Initialize core ThreeJS components
// const scene = new SeedScene();
//const scene = new MainScene();
let scene = new StartScene();
let sceneNumber = 0;
let camera = new PerspectiveCamera();
let frozen = false;
//camera.position.set(0, 50, 0);
camera.position.set(0, 300, 400);
camera.up.set(0, 0, -10);
camera.lookAt(0, 0, 0);

// Set up Top-down camera
const aspect = window.innerWidth / window.innerHeight;
// const fov = 45;
// const near = 0.1;
// const far = 100;

// const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
// camera.position.set(0, 20, 0);
// camera.up.set(0, 0, -1);
// camera.lookAt(0, 0, 0);

const cameraWidth = 25;
const cameraHeight = cameraWidth / aspect;

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
    ArrowLeft: { isPressed: false}, 
    ArrowRight: { isPressed: false}
};

// https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
window.addEventListener("keydown", function (event) {

    // if we're on start scene and user presses Space, move to game scene (MainScene)
    if (event.keyCode == 32) {
        if (sceneNumber == 0) {
            sceneNumber++;
            scene = new MainScene();
            camera = new THREE.OrthographicCamera(
                cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 1000
            );
            camera.position.set(0, 50, 0);
            camera.up.set(0, 0, -1);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            scene.update && scene.update(timeStamp);
            window.requestAnimationFrame(onAnimationFrameHandler);
        } else if (!frozen) {
            // if user presses Space while playing game, freeze and display a pause screen
            frozen = true;
            scene.freeze();
            const geometry = new THREE.PlaneGeometry( window.outerWidth, window.outerHeight );
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3} );
            const plane = new THREE.Mesh( geometry, material );
            plane.rotation.x = 90;
    
            const loader = new FontLoader();
            
            // Display a "Game Paused message"
            loader.load( CyberskyFont, function ( font ) {
            
                const geometry = new TextGeometry( 'Game paused', {
                    font: font,
                    size: 2,
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
                txt.translateY(2);
                txt.renderOrder = 1;
    
                scene.add(txt);
            } );

            // Display a "Press Space to resume" message.
            loader.load( CyberskyFont, function ( font ) {
        
                const geometry = new TextGeometry( 'Press Space to resume.', {
                    font: font,
                    size: 0.5,
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
                  txt.translateY(1);
                  txt.renderOrder = 2;

                  scene.add(txt);
            } );
    
            scene.add(plane);
            renderer.render(scene, camera);
            scene.unfreeze();
        } else if (frozen) {
            frozen = false;
            // remove the pause elements from screen
            scene.remove(scene.children[scene.children.length - 1]);
            scene.remove(scene.children[scene.children.length - 1]);
            scene.remove(scene.children[scene.children.length - 1]);
            renderer.render(scene, camera);
            scene.unfreeze();
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

    // handle player events
    scene.resetPlayerStatus();
    if (keyActions['ArrowLeft'].isPressed) {
        scene.updatePlayerLocation(-1);
    }

    if (keyActions['ArrowRight'].isPressed) {
        scene.updatePlayerLocation(1);
    }


    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
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
