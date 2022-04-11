import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { OrbitControls } from '../../js/OrbitControls';

function points2vector(points) {
    let pointsgeometry;
    let arr = [];
    const scaleratio = 10;
    for (const point of points) {
        arr.push(new THREE.Vector3(point[0] * scaleratio, point[1] * scaleratio, 0));
    };
    pointsgeometry = new THREE.BufferGeometry().setFromPoints(arr);
    return pointsgeometry;
};

/*
SM_TOP: {layerName: 'SM_TOP', polylines: Array(45), contours: Array(0)};

 const entityPoints = [[[-10, 10], [5, 10], [15, 25], [30, 50]],
        [[-30, 10], [25, 10], [35, 25], [10, 50]],
        [[-20, 20], [100, 50], [55, 65], [20, 10]]];

*/

function drawEntitys(scene, entityPoints) {
    for (const points of entityPoints) {
        let pointsgeometry = points2vector(points);
        let lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });
        let sampleline = new THREE.Line(pointsgeometry, lineMaterial);
        scene.add(sampleline);
    };
}


const ThreeJsCanvas = ({ layer }) => {
    const MountRef = useRef(null);
    console.log('layerpasstocanvas', layer);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        // const lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });


        if (layer.polylines) {
            drawEntitys(scene, layer.polylines);
        };
        if (layer.contours) {
            drawEntitys(scene, layer.contours);
        };

        //
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 25, 0);
        controls.update();
        //

        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        animate();


        function onWindowResize() {
            console.log('window resize')

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        function animate() {

            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

       // return scene.clear();

    }, [layer.polylines, layer.contours]);

    return (
        <div ref={MountRef}></div>
    )
};

export default ThreeJsCanvas;

