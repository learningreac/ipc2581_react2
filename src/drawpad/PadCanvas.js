import React, { useRef, useEffect } from "react";


const PadCanvas = (props) => {
    const canvasRef = useRef(null);
    const { passes, store, drawfun, handlers } = props;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 1024;
        canvas.height = 800;

        //evnetlisteners are redefined at each render so there is no need to remove listeners 
        canvas.addEventListener('pointerdown', handlers.onDragStart);
        canvas.addEventListener('pointermove', handlers.onDragMove);
        canvas.addEventListener('pointerup', handlers.onDragEnd);

        const render = () => {
            window.requestAnimationFrame(render);
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            passes(ctx, store, drawfun);
        };

        render();
    }, [store, passes, drawfun, handlers]);
    //

    return <canvas ref={canvasRef} />
};

export default PadCanvas;
