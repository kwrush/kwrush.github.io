import * as THREE from 'three';
import { colors, names } from '../constants';

export default class Glasses {
    constructor () {
        this.mesh = new THREE.Object3D();
        this.name = names.glasses;

        const bezelGeom = new THREE.TorusBufferGeometry(16, 2, 16, 4);
        const bezelMat = new THREE.MeshPhongMaterial({
            color: colors.glasses,
            flatShading: true
        });

        const bezelLeft = new THREE.Mesh(bezelGeom, bezelMat);
        bezelLeft.rotation.z = Math.PI / 4;
        const bezelRight = bezelLeft.clone();

        bezelLeft.position.x = 18;
        bezelRight.position.x = -18;

        this.mesh.add(bezelLeft);
        this.mesh.add(bezelRight);

        const clipGeom = new THREE.TorusBufferGeometry(10, 1.2, 16, 4, Math.PI / 2);
        const glassesClip = new THREE.Mesh(clipGeom, bezelMat);
        glassesClip.rotation.z = Math.PI / 4;

        this.mesh.add(glassesClip);

        const legGeom = new THREE.BoxBufferGeometry(3, 3, 40);
        const legMat = new THREE.MeshPhongMaterial({
            color: colors.glasses
        });

        const legLeft = new THREE.Mesh(legGeom, legMat);
        const legRight = legLeft.clone();

        legLeft.position.set(32, 10, -19);
        legRight.position.set(-32, 10, -19);

        this.mesh.add(legLeft);
        this.mesh.add(legRight);

        this.mesh.traverse(obj   => {
            if (obj instanceof THREE.Mesh) {
                obj.castShadow    = true;
                obj.receiveShadow = true;
            }
        }); 

        const lensGeom = new THREE.PlaneBufferGeometry(24, 24, 1, 1);
        const lensMat = new THREE.MeshPhongMaterial({
            transparent: true,
            color: colors.eye,
            opacity: 0.2,
        });

        const lensLeft = new THREE.Mesh(lensGeom, lensMat);
        const lensRight = lensLeft.clone();

        lensLeft.position.x = 18;
        lensRight.position.x = -18;

        this.mesh.add(lensLeft);
        this.mesh.add(lensRight);
    }
}