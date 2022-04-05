
class drawfun {
   
    Polygon(ctx, points) {
        ctx.beginPath();
        for(const point of points) {
            ctx.lineTo(point[0], point[1]);
        };
        ctx.stroke();
    };

    CoutourPolygon(ctx, points) {
        ctx.beginPath();
        for(const point of points) {
            ctx.lineTo(point[0], point[1]);
        };
        //ctx.fill();
        ctx.stroke();
    };

    PolylineWithDesc(ctx, points, width, lineEnd) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = lineEnd;
        for(const point of points) {
            ctx.lineTo(point[0], point[1]);
        };
        ctx.stroke();
    };

    PolyStepCurve(ctx, center, radius) {
        // center point
        ctx.beginPath();
        ctx.arc(center[0], center[1], 1, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();

        // the circle
        ctx.beginPath();
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        ctx.stroke();
    };

    Circle(ctx, center, radius) {
        ctx.beginPath();
        ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        ctx.stroke();
    };

    // this one need to be fixed: ctx.strokeRect(x,y) means the left upcorner but not the center
    Rectangle(ctx,center, width, height) {
        ctx.beginPath();
        ctx.strokeRect(center[0]-width/2, center[1]-height/2, width, height);
        ctx.stroke();
    };

    VisualClickCircle(ctx, center) {
       // ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(center[0], center[1], 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };

    VisualizeClickAreaRect(ctx, center) {
        ctx.beginPath();
        ctx.lineWidth=5;
        ctx.strokeRect(center[0]-25, center[1]-25, 50, 50); // width =10, height =10
        ctx.stroke();
    }

    SelectedPolyline(ctx, points, width, lineEnd) {
        ctx.beginPath();
        ctx.lineWidth = width + 10;
        ctx.lineCap = lineEnd;
        //ctx.strokeStyle = 'red';  // applied to all canvas...
        for(const point of points) {
            ctx.lineTo(point[0], point[1]);
        };
        ctx.stroke();
    };
};



export default drawfun;

