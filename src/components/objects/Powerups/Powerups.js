import * as THREE from "three";
import { Vector3 } from "three";
import { Player } from "objects";
import SHEILD from "../../textures/shield.png";

class Powerups extends THREE.Group {
  constructor(status) {
    super();
    let { power, boundaryWidth, boundaryHeight } = status;
    this.power = power;
    this.isAlive = false;
    this.boundaryWidth = boundaryWidth;
    this.boundaryHeight = boundaryHeight;
    let x = this.randomLocation();
    this.position.set(x, 0, boundaryHeight.top);
  }
  randomLocation() {
    return Math.floor(
      Math.random() * (this.boundaryWidth.right - this.boundaryWidth.left + 1) +
        this.boundaryWidth.left
    );
  }
  sheild() {
    let scale = 30;
    let texture = new THREE.TextureLoader().load(SHEILD);
    let material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(scale, scale, 1);
    this.add(this.sprite);
  }
  drop() {
    console.log("hello");
  }
  update() {}
}

export default Powerups;
