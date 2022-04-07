/**
 * dic = {};
 * dic.dicStandard  = new Map();
 * circle1: {diameters:...};
 * rect1: {width:..., height:...}
 * oval:
 * shape
 * }
 */
 const parseDicStandard = (node) => {
    const dicstandardMap = new Map();
    const children = node[0].children;
    for (const child of children) {
        const key = child.getAttribute('id');
        const circleRegex = /CIRCLE/;
        const rectRegex = /RECT/;
        const ovalRegex = /OVAL/i;
        if (circleRegex.test(key)) {
            const diameter = Number(child.children[0].getAttribute('diameter'));
            dicstandardMap.set(key, { diameter });
        } else if (rectRegex.test(key)) {
            const width = Number(child.children[0].getAttribute('width'));
            const height = Number(child.children[0].getAttribute('height'));
            dicstandardMap.set(key, { width, height });
        } else if (ovalRegex.test(key)) {
            const width = Number(child.children[0].getAttribute('width'));
            const height = Number(child.children[0].getAttribute('height'));
            dicstandardMap.set(key, { width, height });
        } else {
            dicstandardMap.set(key, child.children);
            //console.log('special dic case id', child.children)
        }
    };
    // console.log(dicstandardMap);
    return dicstandardMap;
};

const ParseDicUser = (node) => {

};

/**
 * 
 * @param {*} node
 * {COLOR_TOP: {r="0" g="255" b="106"}} 
 */
const ParseDicColor = (node) => {
    const colorMap = new Map();
    const children = node[0].children;
    for (const child of children) {
        const key = child.getAttribute('id');
        const subChild = child.children[0];
        const r = Number(subChild.getAttribute('r'));
        const g = Number(subChild.getAttribute('g'));
        const b = Number(subChild.getAttribute('b'));
        colorMap.set(key, { r, g, b });
    };

    return colorMap;
}


const ParseDic = (xmlDoc) => {
    // const parser = new DOMParser();
    //const xmlDoc = parser.parseFromString(textcase3, "text/xml");

    const dicStandard = xmlDoc.getElementsByTagName("DictionaryStandard");
    // const DicUser = xmlDoc.getElementsByTagName("DictionaryUser");
    const DicColor = xmlDoc.getElementsByTagName("DictionaryColor");

    const dicStandardData = parseDicStandard(dicStandard);
    const dicColorData = ParseDicColor(DicColor);

    //console.log(dicColorData);

    return { dicStandardData, dicColorData }
};

export default ParseDic;