import * as THREE from 'three';
import { Tween, Easing, autoPlay } from 'es6-tween/src/index.lite';
import { colors, names } from '../constants';

export default class Avatar {

    constructor () {
        this.mesh = new THREE.Object3D();
        this.mesh.name = names.avatar;

        this.isDizzy = false;
        this.isLookingAround = false;
        this._isWearingGlasses = false;

        this._behaviorQueue = [];

        this._createHead();
        this._createNormalEyes();
        this._createDizzyEyes();
        this._createIris();
        this._createNose();
        this._createMouth();
        this._createEars();
        this._createHair();
        // auto start tween
        autoPlay(true);
    }

    behave = async () => {
        if (this.isDizzy) {
            this._behaviorQueue[0] = this.stopDizzy;
        } else if (this._behaviorQueue.length < 3) {
            const r = Math.random();
            if (r > 0.5) {
                this._behaviorQueue.push(this.blink);
            } else if (r < 0.4) {
                this._behaviorQueue.push(this.confuse);
            }
        }

        // Execute next behavior
        if (this._behaviorQueue.length > 0) {
            try {
                await this._behaviorQueue[0].call();
            } finally {
                this._behaviorQueue.shift();
            }
        }

        this.behave();
    }

    blink = async () => {
        const tween = new Tween(this.normalEyes.scale)

        return new Promise(resolve => {
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
                    setTimeout(resolve, 2000 + Math.random() * 1000);
                })
                .start();
        }).then(() => tween.stop());
    }

    confuse = async () => {
        let confuseFace = {
            mouthX: 1,
            mouthY: 1,
            eyeY: 1
        };

        const tween = new Tween(confuseFace);

        return new Promise(resolve => {
            tween.to({
                    mouthX: 2,
                    mouthY: 0.3,
                    eyeY: 0.35
                }, 100)
                .repeat(1)
                .delay(2000 + Math.random() * 2000)
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
                    setTimeout(resolve, 1000 + Math.random() * 1000);
                })
                .start();
        }).then(() => tween.stop());
    }

    dizzy = () => {
        if (this.isDizzy && this._dizzyCircle) {
            // repeat from the first vertex
            if (this._dizzyFrame > 100) this._dizzyFrame = 1;
            //console.log(this._dizzyCircle);
            this.mesh.lookAt(this._dizzyCircle.vertices[this._dizzyFrame++]);
        }
    }

    stopDizzy = async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                this.isDizzy = false;
                this._dizzyCircle = null;
                this._toggleDizzyFace(this.isDizzy);
                resolve();
            }, 5000);
        });
    }

    lookAt = (target) => {
        const vector = this._constrainHeadRotation(target);

        if (!this.oldTargetLookPos) this.oldTargetLookPos = new THREE.Vector3();
        this.newTargetLookPos = vector.clone();

        // Gradually rotate head to the final target
        this.lookPos = this.oldTargetLookPos.clone()
            .add(this.newTargetLookPos.sub(this.oldTargetLookPos).multiplyScalar(0.15));
        this.mesh.lookAt(this.lookPos);

        this.oldTargetLookPos = this.lookPos;
    }

    isWearingGlasses = () => {
        return !!this.mesh.getObjectByName(names.glasses);
    }
    
    wearGlasses = (glassesMesh) => {
        if (glassesMesh instanceof THREE.Object3D && glassesMesh.name === names.glasses) {
            this.mesh.add(glassesMesh);
            glassesMesh.position.set(0, 5, 32);
        }
    }

    prepareToBeDizzy = () => {
        // Make a circle of which the avatar will keep looking at each vertex 
        this._dizzyCircle = new THREE.CircleGeometry(35, 100);
        this._dizzyCircle.applyMatrix(new THREE.Matrix4().makeTranslation(0, -50, -100));
        this._dizzyCircle.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));

        // index of the vertex, ignore the first vertex that is the circle origin
        this._dizzyFrame = 1;

        this.isDizzy = true;
        this._toggleDizzyFace(this.isDizzy);
    }
 
    _toggleDizzyFace = (dizzy) => {
        this.dizzyEyes.visible = dizzy;
        this.normalEyes.visible = !dizzy;
        this.iris.visible = !dizzy;

        const mouthScaleX = dizzy ? 0.7 : 1;
        const mouthScaleY = dizzy ? 2 : 1;       
        this.mouth.scale.set(mouthScaleX, mouthScaleY, 1);
    }

    _constrainHeadRotation = (vector) => {
        const minRad = Math.PI / 5;
        if (vector.x > minRad) {
            vector.x = minRad;
        } else if (vector.x < -minRad) {
            vector.x = -minRad;
        }

        if (vector.y > minRad) {
            vector.y = minRad;
        } else if (vector.y < -minRad) {
            vector.y = -minRad;
        } 

        return vector;
    }

    _createHead = () => {
        const headGeom = new THREE.BoxBufferGeometry(60, 56, 54);
        const headMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });
        this.head = new THREE.Mesh(headGeom, headMat);
        this.head.receiveShadow = true;
        this.mesh.add(this.head);
    }

    _createNormalEyes = () => {
        const eyeGeom = new THREE.BoxBufferGeometry(20, 20, 1);
        const eyeMat = new THREE.MeshLambertMaterial({
            color: colors.eye
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
    }

    _createDizzyEyes = () => {
        const eyeGeom = new THREE.PlaneBufferGeometry(14, 3, 1, 1);
        const eyeMat = new THREE.MeshLambertMaterial({
            color: colors.iris
        });

        const leftEye1 = new THREE.Mesh(eyeGeom, eyeMat);
        const leftEye2 = leftEye1.clone();

        const rightEye1 = leftEye1.clone();
        const rightEye2 = leftEye1.clone();

        leftEye1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -7, 0));
        leftEye1.rotation.z = Math.PI / 4;
        leftEye2.rotation.z = -Math.PI / 4;
        
        rightEye1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 7, 0));
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
        this.dizzyEyes.position.set(0, 8, 28);
        this.dizzyEyes.add(leftEye);
        this.dizzyEyes.add(rightEye);
        this.dizzyEyes.visible = false;

        this.mesh.add(this.dizzyEyes);
    }

    _createIris = () => {
        const irisGeom = new THREE.BoxBufferGeometry(5, 5, 1);
        const irisMat = new THREE.MeshLambertMaterial({
            color: colors.iris
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
    }

    _createNose = () => {
        const noseGeom = new THREE.Geometry();
        noseGeom.vertices = [
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(-7, 0, 0),
            new THREE.Vector3(0, 18, 0),
            new THREE.Vector3(7, 0, 0)
        ];
        noseGeom.faces = [
            new THREE.Face3(0, 1, 3),
            new THREE.Face3(2, 1, 0),
            new THREE.Face3(0, 3, 2)
        ];
        const noseMat = new THREE.MeshPhongMaterial({
            color: colors.nose,
            flatShading: THREE.FlatShading
        });

        this.nose = new THREE.Mesh(noseGeom, noseMat);
        this.nose.position.set(0, -8, 26);
        this.nose.castShadow = true;
        this.mesh.add(this.nose);
    } 
    
    _createMouth = () => {
        const mouthGeom = new THREE.PlaneBufferGeometry(6, 4, 1, 1);
        const mouthMat = new THREE.MeshLambertMaterial({
            color: colors.lip
        });

        this.mouth = new THREE.Mesh(mouthGeom, mouthMat);
        this.mouth.position.set(0, -20, 28);
        this.mesh.add(this.mouth);
    }

    _createEars = () => {
        const earGeom = new THREE.BoxBufferGeometry(4, 18, 12);
        const earMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
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
    }
    
    _createHair = () => {
        const hairGeom = new THREE.BoxBufferGeometry(16, 18, 15);
        const hairMat = new THREE.MeshLambertMaterial({
            color: colors.hair
        });
        const hair = new THREE.Mesh(hairGeom, hairMat);
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

        this.hairs = new THREE.Object3D();
        this.hairTop = new THREE.Object3D();

        // create hair combined by 4*4 box grid
        const startPosX = -24;
        const startPosZ = -22;
        let hairAngle = Math.PI / 2;
        for (let i = 0; i < 16; i++) {
            let h = hair.clone();
            let row = i % 4; 
            let col = Math.floor(i / 4);
            h.position.set(startPosX + col * 16, 0, startPosZ + row * 15);
            // Make hair cube in the middle a bit higher
            if (col === 1) {
                hairAngle = Math.PI / 3;
            } else if (col === 2) {
                hairAngle = Math.PI / 2.5;
            } else {
                hairAngle = Math.PI / 2;
            }
            h.scale.y = 1 * Math.cos(row / 3) / Math.sin(hairAngle);
            this.hairTop.add(h);
        }

        this.hairTop.position.y += 28;
        this.hairs.add(this.hairTop);

        this.hairSide = new THREE.Object3D();

        const skewMatrix = new THREE.Matrix4().set(
            1, 0, 0, 0,
            0, 1, 0.2, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        const hairSideGeom = new THREE.BoxBufferGeometry(4, 36, 32);
        const hairSideRight = new THREE.Mesh(hairSideGeom.applyMatrix(skewMatrix), hairMat);
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
    }
}