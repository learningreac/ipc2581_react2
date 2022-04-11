import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { OrbitControls } from '../../js/OrbitControls';

const ThreeCanvas = () => {
    const MountRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer, container;

        init();
        animate();

        function init() {
            container = document.createElement('div');

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);


            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(0, 250, 1000);
            scene.add(camera);

            scene.add(new THREE.AmbientLight(0xf0f0f0));
            const light = new THREE.SpotLight(0xffffff, 1.5);
            light.position.set(0, 1500, 200);
            light.angle = Math.PI * 0.2;
            light.castShadow = true;
            light.shadow.camera.near = 200;
            light.shadow.camera.far = 2000;
            light.shadow.bias = - 0.000222;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            scene.add(light);


            const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
            planeGeometry.rotateX(- Math.PI / 2);
            const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.position.y = - 200;
            plane.receiveShadow = true;
            scene.add(plane);

            const helper = new THREE.GridHelper(2000, 100);
            helper.position.y = - 199;
            helper.material.opacity = 0.25;
            helper.material.transparent = true;
            scene.add(helper);


            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            //
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 25, 0);
            controls.update();
            //

            window.addEventListener('resize', onWindowResize);
            onWindowResize();
        };


        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

    }, []);

    return (
        <div ref={MountRef}></div>
    )
};

export default ThreeCanvas;