import React, { useRef, useEffect } from "react";

import Delaunator from 'delaunator';
import './canvas.css';
import draw from "./draw";


const Canvas = props => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const points = props.points;

        let delaunay = Delaunator.from(points);

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < points.length; i++) {
            const x = points[i][0];
            const y = points[i][1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        const padding = 5;
        const w = 1024;
        const h = (w - 2 * padding) * (maxY - minY) / (maxX - minX) + 2 * padding;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        canvas.width = w;
        canvas.height = h;

        if (window.devicePixelRatio >= 2) {
            canvas.width = w * 2;
            canvas.height = h * 2;
            ctx.scale(2, 2);
        }

        let ratio = (w - 2 * padding) / Math.max(maxX - minX, maxY - minY);

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        let updated = true;

        canvas.onmousemove = function (e) {
            points.push([
                (e.layerX - padding) / ratio + minX,
                (e.layerY - padding) / ratio + minY
            ]);

            console.log('x',  (e.layerX - padding) / ratio + minX)
           // console.time('delaunay');
            delaunay = Delaunator.from(points);
            //console.timeEnd('delaunay');
            updated = true;
        }

        function getX(i) {
            return padding + ratio * (points[i][0] - minX);
        }
        function getY(i) {
            return padding + ratio * (points[i][1] - minY);
        }


        const render = () => {
            requestAnimationFrame(render);
            draw(ctx, updated, delaunay, getX, getY,w,h,points);
        }
        render();

    }, [props.points]);



    return <canvas ref={canvasRef} {...props} />
};

export default Canvas;