class jBBox {
    constructor() {
        this.bminx = Infinity;
        this.bminy = Infinity;
        this.bmaxx = -Infinity;
        this.bmaxy = -Infinity;
    }

    // Method
    expand_pt(x, y) {
        if (isNaN(x)||isNaN(y))
            console.log(x, y);

        this.bminx = Math.min(this.bminx, x);
        this.bmaxx = Math.max(this.bmaxx, x);

        this.bminy = Math.min(this.bminy, y);
        this.bmaxy = Math.max(this.bmaxy, y);
    }

    expand_bbox(bbox) {
        this.bminx = Math.min(this.bminx, bbox.bminx);
        this.bmaxx = Math.max(this.bmaxx, bbox.bmaxx);

        this.bminy = Math.min(this.bminy, bbox.bminy);
        this.bmaxy = Math.max(this.bmaxy, bbox.bmaxy);
    }

    expand_circle(cx, cy, radius) {
        if (isNaN(cx)||isNaN(cy)||isNaN(radius))
            console.log(cx, cy, radius);
        const leftbtm = [cx - radius, cy - radius];
        const righttop = [cx + radius, cy + radius];
        this.expand_pt(leftbtm[0], leftbtm[1]);
        this.expand_pt(righttop[0], righttop[1]);
    }

    width() {
        const width = this.bmaxx - this.bminx;// Math.abs(maxwidth - minwidth);
        return width;
    }

    height() {
        const height = this.bmaxy - this.bminy;// Math.abs(maxHeight - minheight);
        return height;
    }

    center(){
        const ox = (this.bminx + this.bmaxx) / 2;
        const oy = (this.bminy + this.bmaxy) / 2;

        return {ox, oy};
    }
}


// class point
/*
function distance__(x0, y0, x1, y1) {
    const dx = (x1-x0);
    const dy= (y1-y0);
    return Math.sqrt(dx*dx+dy*dy);
}
*/


const pointsbbox = (points) => {
    const ptsbbox = new jBBox();
    points.reduce((dict, pt) => {
        ptsbbox.expand_pt(pt[0], pt[1]);
        return dict;
    }, {});

    return ptsbbox;
}

const circlesbbox = (center, r) => {
    const circlesbbox = new jBBox();
    /*
    const ncicle = circletwopoints.length / 2;
    for (let ci = 0; ci < ncicle; ci) {
        const center = circletwopoints[ci * 2 + 0];
        const ptoncircle = circletwopoints[ci * 2 + 1];

        const r = distance__(center[0], center[1], ptoncircle[0], ptoncircle[1]);

        circlesbbox.expand_circle(center[0], center[1], r);
    }
    */
    circlesbbox.expand_circle(center[0], center[1], r);
    return circlesbbox;
}


const computeBoundingBox = (polylines, counPolygons) => {

    const boudingBox = new jBBox();
    
 
    for (const polyline of polylines) {
        let points = [polyline.PolyBegin, ...polyline.PolyStepSegment];
        boudingBox.expand_bbox(pointsbbox(points));// _computeWithPoints(points);
    };

    for (const counPolygon of counPolygons) {
        if(counPolygon.PolyStepCurve) {
            let points = [counPolygon.PolyBegin, ...counPolygon.PolyStepSegment,
                counPolygon.PolyStepCurve.startPoint, counPolygon.PolyStepCurve.center];
                boudingBox.expand_bbox(pointsbbox(points));
               // let mycircle = points.slice(-2);
               // boudingBox.expand_bbox(circlesbbox(mycircle));
               boudingBox.expand_bbox(circlesbbox(counPolygon.PolyStepCurve.center, counPolygon.PolyStepCurve.radius));
        } else {
            let points = [counPolygon.PolyBegin, ...counPolygon.PolyStepSegment];
            boudingBox.expand_bbox(pointsbbox(points));
        }
       

    };

    console.log('computedbox', boudingBox);
    return boudingBox;

};

export default computeBoundingBox;