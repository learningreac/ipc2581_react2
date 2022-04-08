const transPolygonData = (initiaData) => {
    const { PolyBegin, PolyStepSegment, PolyStepCurve } = initiaData;
    let initPoints = [PolyBegin, ...PolyStepSegment];
    if (PolyStepCurve) {
        initPoints = [...initPoints, PolyStepCurve.startPoint, PolyStepCurve.center];
    };
   
    return initPoints;
};

const transPolylineData = (initiaData) => {
    const { PolyBegin, PolyStepSegment, LineDesc } = initiaData;
    let linePoints =[PolyBegin, ...PolyStepSegment];
    let lineWidth = LineDesc.lineWidth;
    let lineEnd = LineDesc.lineEnd;
    return linePoints;
};

/*
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
}*/





function transformStoreToPoints (transedSuperStore, curlayer) {

      /*
    console.log('curlayer', layer);
   {layerName: 'fab', polylines: Array(1120), contours: Array(7), pads: Array(0), bbox: undefined, …}
    */

    const {layerName, polylines, contours} = curlayer;

    if(!transedSuperStore[layerName]) {
        let transedStore = {
            layerName,
            polylines: [],
            contours: [],
           // pads: [],
        };
    
        for (const polyline of polylines) {
            let transedPolyline = transPolylineData(polyline);
            transedStore.polylines.push(transedPolyline);
        };
    
        for (const couPolygon of contours) {
            let transedPolygon = transPolygonData(couPolygon);
            transedStore.contours.push(transedPolygon);
        };
    
        /*
        for (const pad of pads) {
            const transedPad = transPadData(pad, viewWidth, viewHeight, modelcenterpt, Ratio);
            transedStore.pads.push(transedPad);
    
        }
        */
        transedSuperStore[layerName] = transedStore;
    };

   

    return  transedSuperStore[layerName];
};

export default transformStoreToPoints;


/*
SM_TOP: {layerName: 'SM_TOP', polylines: Array(45), contours: Array(0)}
*/