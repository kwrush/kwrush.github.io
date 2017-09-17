import * as THREE from 'three';
import { TweenMax } from 'gsap';
import { colors } from '../constants';

export default class Avatar {

    constructor () {
        this.mesh = new THREE.Object3D();
        this.mesh.name = 'avatar';
        this.mesh.castShadow = true;
        //this.mesh.position.set(0, 60, 0);

        this._isBlinking = false;
        this._isConfusing = false;
        this._isWearingGlasses = false;
        this._lookAroundInterval = null;
        this.isLookingAround = true;

        this._createHead();
        this._createEyes();
        this._createIris();
        this._createNose();
        this._createMouth();
        this._createEars();
    }

    behave = () => {
        if (!this._isBlinking && Math.random() > 0.95) {
            //this.confuse();
        } else if (!this._isConfusing && Math.random() > 0.95) {
            this.blink();
        }
    }

    blink = () => {
        if (!this._isBlinking) {
            this._isBlinking = true;
            TweenMax.to(this.eyes.scale, 0.07, {y: 0, yoyo: true, repeat: 1, delay: 3});
            TweenMax.to(this.iris.scale, 0.07, {y: 0.01, yoyo: true, repeat: 1, delay: 3, onComplete: () => {
                this._isBlinking = false;
            }});
        }
    }

    confuse = () => {
        if (!this._isConfusing) {
            this._isConfusing = true;
            TweenMax.to(this.eyes.scale, 0.1, {y: 0.2, repeat: 1});
            TweenMax.to(this.iris.scale, 0.1, {y: 0.3, repeat: 1});
            TweenMax.to(this.mouth.scale, 0.1, {x: 1.5, y: 0.5, repeat: 1, onComplete: () => {
                TweenMax.to(this.eyes.scale, 0.1, {y: 1, repeat: 1, delay: 2});
                TweenMax.to(this.iris.scale, 0.1, {y: 1, repeat: 1, delay: 2});
                TweenMax.to(this.mouth.scale, 0.1, {x: 1, y: 1, repeat: 1, delay: 2, onComplete: () => {
                    this._isConfusing = false;
                }});
            }});
        }
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

    _createHead = () => {
        const headGeom = new THREE.BoxGeometry(60, 56, 50);
        const headMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });
        const head = new THREE.Mesh(headGeom, headMat);
        //head.castShadow = true;
        head.receiveShadow = true;
        this.mesh.add(head);
    }

    _createEyes = () => {
        const eyeGeom = new THREE.BoxGeometry(20, 20, 1);
        const eyeMat = new THREE.MeshPhongMaterial({
            color: colors.eye,
            flatShading: THREE.FlatShading
        });

        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(20, 0, 0);

        const rightEye = leftEye.clone();
        rightEye.position.set(-20, 0, 0);

        this.eyes = new THREE.Object3D();
        this.eyes.position.set(0, 12, 27);
        this.eyes.add(leftEye);
        this.eyes.add(rightEye);
        
        this.mesh.add(this.eyes);
    }

    _createIris = () => {
        const irisGeom = new THREE.BoxGeometry(5, 5, 1);
        const irisMat = new THREE.MeshPhongMaterial({
            color: colors.iris,
            flatShading: THREE.FlatShading
        });

        const leftIris = new THREE.Mesh(irisGeom, irisMat);
        leftIris.position.set(17, 0, 0);

        const rightIris = leftIris.clone();
        rightIris.position.set(-17, 0, 0);

        this.iris = new THREE.Object3D();
        this.iris.position.set(0, 12, 28);
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
        this.nose.position.set(0, -4, 25);
        this.nose.castShadow = true;
        this.mesh.add(this.nose);
    } 
    
    _createMouth = () => {
        const mouthGeom = new THREE.PlaneGeometry(6, 4, 1, 1);
        const mouthMat = new THREE.MeshLambertMaterial({
            color: colors.lip
        });

        this.mouth = new THREE.Mesh(mouthGeom, mouthMat);
        this.mouth.position.set(0, -20, 27);
        this.mesh.add(this.mouth);
    }

    _createEars = () => {
        const earGeom = new THREE.BoxGeometry(4, 18, 12);
        const earMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });

        const leftEar = new THREE.Mesh(earGeom, earMat);
        leftEar.position.set(33, 0, 0);
        leftEar.rotation.y = -Math.PI / 10;
        leftEar.castShadow = true;

        const rightEar = leftEar.clone();
        rightEar.position.set(-33, 0, 0);
        rightEar.rotation.y = Math.PI / 10;
        rightEar.castShadow = true;

        this.ears = new THREE.Object3D();
        this.ears.add(leftEar);
        this.ears.add(rightEar);
        this.ears.position.set(0, 5, -5);

        this.mesh.add(this.ears);
    }
    
    _createHair = () => {

    }

    _constrainHeadRotation(vector) {
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
}