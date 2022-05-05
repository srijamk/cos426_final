import * as THREE from "three";
import { Vector3 } from "three";
import { Player } from "objects";
import SHIELD from "../../textures/shield.png";

class Powerups extends THREE.Group {
  constructor(status) {
    super();
    let { power, boundaryWidth, boundaryHeight, playerPos } = status;
    this.power = power;
    this.isAlive = false;
    this.boundaryWidth = boundaryWidth;
    this.boundaryHeight = boundaryHeight;
    let x = this.randomLocation();
    this.shield();
    this.sprite.position.set(x, 0, boundaryHeight.top);
  }
  randomLocation() {
    return Math.floor(
      Math.random() * (this.boundaryWidth.right - this.boundaryWidth.left + 1) +
        this.boundaryWidth.left
    );
  }
  shield() {
    let scale = 20;
    let texture = new THREE.TextureLoader().load(SHIELD);
    let material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(scale, scale, 1);

    material.transparent = true;
    material.opacity = 0.0;
  }
  drop() {
    this.isAlive = true;
    this.sprite.material.opacity = 1.0;
    let x = this.randomLocation();
    this.sprite.position.set(x, 0, this.boundaryHeight.top);
  }

  distance(pos1, pos2) {
    return ((pos1.x - pos2.x) ** 2 + (pos1.z - pos2.z) ** 2) ** 0.5;
  }

  handlePlayerCollisions(player) {
    let dist = this.distance(this.sprite.position, player.position);
    if (dist < 25 && this.isAlive) {
      this.IsAlive = false;
      this.sprite.material.opacity = 0.0;
      player.enableShield();
      // player.hasShield = true;
      return true;
    }
  }

  update(player) {
    if (!this.isAlive) return;
    if (this.sprite.position.z > this.boundaryHeight.bottom) {
      this.IsAlive = false;
      this.sprite.material.opacity = 0.0;
    }
    let caught = this.handlePlayerCollisions(player);
    if (caught !== undefined) return caught;
    this.sprite.position.z += 4;
  }
}

export default Powerups;
