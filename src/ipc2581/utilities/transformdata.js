export const calcuScaleRatio = (viewWidth, viewHeight, boudingBox) => {
    const ratioWidth = viewWidth / boudingBox.width;
    const ratioHeight = viewHeight / boudingBox.height;   // incase denominator is zero
    const Ratio = Math.min(ratioWidth, ratioHeight) * 0.9;  //  so there will be a margin

    return Ratio;
};

export function transformpoint(viewWidth, viewHeight, bbox, Ratio, px, py) {
    let CaX = viewWidth / 2 + (px - bbox.ox) * Ratio;
    let CaY = viewHeight / 2 - (py - bbox.oy) * Ratio;

    return [CaX, CaY];
};

export function transCanvasPTtoModel(viewWidth, viewHeight, bbox, temRatio, Cax, Cay) {
    let Px = bbox.ox + 1 / temRatio * (Cax - viewWidth / 2)
    let Py = bbox.oy + 1 / temRatio * (viewHeight / 2 - Cay)

    return [Px, Py]
}


// @ input (store.polygon, single polygon object)
// @ output ({linesPoins, center, radius})
const transPolygonData = (initiaData, viewWidth, viewHeight, modelcenterpt, Ratio) => {
    const { PolyBegin, PolyStepSegment, PolyStepCurve } = initiaData;
    let linePoints = [];
    let curveCenter;
    let curveRadius;

    let initPoints = [PolyBegin, ...PolyStepSegment];
    if (PolyStepCurve) {
        initPoints = [...initPoints, PolyStepCurve.startPoint, PolyStepCurve.center];
    };
    for (const point of initPoints) {
        const tpxy = transformpoint(viewWidth, viewHeight, modelcenterpt, Ratio, point[0], point[1]);
        linePoints.push(tpxy);
    };

    if (PolyStepCurve) {
        curveCenter = linePoints.pop(); // pop out the center point of curve;
        curveRadius = PolyStepCurve.radius * Ratio;
    }

    return { linePoints, curveCenter, curveRadius };
};

export const transPolylineData = (initiaData, viewWidth, viewHeight, modelcenterpt, Ratio) => {
    const { PolyBegin, PolyStepSegment, LineDesc } = initiaData;
    let linePoints = [];
    let initPoints = [PolyBegin, ...PolyStepSegment];

    for (const point of initPoints) {
        const tpxy = transformpoint(viewWidth, viewHeight, modelcenterpt, Ratio, point[0], point[1]);
        linePoints.push(tpxy);
    };

    let lineWidth = LineDesc.lineWidth * Ratio;
    let lineEnd = LineDesc.lineEnd;
    return { linePoints, lineWidth, lineEnd }
};

const transPadData = (initiaData, viewWidth, viewHeight, modelcenterpt, Ratio) => {
    const transedPad = {};

    for (const [key, value] of Object.entries(initiaData)) {
        if (key === 'location') {
            transedPad.location = transformpoint(viewWidth, viewHeight, modelcenterpt, Ratio, value[0], value[1]);
        } else if (key === 'shape') {
            transedPad[key] = value;
        } else {
            transedPad[key] = value * Ratio
        }
    };

    return transedPad;
}


const viewPointTransData = (viewport, modelcenterpt, polylines, countours, pads, Ratio) => {
    const viewWidth = viewport.cwidth;
    const viewHeight = viewport.cheight;
    let transedStore = {
        polylines: [],
        countours: [],
        pads: [],
    };

    for (const polyline of polylines) {
        let transedPolyline = transPolylineData(polyline, viewWidth, viewHeight, modelcenterpt, Ratio);
        transedStore.polylines.push(transedPolyline);
    };

    for (const couPolygon of countours) {
        let transedPolygon = transPolygonData(couPolygon, viewWidth, viewHeight, modelcenterpt, Ratio);
        transedStore.countours.push(transedPolygon);
    };

    for (const pad of pads) {
        const transedPad = transPadData(pad, viewWidth, viewHeight, modelcenterpt, Ratio);
        transedStore.pads.push(transedPad);

    }

    // console.log('transedStore',transedStore);
    window.transedStore = transedStore;

    return transedStore;
}

export default viewPointTransData;