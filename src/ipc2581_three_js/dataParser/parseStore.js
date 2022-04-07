import ParseDic from './parseDic';


class Polygon {
    constructor(PolyBegin, PolyStepSegment) {
        this.PolyBegin = PolyBegin;
        this.PolyStepSegment = PolyStepSegment;
    };
    getClassName() {
        return this.constructor.name;
    }
};

class Polyline {
    constructor(PolyBegin, PolyStepSegment) {
        this.PolyBegin = PolyBegin;
        this.PolyStepSegment = PolyStepSegment;
    };
    getClassName() {
        return this.constructor.name;
    }
};



function getX(node) {
    let x = node.getAttribute('x');
    return Number(x);
};

function getY(node) {
    let y = node.getAttribute('y');
    return Number(y);
};

function getID(node) {
    return node.getAttribute('id');
};

function getCenter(node) {
    let x = node.getAttribute('centerX');
    let y = node.getAttribute('centerY');
    return [Number(x), Number(y)];//[x * scale.toFixed(2), y * scale.toFixed(2)];
};

function getShape(idstring) {
    const circleRegex = /CIRCLE/;
    const rectRegex = /RECT/;
    if (circleRegex.test(idstring)) {
        return 'circle';
    } else if (rectRegex.test(idstring)) {
        return 'rectangle'
    };
};

function getclockwise(node) {
    return node.getAttribute('clockwise');
};

function ParsePolyStepCurve(node) {
    let attr = {};
    attr.startPoint = [getX(node), getY(node)];
    attr.center = getCenter(node);
    attr.clockwise = getclockwise(node);
    // console.log(attr);
    return attr;
};

function ParseLineDisc(node) {
    let attr = {};
    attr.lineEnd = node.getAttribute('lineEnd');
    attr.lineWidth = node.getAttribute('lineWidth');
    return attr;
};

function distance__(x0, y0, x1, y1) {
    const dx = (x1 - x0);
    const dy = (y1 - y0);
    return Math.sqrt(dx * dx + dy * dy);
};

function calcuRadius(PolyStepCurve) {
    // add radius
    const startPoint = PolyStepCurve.startPoint;
    const center = PolyStepCurve.center;
    const radius = distance__(startPoint[0], startPoint[1], center[0], center[1]);
    return radius;
};

function addRadiustoStore(PolyStepCurve, radius) {
    PolyStepCurve.radius = radius;
    return PolyStepCurve;
}

const _parseSinglePolygon = (children) => {
    const curPolygon = new Polygon([], []);

    // PolyStepCurve is not required.
    // children : PolyBegin,PolyStepSegment,PolyStepCurve
    for (let i = 0; i < children.length; i++) {
        let curNode = children[i];
        let nodeName = curNode.nodeName;
        if (nodeName !== 'PolyStepCurve') {
            let nodevalue = [getX(curNode), getY(curNode)];
            curPolygon[nodeName] = (nodeName === 'PolyBegin')
                ? nodevalue
                : [...curPolygon[nodeName], nodevalue]

        } else if (nodeName === 'PolyStepCurve') {
            curPolygon[nodeName] = ParsePolyStepCurve(curNode);
            const Radius = calcuRadius(curPolygon[nodeName]);
            addRadiustoStore(curPolygon[nodeName], Radius);
        } else {
            // console.log('special polygon')
        }
    };
    // console.log('curPolygon',curPolygon);
    return curPolygon;
};

/**
 * 
 * @param {*} children   
 * @returns 
 *  special case children: 0: PolyBegin, 1: PolyStepSegment, 2: PolyStepCurve, 3: PolyStepSegment,4: LineDesc
 */
const _parseSinglePolyline = (children) => {
    const curPolyline = new Polyline([], []);

    // children : PolyBegin,PolyStepSegment,LineDesc
    for (let i = 0; i < children.length; i++) {
        let curNode = children[i];
        let nodeName = curNode.nodeName;
        if (nodeName === 'PolyBegin') {
            let nodevalue = [getX(curNode), getY(curNode)];
            curPolyline[nodeName] = nodevalue;
        } else if (nodeName === 'PolyStepSegment') {
            let nodevalue = [getX(curNode), getY(curNode)];
            curPolyline[nodeName] = [...curPolyline[nodeName], nodevalue]
        }
        else if (nodeName === 'LineDesc') {
            curPolyline[nodeName] = ParseLineDisc(curNode);
        } else if (nodeName === 'PolyStepCurve') {
            curPolyline[nodeName] = ParsePolyStepCurve(curNode);
            const Radius = calcuRadius(curPolyline[nodeName]);
            addRadiustoStore(curPolyline[nodeName], Radius);
        }
    };

    return curPolyline;
};


const _parseSinglePad = (children, dicStandardData) => {
    //console.log('padchildren', children);
    const pad = {};
    for (const child of children) {
        if (child.nodeName === 'Location') {
            pad.location = [getX(child), getY(child)]
        } else if (child.nodeName === 'StandardPrimitiveRef') {
            let id = getID(child);
            if (!id) {
                console.log(child)
            }
            pad.shape = getShape(id);
            const attrs = dicStandardData.get(id); // obj
            for (const [key, value] of Object.entries(attrs)) {
                pad[key] = value;
            }
        } else {
           // console.log('special pad attributes', child.nodeName)
        }
    };

    return pad;

};


function parseentity(setlist, layerData) {
    let curcontex = setlist.children[0];
    if (undefined === curcontex) {
        console.log('setchild', setlist);
        return;
    }
    let curChild = curcontex.children[1]; // children 0 is <Location>
    if (undefined === curChild) {
        console.log('setchild 2', curChild);
        return;
    }

    if (curChild.nodeName === 'Contour') {
        let contoursPolygon = _parseSinglePolygon(curChild.children[0].children);
        layerData.contours.push(contoursPolygon);
    } else if (curChild.nodeName === 'Polyline') {
        layerData.polylines.push(_parseSinglePolyline(curChild.children))
    } else {
        console.log('special nodename', curChild.nodeName);  //pad (522)
    }
}


function parseLayer(layerXml, layerName, dicStandardData) {
    const layerData = {
        layerName: layerName,
        polylines: [],
        contours: [],
        pads: [],

        bbox: undefined,
        isdebgvis: true,//
    };

    const setList = layerXml.children;

    for (let i = 0; i < setList.length; i++) {
        //for (let cj = 0; cj < setList[i].children.length; cj++)
        const cj = 0;
        if (setList[i].children !== undefined) {
            if (setList[i].children[cj].nodeName === 'Features') {
                parseentity(setList[i], layerData);
            } else if (setList[i].children[cj].nodeName === 'Pad') {
                let curcontex = setList[i].children[0];
                if (curcontex !== undefined){
                    layerData.pads.push(_parseSinglePad(curcontex.children, dicStandardData))
                }
                else{
                    console.log('pads', setList[i]);
                }   
            }
            else {
              //  console.log(setList[i].children[cj].nodeName); // colorRef
            }
        } else {
           // console.log('undefined setList children', setList[i]);
        }
    };

    return layerData;
};





const ParseStore = (xmlDoc) => {
    const superstore = {};
    const dic = ParseDic(xmlDoc);
    const { dicStandardData } = dic;

    const layerFeaturelist = xmlDoc.getElementsByTagName("LayerFeature");

    for (let i = 0; i < layerFeaturelist.length; i++) {
        let curLayerXml = layerFeaturelist[i];
        const layerName = layerFeaturelist[i].getAttribute('layerRef')
        superstore[layerName] = parseLayer(curLayerXml, layerName, dicStandardData);
    };

    return superstore;
};



export default ParseStore;


