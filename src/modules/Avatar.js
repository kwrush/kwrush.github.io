import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { colors, names } from '../constants';
import { random } from '../utils';

export default class Avatar {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = names.avatar;

    this.isDizzy = false;
    this.isLookingAround = true;

    this._nextAction = null;

    this._createHead();
    this._createNormalEyes();
    this._createDizzyEyes();
    this._createIris();
    this._createNose();
    this._createMouth();
    this._createEars();
    this._createHair();
  }

  /**
   * Perform behavior in order
   */
  act = () => {
    if (this.isDizzy) {
      // postpone actions in queue till not being dizzy
      this._nextAction = this.stopDizzy;
    } else {
      this._nextAction = Math.random() < 0.7 ? this.blink : this.confuse;
    }

    // Execute next behavior
    return this._nextAction()
      .then(() => this.act())
      .catch((e) => {
        console.error(e.message);
      });
  };

  /**
   * Blinking eyes
   */
  blink = () => {
    const tween = new TWEEN.Tween(this.normalEyes.scale);

    return new Promise((resolve) => {
      tween
        .to({ y: 0.01 }, 70)
        .repeat(1)
        .yoyo(true)
        .onUpdate(() => {
          if (this.isDizzy) {
            this.iris.scale.y = 1;
            resolve();
          } else {
            this.iris.scale.y = this.normalEyes.scale.y;
          }
        })
        .onComplete(() => {
          // time interval between two behaviors
          setTimeout(resolve, random(1000, 3000));
        })
        .start();
    }).then(() => tween.stop());
  };

  /**
   * Being confused
   */
  confuse = () => {
    const confuseFace = {
      mouthX: 1,
      mouthY: 1,
      eyeY: 1,
    };

    const tween = new TWEEN.Tween(confuseFace);

    return new Promise((resolve) => {
      tween
        .to(
          {
            mouthX: 2,
            mouthY: 0.3,
            eyeY: 0.35,
          },
          100,
        )
        .repeat(1)
        .delay(random(1000, 3000))
        .yoyo(true)
        .onUpdate(() => {
          if (this.isDizzy) {
            this.normalEyes.scale.y = 1;
            this.iris.scale.y = 1;
            resolve();
          } else {
            this.normalEyes.scale.y = confuseFace.eyeY;
            this.iris.scale.y = confuseFace.eyeY;
            this.mouth.scale.x = confuseFace.mouthX;
            this.mouth.scale.y = confuseFace.mouthY;
          }
        })
        .onComplete(() => {
          setTimeout(resolve, random(2000, 4000));
        })
        .start();
    }).then(() => tween.stop());
  };

  /**
   * Avatar looks at the location of the given target
   */
  lookAt = (target) => {
    // Constrain rotation angle of head within a certain range
    const radian = Math.PI / 6;
    const vector = target.clampScalar(-radian, radian);

    if (!this.oldTargetLookPos) this.oldTargetLookPos = new THREE.Vector3();
    this.newTargetLookPos = vector.clone();

    // Gradually rotate head to the final target
    this.lookPos = this.oldTargetLookPos
      .clone()
      .add(
        this.newTargetLookPos.sub(this.oldTargetLookPos).multiplyScalar(0.15),
      );
    this.mesh.lookAt(this.lookPos);

    this.oldTargetLookPos = this.lookPos;
  };

  /**
   * Check wether or not the avatar is wearing glasses
   */
  isWearingGlasses = () => {
    return !!this.mesh.getObjectByName(names.glasses);
  };

  /**
   * Put on the glasses
   */
  wearGlasses = (glasses) => {
    if (glasses instanceof THREE.Object3D && glasses.name === names.glasses) {
      this.mesh.add(glasses);
      glasses.position.set(0, 5, 32);
    }
  };

  /**
   * Doing calculations for "dizzy" animation
   */
  prepareToBeDizzy = () => {
    // The avatar keeps looking at each circle vertext in order when it's getting dizzy
    if (!this._dizzyCircle) {
      this._dizzyCircle = new THREE.CircleGeometry(35, 100);
      this._dizzyCircle.applyMatrix4(
        new THREE.Matrix4().makeTranslation(0, -50, -100),
      );
      this._dizzyCircle.applyMatrix4(
        new THREE.Matrix4().makeRotationX(Math.PI),
      );
    }

    // index of the vertex, ignore the first vertex that is the circle origin
    this._dizzyFrame = 1;
    this._toggleDizzyFace();
  };

  /**
   * Being dizzy
   */
  dizzy = () => {
    if (this.isDizzy && this._dizzyCircle) {
      // repeat from the first vertex of the circle
      if (this._dizzyFrame > 100) this._dizzyFrame = 1;
      const vector = new THREE.Vector3();
      vector.fromBufferAttribute(
        this._dizzyCircle.getAttribute('position'),
        this._dizzyFrame++,
      );
      this.mesh.lookAt(vector);
    }
  };

  /**
   * Stop being dizzy in 6s
   */
  stopDizzy = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._dizzyCircle = null;
        this._toggleDizzyFace();
        resolve();
      }, 5000);
    });
  };

  /**
   * Switch between dizzy face and normal face
   */
  _toggleDizzyFace = () => {
    this.isDizzy = !this.isDizzy;
    this.dizzyEyes.visible = this.isDizzy;
    this.normalEyes.visible = !this.isDizzy;
    this.iris.visible = !this.isDizzy;

    const mouthScaleX = this.isDizzy ? 0.7 : 1;
    const mouthScaleY = this.isDizzy ? 2 : 1;
    this.mouth.scale.set(mouthScaleX, mouthScaleY, 1);
  };

  /**
   * Inner functions to create avatar
   */
  _createHead = () => {
    const headGeom = new THREE.BoxBufferGeometry(60, 56, 54);
    const headMat = new THREE.MeshPhongMaterial({
      color: colors.skin,
      flatShading: THREE.FlatShading,
    });
    this.head = new THREE.Mesh(headGeom, headMat);
    this.head.receiveShadow = true;
    this.mesh.add(this.head);
  };

  _createNormalEyes = () => {
    const eyeGeom = new THREE.BoxBufferGeometry(20, 20, 1);
    const eyeMat = new THREE.MeshLambertMaterial({
      color: colors.eye,
    });

    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.x = 18;

    const rightEye = leftEye.clone();
    rightEye.position.x = -18;

    this.normalEyes = new THREE.Object3D();
    this.normalEyes.position.set(0, 6, 28);
    this.normalEyes.add(leftEye);
    this.normalEyes.add(rightEye);

    this.mesh.add(this.normalEyes);
  };

  _createDizzyEyes = () => {
    const eyeGeom = new THREE.PlaneBufferGeometry(14, 3, 1, 1);
    const eyeMat = new THREE.MeshLambertMaterial({
      color: colors.iris,
    });

    const leftEye1 = new THREE.Mesh(eyeGeom, eyeMat);
    const leftEye2 = leftEye1.clone();

    const rightEye1 = leftEye1.clone();
    const rightEye2 = leftEye1.clone();

    leftEye1.rotation.z = Math.PI / 4;
    leftEye2.rotation.z = -Math.PI / 4;

    rightEye1.rotation.z = Math.PI / 4;
    rightEye2.rotation.z = -Math.PI / 4;

    const leftEye = new THREE.Object3D();
    const rightEye = leftEye.clone();

    leftEye.add(leftEye1);
    leftEye.add(leftEye2);
    rightEye.add(rightEye1);
    rightEye.add(rightEye2);

    leftEye.position.set(17, 0, 0);
    rightEye.position.set(-17, 0, 0);

    this.dizzyEyes = new THREE.Object3D();
    this.dizzyEyes.position.set(0, 6, 28);
    this.dizzyEyes.add(leftEye);
    this.dizzyEyes.add(rightEye);
    this.dizzyEyes.visible = false;

    this.mesh.add(this.dizzyEyes);
  };

  _createIris = () => {
    const irisGeom = new THREE.BoxBufferGeometry(5, 5, 1);
    const irisMat = new THREE.MeshLambertMaterial({
      color: colors.iris,
    });

    const leftIris = new THREE.Mesh(irisGeom, irisMat);
    leftIris.position.set(15, 0, 0);

    const rightIris = leftIris.clone();
    rightIris.position.set(-15, 0, 0);

    this.iris = new THREE.Object3D();
    this.iris.position.set(0, 6, 30);
    this.iris.add(leftIris);
    this.iris.add(rightIris);

    this.mesh.add(this.iris);
  };

  _createNose = () => {
    const noseGeom = new THREE.BufferGeometry();

    const points = [
      new THREE.Vector3(0, 18, 0),
      new THREE.Vector3(-7, 0, 0),
      new THREE.Vector3(0, 0, 10),

      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(7, 0, 0),
      new THREE.Vector3(0, 18, 0),

      new THREE.Vector3(-7, 0, 0),
      new THREE.Vector3(7, 0, 0),
      new THREE.Vector3(0, 0, 10),

      new THREE.Vector3(0, 18, 0),
      new THREE.Vector3(7, 0, 0),
      new THREE.Vector3(-7, 0, 0),
    ];
    noseGeom.setFromPoints(points);
    noseGeom.computeVertexNormals();

    const noseMat = new THREE.MeshPhongMaterial({
      color: colors.nose,
      flatShading: THREE.FlatShading,
    });

    this.nose = new THREE.Mesh(noseGeom, noseMat);
    this.nose.position.set(0, -8, 26);
    this.nose.castShadow = true;
    this.nose.receiveShadow = true;
    this.mesh.add(this.nose);
  };

  _createMouth = () => {
    const mouthGeom = new THREE.PlaneBufferGeometry(6, 4, 1, 1);
    const mouthMat = new THREE.MeshLambertMaterial({
      color: colors.lip,
    });

    this.mouth = new THREE.Mesh(mouthGeom, mouthMat);
    this.mouth.position.set(0, -20, 28);
    this.mesh.add(this.mouth);
  };

  _createEars = () => {
    const earGeom = new THREE.BoxBufferGeometry(4, 18, 12);
    const earMat = new THREE.MeshPhongMaterial({
      color: colors.skin,
      flatShading: THREE.FlatShading,
    });

    const leftEar = new THREE.Mesh(earGeom, earMat);
    leftEar.position.set(33, 0, 0);
    leftEar.rotation.y = -Math.PI / 6;
    leftEar.castShadow = true;
    leftEar.receiveShadow = true;

    const rightEar = leftEar.clone();
    rightEar.position.set(-33, 0, 0);
    rightEar.rotation.y = Math.PI / 6;
    rightEar.castShadow = true;
    rightEar.receiveShadow = true;

    this.ears = new THREE.Object3D();
    this.ears.add(leftEar);
    this.ears.add(rightEar);
    this.ears.position.set(0, 5, -5);

    this.mesh.add(this.ears);
  };

  _createHair = () => {
    const hairGeom = new THREE.BoxBufferGeometry(16, 18, 15);
    const hairMat = new THREE.MeshLambertMaterial({
      color: colors.hair,
    });
    const hair = new THREE.Mesh(hairGeom, hairMat);
    hair.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 9, 0));

    this.hairs = new THREE.Object3D();
    this.hairTop = new THREE.Object3D();

    // create hair combined by 4*4 box grid
    const startPosX = -24;
    const startPosZ = -22;
    let hairAngle = Math.PI / 2;
    for (let i = 0; i < 16; i++) {
      const h = hair.clone();
      const row = i % 4;
      const col = Math.floor(i / 4);
      h.position.set(startPosX + col * 16, 0, startPosZ + row * 15);
      // Make hair cube in the middle a bit higher
      if (col === 1) {
        hairAngle = Math.PI / 3;
      } else if (col === 2) {
        hairAngle = Math.PI / 2.5;
      } else {
        hairAngle = Math.PI / 2;
      }
      h.scale.y = (1 * Math.cos(row / 3)) / Math.sin(hairAngle);
      this.hairTop.add(h);
    }

    this.hairTop.position.y += 28;
    this.hairs.add(this.hairTop);

    this.hairSide = new THREE.Object3D();

    const skewMatrix = new THREE.Matrix4().set(
      1,
      0,
      0,
      0,
      0,
      1,
      0.2,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    );

    const hairSideGeom = new THREE.BoxBufferGeometry(4, 36, 32);
    const hairSideRight = new THREE.Mesh(
      hairSideGeom.applyMatrix4(skewMatrix),
      hairMat,
    );
    const hairSideLeft = hairSideRight.clone();

    hairSideRight.position.set(-30, 0, 0);
    hairSideLeft.position.set(30, 0, 0);

    this.hairSide.add(hairSideLeft);
    this.hairSide.add(hairSideRight);
    this.hairSide.position.set(0, 18, -10);
    this.hairs.add(this.hairSide);

    const hairBackGeom = new THREE.BoxBufferGeometry(64, 62, 10);
    this.hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    this.hairBack.position.set(0, 15, -25);
    this.hairs.add(this.hairBack);

    this.hairs.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    this.mesh.add(this.hairs);
  };
}
