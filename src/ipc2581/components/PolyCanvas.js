import React, { useRef, useEffect, useState } from "react";


const PolyCanvas = (props) => {
    const canvasRef = useRef(null);
    const { draw, handlers } = props;
    
    const [scale, setScale] = useState(1.);
    const [canvasdeltaxy, SetDeltaXY] = useState([0, 0]);
    const [pandone, setPandone] = useState(undefined);
    const [mousePt, setMousePt] = useState(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 1024;
        canvas.height = 800;

        // canvas.addEventListener('wheel', handlers.onWheel);
        canvas.onwheel = (event) => {
            event.preventDefault();

            let newscale = scale;
            newscale += event.deltaY * -0.01;

            // Restrict scale
            newscale = Math.min(Math.max(.125, newscale), 4);

            setScale(newscale);
        };

        handlers.updatestate = SetDeltaXY;
        handlers.setdone = setPandone;
        handlers.setMousemovePt = setMousePt;

        canvas.addEventListener('pointerdown', handlers.onDragStart);
        canvas.addEventListener('pointermove', handlers.onDragMove);
        canvas.addEventListener('pointerup', handlers.onDragEnd);

        const render = () => {
            window.requestAnimationFrame(render);
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw(ctx, canvas, scale, canvasdeltaxy[0], canvasdeltaxy[1], pandone, mousePt);
        };

        render();

        return () => {
            canvas.removeEventListener('pointerdown', handlers.onDragStart);
            canvas.removeEventListener('pointermove', handlers.onDragMove);
            canvas.removeEventListener('pointerup', handlers.onDragEnd);
        }
    }, [draw, scale, canvasdeltaxy, pandone, handlers, mousePt]);
    //

    return <canvas ref={canvasRef} />
};

export default PolyCanvas;
