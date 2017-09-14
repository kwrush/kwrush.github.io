import * as THREE from 'three';
import { colors } from '../constants';

export default class Avatar {
    constructor () {
        this.mesh = new THREE.Object3D();
        this.mesh.name = 'avatar';
        //this.mesh.position.set(0, 60, 0);
        this._createFace();
        this._createEyes();
        this._createIris();
        this._createNose();
        this._createMouth();
    }

    _createFace = () => {
        const faceGeom = new THREE.BoxGeometry(60, 55, 50);
        const faceMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });
        const face = new THREE.Mesh(faceGeom, faceMat);
        face.receiveShadow = true;
        this.mesh.add(face);
    }

    _createEyes = () => {
        const eyeGeom = new THREE.BoxGeometry(20, 20, 1);
        const eyeMat = new THREE.MeshPhongMaterial({
            color: colors.eye,
            flatShading: THREE.FlatShading
        });

        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(20, 12, 27);

        const rightEye = leftEye.clone();
        rightEye.position.set(-20, 12, 27);
        
        this.mesh.add(leftEye);
        this.mesh.add(rightEye);
    }

    _createIris = () => {
        const irisGeom = new THREE.BoxGeometry(5, 5, 1);
        const irisMat = new THREE.MeshPhongMaterial({
            color: colors.iris,
            flatShading: THREE.FlatShading
        });

        const leftIris = new THREE.Mesh(irisGeom, irisMat);
        leftIris.position.set(17, 13, 28);

        const rightIris = leftIris.clone();
        rightIris.position.set(-17, 13, 28);
        
        this.mesh.add(leftIris);
        this.mesh.add(rightIris);
    }

    _createNose = () => {
        const noseGeom = new THREE.CylinderGeometry(1, 8, 16, 3, 1, false);
        const noseMat = new THREE.MeshPhongMaterial({
            color: colors.nose,
            flatShading: THREE.FlatShading
        });

        const nose = new THREE.Mesh(noseGeom, noseMat);
        nose.position.set(0, 5, 28);
        nose.castShadow = true;
        this.mesh.add(nose);
    } 
    
    _createMouth = () => {
        const mouthGeom = new THREE.PlaneGeometry(6, 4, 1, 1);
        const mouthMat = new THREE.MeshLambertMaterial({
            color: colors.lip
        });

        const mouth = new THREE.Mesh(mouthGeom, mouthMat);
        mouth.position.set(0, -20, 27);
        this.mesh.add(mouth);
    }

    lookAt = (target) => {
        const minRad = Math.PI / 6;
        if (target.x > minRad) {
            target.x = minRad;
        } else if (target.x < -minRad) {
            target.x = -minRad;
        }

        if (target.y > minRad) {
            target.y = minRad;
        } else if (target.y < -minRad) {
            target.y = -minRad;
        }

        this.mesh.rotation.x -= (target.y + this.mesh.rotation.x) * 0.1;
        this.mesh.rotation.y += (target.x - this.mesh.rotation.y) * 0.1;
    }
}