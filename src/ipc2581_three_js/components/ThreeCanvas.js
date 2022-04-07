import { useEffect, useRef } from 'react';
import * as THREE from "three";

function points2vector(points) {
    let pointsgeometry;
    let arr = [];
    for (const point of points) {
        arr.push(new THREE.Vector3(point[0], point[1], 0));
    };
    pointsgeometry = new THREE.BufferGeometry().setFromPoints(arr);
    return pointsgeometry;
};


const ThreeJsCanvas = () => {
    const MountRef = useRef(null); 

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
       // const lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });

        const samplePoints = [[[-10, 10], [5, 10], [15, 25], [30, 50]], 
                                [[-30, 10], [25, 10], [35, 25], [10, 50]],
                                [[-20, 20], [100, 50], [55, 65], [20, 10]]];

        

        for (const points of samplePoints) {
            let pointsgeometry = points2vector(points);        
            let lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });
            let sampleline = new THREE.Line(pointsgeometry, lineMaterial);
            scene.add(sampleline);
        };


        renderer.render(scene, camera);


    }, []);

    return (
        <div ref={MountRef}></div>
    )
};

export default ThreeJsCanvas;

