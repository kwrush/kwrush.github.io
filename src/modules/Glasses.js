import * as THREE from 'three';
import { colors, names } from '../constants';

export default class Glasses {
    constructor () {
        this.mesh = new THREE.Object3D();
        this.mesh.name = names.glasses;

        const glassGeom = new THREE.TorusGeometry(16, 2, 16, 4);
        const glassMat = new THREE.MeshPhongMaterial({
            color: colors.glasses,
            flatShading: true
        });

        const glassLeft = new THREE.Mesh(glassGeom, glassMat);
        glassLeft.rotation.z = Math.PI / 4;
        const glassRight = glassLeft.clone();

        glassLeft.position.x = 18;
        glassRight.position.x = -18;

        this.mesh.add(glassLeft);
        this.mesh.add(glassRight);

        const clipGeom = new THREE.TorusGeometry(10, 1.2, 16, 4, Math.PI / 2);
        const glassesClip = new THREE.Mesh(clipGeom, glassMat);
        glassesClip.rotation.z = Math.PI / 4;

        this.mesh.add(glassesClip);

        const legGeom = new THREE.BoxGeometry(3, 3, 40);
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
    }
}