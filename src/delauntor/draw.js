const draw = (ctx, updated,delaunay,getX,getY,w,h,points) => {
    if (!updated) return;
    updated = false;

    ctx.clearRect(0, 0, w, h);

    let triangles = delaunay.triangles;

    ctx.beginPath();
    for (let i = 0; i < triangles.length; i += 3) {
        const p0 = triangles[i];
        const p1 = triangles[i + 1];
        const p2 = triangles[i + 2];
        ctx.moveTo(getX(p0), getY(p0));
        ctx.lineTo(getX(p1), getY(p1));
        ctx.lineTo(getX(p2), getY(p2));
        ctx.closePath();
    }
    ctx.strokeStyle = 'rgba(0,200,0,1)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    // ctx.fillStyle = 'rgba(255,255,0,0.1)';
    // ctx.fill();

    ctx.beginPath();
    for (const i of delaunay.hull) {
        ctx.lineTo(getX(i), getY(i));
    }
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        ctx.rect(getX(i) - 1.5, getY(i) - 1.5, 3, 3);
    }
    ctx.fill();
};

export default draw;