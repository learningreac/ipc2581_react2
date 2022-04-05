
function _generatePoints(size) {
    const points = [];
    for (let i = 0; i < size; i++) {
        const x = Math.floor(Math.random() * 900);
        const y = Math.floor(Math.random() * 700);
        points.push([x, y]);
    };

    return points;
}

const store = { };

// points:[x,y]
store.points = _generatePoints(100);
// lines: [[x0,y0],[x1,y1]]
store.lines = _generatePoints(100); // 50 lines

store.tmplines = [];

//circle 
//[[x0,y0],radias0], [[x1,y1],radias1]      ctx.stroke();
store.circles = [];
const firstCircle = {
    center:[50,50],
    radius:10
}
store.circles.push(firstCircle);
store.tmpcircle = {};

store.rectangles = [];
const firstRect = {
    startPoint: [50,50],
    topleft:[50,50],   // upper left corner,might change
    width: 50,
    height:30
};
store.rectangles.push(firstRect); 
store.tmprect = {};

/*
const shell = {};
window.shell = shell;

let showline = false;
shell.toggleLine = ()=> {
    showline = !showline;
}
*/

// this one is for pencil
store.tmppoline= [];


store.polylines = [];
// line 1: [[x0,y0],[x1,y1],[x2,y2], [x3,y3]];
// line 2: [[x0,y0],[x1,y1],[x2,y2], [x3,y3]];
const polylineSample = [[200,20], [200,130], [50,20], [50,200], [300,200]];
store.polylines.push(polylineSample);
store.tmppolyline = [];
export default store;
