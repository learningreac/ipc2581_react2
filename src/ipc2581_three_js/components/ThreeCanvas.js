import { useEffect, useRef } from 'react';
import * as THREE from "three";


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

        const samplePoints = [[[-10, 10], [5, 10], [15, 25], [30, 50]], [[-30, 10], [25, 10], [35, 25], [10, 50]]];

        function points2vector(arr, points) {
            console.log('points', points);

            for (const point of points) {
                arr.push(new THREE.Vector3(point[0], point[1], 0));
            };
            return arr;
        };

        for (const points of samplePoints) {
            console.log('points0', points);
            let pointsarr = points2vector([],points);
            console.log('pointsarr',pointsarr);

            let pointsgeometry = new THREE.BufferGeometry().setFromPoints(pointsarr);
            let lineMaterial = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });
            let sampleline = new THREE.Line(pointsgeometry, lineMaterial);
            scene.add(sampleline);
        };

        /*
                const samplepoints = [];
                samplepoints.push( new THREE.Vector3( - 10, 0, 0 ) );
                samplepoints.push( new THREE.Vector3( 0, 10, 0 ) );
                samplepoints.push( new THREE.Vector3( 10, 0, 0 ) );
                samplepoints.push( new THREE.Vector3( 20, 0, 0 ) );
                samplepoints.push( new THREE.Vector3( 15, 15, 0 ) );
        
        
                const samplegeometry = new THREE.BufferGeometry().setFromPoints( samplepoints );
                
                const sampleline = new THREE.Line( samplegeometry,lineMaterial );
                scene.add( sampleline );
        */

        renderer.render(scene, camera);


    }, []);

    return (
        <div ref={MountRef}></div>
    )
};

export default ThreeJsCanvas;

