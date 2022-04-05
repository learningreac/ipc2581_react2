import { minDistance } from '../math/dispointsegment';


function _checkSinglePolygonAndPolyline(entity, modelClickPt) {
    let curmin = Infinity;
    let checkPoints = [entity.PolyBegin, ...entity.PolyStepSegment];

    for (let i = 1; i < checkPoints.length; i++) {
        const curDistance = minDistance(checkPoints[i - 1], checkPoints[i], modelClickPt);
        curmin = Math.min(curmin, curDistance);
    };
    return curmin;
}

function _checkCoutourPolygon(polygons, modelClickPt) {
    let min1 = Infinity;
    let target1;
    for (const polygon of polygons) {
        let curDistance = _checkSinglePolygonAndPolyline(polygon, modelClickPt);
        if (curDistance < min1) {
            min1 = curDistance;
            target1 = polygon;
        }
    };
    return { min1, target1 };
};

function _checkPolylines(polylines, modelClickPt) {
    let min2 = Infinity;
    let target2;
    for (const polyline of polylines) {
        let curDistance = _checkSinglePolygonAndPolyline(polyline, modelClickPt);
        if (curDistance < min2) {
            min2 = curDistance;
            target2 = polyline;
        }
    };
    return { min2, target2 };
};


const findClickEntity = (store, modelClickPt) => {
    const { min1, target1 } = _checkCoutourPolygon(store.coutours, modelClickPt);
    const { min2, target2 } = _checkPolylines(store.polylines, modelClickPt);
    let selectedTarget = (min1 < min2) ? target1 : target2;
    return selectedTarget;
};

export default findClickEntity

/*
store.coutours: {
PolyBegin:[]
polyStepSegment: [[],[],[]...];
polyStepCurve:{
    startpoint:[],
    center:[]
}
}
store.polylines    same as polygon most of them does not hava polyStepCurve 
stroe.pads {
    circle:
    rectangle

}

*/


