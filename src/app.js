/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import * as THREE from 'three';
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, MainScene } from 'scenes';


const aspect = window.innerWidth / window.innerHeight;
const cameraWidth = 1000;
const cameraHeight = cameraWidth / aspect;
const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 150
);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, -1);
camera.lookAt(0, 0, 0);

const bounds = {width: cameraWidth, height: cameraHeight};

const scene = new MainScene(bounds);

// Set up renderer, canvas, and minor CSS adjustments
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// handle user input

const keyActions = {
    ArrowLeft: { isPressed: false,  keyCode: 37 }, 
    ArrowRight: { isPressed: false, keyCode: 39 }, 
    ArrowUp: { isPressed: false, keyCode: 38 }, 
    ArrowDown: { isPressed: false, keyCode: 40 }, 
    f: { isPressed: false, keyCode: 70} // press f to shoot
};

// https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
window.addEventListener("keydown", function (event) {
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

    if (keyActions['f'].isPressed) {
        scene.updatePlayerShoot();
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
