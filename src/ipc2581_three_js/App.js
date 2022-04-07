import { useEffect, useRef } from 'react';
import * as THREE from "three";
//import Stats from './js/stats.module';

let theta = 0;

const App = () => {
    const MountRef = useRef(null);

    useEffect(() => {

        let container, scene, camera, renderer, parentTransform;
        const pointer = new THREE.Vector2();
        const radius = 100;
        

        init();
        animate();

/**
 * define functions below
 */
        function init() {
            container = document.createElement('div');
            document.body.appendChild(container);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const lineGeometry = new THREE.BufferGeometry();
            const points = [];

            const point = new THREE.Vector3();
            const direction = new THREE.Vector3();

            for (let i = 0; i < 50; i++) {

                direction.x += Math.random() - 0.5;
                direction.y += Math.random() - 0.5;
                direction.z += Math.random() - 0.5;
                direction.normalize().multiplyScalar(10);

                point.add(direction);
                points.push(point.x, point.y, point.z);
            }

            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

            parentTransform = new THREE.Object3D();
            parentTransform.position.x = Math.random() * 40 - 20;
            parentTransform.position.y = Math.random() * 40 - 20;
            parentTransform.position.z = Math.random() * 40 - 20;

            parentTransform.rotation.x = Math.random() * 2 * Math.PI;
            parentTransform.rotation.y = Math.random() * 2 * Math.PI;
            parentTransform.rotation.z = Math.random() * 2 * Math.PI;

            parentTransform.scale.x = Math.random() + 0.5;
            parentTransform.scale.y = Math.random() + 0.5;
            parentTransform.scale.z = Math.random() + 0.5;

            for (let i = 0; i < 50; i++) {
                let object;
                const lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });

                if (Math.random() > 0.5) {
                    object = new THREE.Line(lineGeometry, lineMaterial);
                } else {
                    object = new THREE.LineSegments(lineGeometry, lineMaterial);
                }

                object.position.x = Math.random() * 400 - 200;
                object.position.y = Math.random() * 400 - 200;
                object.position.z = Math.random() * 400 - 200;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.scale.x = Math.random() + 0.5;
                object.scale.y = Math.random() + 0.5;
                object.scale.z = Math.random() + 0.5;

                parentTransform.add(object);

            }

            scene.add(parentTransform);
            // camera.position.z = 5;
        };

        function animate() {
            requestAnimationFrame(animate);
            render();

        };

        function render() {
            theta += 0.1;

            if (1) {
                camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
                camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
                camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
                camera.lookAt(scene.position);
            }
            camera.updateMatrixWorld();

            renderer.render(scene, camera);
        }



    }, []);



    return (
        <div ref={MountRef}></div>
    )
};

export default App;

