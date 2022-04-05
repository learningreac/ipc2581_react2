import React, { useState } from "react";
import PadCanvas from "./PadCanvas.js";
import store from './store';

const drawPoint = (ctx, x, y) => {
    //console.log('x', x);
    ctx.beginPath()
    ctx.fillStyle = 'blue';
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
}

const drawPoints = (ctx, points) => {
    for (let i = 0; i < points.length; i++) {
        const x = points[i][0];
        const y = points[i][1];
        drawPoint(ctx, x, y);
    };
};

const drawLine = (ctx, startpoint, endpoint) => {
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.moveTo(startpoint[0], startpoint[1]);
    ctx.lineTo(endpoint[0], endpoint[1]);
    ctx.stroke();
}

const drawLines = (ctx, points) => {
    for (let i = 0; i < points.length; i += 2) {
        const startpoint = points[i];
        const endpoint = points[i + 1];
        drawLine(ctx, startpoint, endpoint);
    }
};

const drawCircle = (ctx, center, radius) => {
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawCircles = (ctx, circles) => {
    for (const circle of circles) {
        drawCircle(ctx, circle.center, circle.radius);
    };
};

const drawRect = (ctx, topleft, width, height) => {
    ctx.strokeRect(topleft[0], topleft[1], width, height);
};
const drawRects = (ctx, rectangles) => {
    for (const rect of rectangles) {
        drawRect(ctx, rect.topleft, rect.width, rect.height);
    }
};

const pencilDraw = (ctx, line) => {
    ctx.beginPath();
    const [plstart, ...plrest] = line;
    ctx.moveTo(plstart[0], plstart[1]);
    plrest.forEach(point => {
        ctx.lineTo(point[0], point[1]);
    });
    //ctx.closePath();   // this will close the polyline automatically
    ctx.stroke();
};

const drawPolypoints = (ctx, prev, cur) => {
    // Tangential lines
    ctx.beginPath();
    /* ctx.strokeStyle = 'gray';
     ctx.lineWidth = 5;
     ctx.lineCap = 'round';
     ctx.lineJoin = 'round';
     line.forEach(point => ctx.lineTo(point[0], point[1]));
     ctx.stroke();
     */

    // Start point
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(cur[0], cur[1], 5, 0, 2 * Math.PI);
    ctx.fill();

    // Tangential lines
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.moveTo(prev[0], prev[1])
    ctx.lineTo(cur[0], cur[1]);
    ctx.stroke();
};

const drawPolyline = (ctx, line) => {
    for (let i = 0; i < line.length; i++) {
        if (i === 0) {
            drawPolypoints(ctx, line[i], line[i]);
        } else {
            drawPolypoints(ctx, line[i - 1], line[i]);
        }
    }
}

const drawPolylines = (ctx, polylines) => {
    polylines.forEach(line => drawPolyline(ctx, line))
};


const temppass = (ctx, store) => {
    if (store.tmplines.length >= 2) {
        drawLine(ctx, store.tmplines[0], store.tmplines[1]);
    };

    if (store.tmpcircle.radius !== undefined) {
        drawCircle(ctx, store.tmpcircle.center, store.tmpcircle.radius);
    };

    if (store.tmprect.width && store.tmprect.height) {
        drawRect(ctx, store.tmprect.topleft, store.tmprect.width, store.tmprect.height)
    };

    if (store.tmppoline.length >= 2) {
        pencilDraw(ctx, store.tmppoline)
    };

    if (store.tmppolyline.length >0) {
        drawPolyline(ctx, store.tmppolyline);
    }
}

const passes = (ctx, store, drawfun) => {

    if (drawfun === 0) {
        drawPoints(ctx, store.points);
    } else if (drawfun === 1) {
        drawLines(ctx, store.lines);
    } else if (drawfun === 2) {
        drawCircles(ctx, store.circles);
    } else if (drawfun === 3) {
        drawRects(ctx, store.rectangles);
    } else if (drawfun === 5) {
        drawPolylines(ctx, store.polylines);
    };

    temppass(ctx, store);
};


const DONESTATE = 0;
const STARTSTATE = 1;
const DRAGSTATE = 2;
let linestate = DONESTATE;


const drawlineCtrl = {
    onDragStart(event) {
        console.log('start drag', linestate);
        if (DONESTATE === linestate) {
            linestate = STARTSTATE;
            store.tmplines = [];
            store.tmplines.push([event.clientX, event.clientY]);
        } //...
    },
    onDragEnd(event) {
        if (DRAGSTATE === linestate) {
            linestate = DONESTATE;
            // commit tmp to store
            if (2 === store.tmplines.length) {
                store.lines = [...store.lines, ...store.tmplines];
                store.tmplines = [];
            }
        }
    },
    onDragMove(event) {
        if (STARTSTATE === linestate) {
            linestate = DRAGSTATE;
            store.tmplines.push([event.clientX, event.clientY]);
        } else if (DRAGSTATE === linestate) {
            store.tmplines[1][0] = event.clientX;
            store.tmplines[1][1] = event.clientY;
        }
    }
};


const drawpointCtrl = {
    onDragStart(event) {
        const curPoint = [event.clientX, event.clientY];
        console.log('cur', curPoint);
        store.points = [...store.points, curPoint];
    },
    onDragEnd(event) { },
    onDragMove(event) { }
};

const drawCircleCtrl = {
    onDragStart(event) {
        console.log('start drag', linestate);
        if (DONESTATE === linestate) {
            linestate = STARTSTATE;
            store.tmpcircle = {};
            store.tmpcircle.center = [event.clientX, event.clientY];
            console.log('tmpcircle', store.tmpcircle)
        } //...
    },
    onDragEnd(event) {
        if (DRAGSTATE === linestate) {
            linestate = DONESTATE;
            // commit tmp to store
            if (store.tmpcircle.center && store.tmpcircle.radius) {
                console.log('tmpcircle', store.tmpcircle)
                store.circles = [...store.circles, store.tmpcircle];
                store.tmpcircle = {};
            }
        }
    },

    onDragMove(event) {
        if (STARTSTATE === linestate) {
            linestate = DRAGSTATE;
            // incase the center was not defined at last state
            store.tmpcircle.center = [event.clientX, event.clientY];
        } else if (DRAGSTATE === linestate) {
            let xdiff = Math.abs(event.clientX - store.tmpcircle.center[0]);
            let ydiff = Math.abs(event.clientY - store.tmpcircle.center[1]);
            let xdiffPow = Math.pow(xdiff, 2);
            let ydiffPow = Math.pow(ydiff, 2);
            console.log('for raidus', xdiff, xdiffPow, ydiff, ydiffPow)
            store.tmpcircle.radius = Math.sqrt(xdiffPow + ydiffPow);
        }
    }
};

const drawRectCtrl = {
    onDragStart(event) {
        console.log('start drag', linestate);
        if (DONESTATE === linestate) {
            linestate = STARTSTATE;
            store.tmprect = {};
            store.tmprect.startPoint = [event.clientX, event.clientY];
            store.tmprect.topleft = [event.clientX, event.clientY];
        } //...
    },
    onDragEnd(event) {
        if (DRAGSTATE === linestate) {
            linestate = DONESTATE;
            // commit tmp to store
            if (store.tmprect.topleft && store.tmprect.width && store.tmprect.height) {
                console.log('tmprect', store.tmprect)
                store.rectangles = [...store.rectangles, store.tmprect];
                store.tmprect = {};
            }
        }
    },

    onDragMove(event) {
        if (STARTSTATE === linestate) {
            linestate = DRAGSTATE;
            // incase the center was not defined at last state
            // store.tmprect.startPoint = [event.clientX, event.clientY];
            store.tmprect.topleft = [event.clientX, event.clientY];
        } else if (DRAGSTATE === linestate) {
            let width = Math.abs(event.clientX - store.tmprect.startPoint[0]);
            let height = Math.abs(event.clientY - store.tmprect.startPoint[1]);
            store.tmprect.width = width;
            store.tmprect.height = height;
            store.tmprect.topleft[0] = Math.min(event.clientX, store.tmprect.startPoint[0]);
            store.tmprect.topleft[1] = Math.min(event.clientY, store.tmprect.startPoint[1]);
            console.log(store.tmprect)
        }
    }
};

const drawPencilCtrl = {
    // commit tmp to store if 
    // user press esc or the user click the last point again or user close the path
    onDragStart(event) {
        console.log('start drag', linestate);
        if (DONESTATE === linestate) {
            linestate = STARTSTATE;
            store.tmppoline = [...store.tmppoline];
            store.tmppoline.push([event.clientX, event.clientY]);
        } //...
    },
    onDragEnd(event) {
        if (DRAGSTATE === linestate) {
            linestate = DONESTATE;
            // ending points is very close to start point
            let distance = CalcuDistance(
                store.tmppoline[0][0],
                store.tmppoline[0][1],
                event.clientX,
                event.clientY);
            console.log('diffdis', distance)
            if (store.tmppoline.length >= 2 && distance <= 50) {
                // endpoint = start point
                store.tmppoline[store.tmppoline.length - 1] = store.tmppoline[0];
                store.polylines = [...store.polylines, store.tmppoline];
                store.tmppoline = [];
            }
        }
    },
    onDragMove(event) {
        if (STARTSTATE === linestate) {
            linestate = DRAGSTATE;
            // store.tmppoline.push([event.clientX, event.clientY]);
        } else if (DRAGSTATE === linestate) {
            let curindex = store.tmppoline.length;
            console.log('curidx', curindex);
            store.tmppoline.push([]);
            store.tmppoline[curindex][0] = event.clientX;
            store.tmppoline[curindex][1] = event.clientY;
        }
    }
};

const drawPolylineCtrl = {
    // commit tmp to store if 
    // user press esc or the user click the last point again or user close the path
    onDragStart(event) {
        if (DONESTATE === linestate) {
            linestate = STARTSTATE;
            store.tmppolyline = [...store.tmppolyline];
            store.tmppolyline.push([event.clientX, event.clientY]);
            console.log([event.clientX, event.clientY]);
        } //...
    },
    onDragEnd(event) {
        if (DRAGSTATE === linestate) {
            linestate = DONESTATE;
            // ending points is very close to start point
            let distance = CalcuDistance(
                store.tmppolyline[0][0],
                store.tmppolyline[0][1],
                event.clientX,
                event.clientY);
            console.log('diffdis', distance)
            if (store.tmppolyline.length >= 2 && distance <= 20) {
                // endpoint = start point
                store.tmppolyline.push(store.tmppolyline[0]);
                store.polylines = [...store.polylines, store.tmppolyline];
                store.tmppolyline = [];
            } else {
                store.tmppolyline.push([event.clientX, event.clientY]);
            }
        }
    },
    onDragMove(event) {
        if (STARTSTATE === linestate) {
            linestate = DRAGSTATE;
            // store.tmppoline.push([event.clientX, event.clientY]);
        } else if (DRAGSTATE === linestate) {
        }
    }
};

// check two points distance
function CalcuDistance(x1, y1, x2, y2) {
    const xdiff = Math.abs(x1 - x2);
    const ydiff = Math.abs(y1 - y2);
    const xdiffPow = Math.pow(xdiff, 2);
    const ydiffPow = Math.pow(ydiff, 2);
    const distance = Math.sqrt(xdiffPow + ydiffPow);
    return distance;
}

const handlerregister = {
    onDragStart: () => { },
    onDragEnd: () => { },
    onDragMove: () => { },
}

const setdrawhandle = (drawhandle) => {
    handlerregister.onDragStart = drawhandle.onDragStart;
    handlerregister.onDragEnd = drawhandle.onDragEnd;
    handlerregister.onDragMove = drawhandle.onDragMove;
}

// pointer event 
// event list pointer down, pointer move, pointer up
// sub 3 call back

// delegate the 

const handlers = {
    onDragStart(event) {
        handlerregister.onDragStart(event);
    },
    onDragEnd(event) {
        handlerregister.onDragEnd(event);
    },
    onDragMove(event) {
        handlerregister.onDragMove(event);
    }
};




const App = () => {
    const [drawfunction, setdrawfun] = useState(4);

    const handleDrawPointsClick = () => {
        setdrawfun(0);
        setdrawhandle(drawpointCtrl);
    };
    const handlerDrawLineClick = () => {
        setdrawfun(1);
        setdrawhandle(drawlineCtrl);
    };
    const handleDrawCircleClick = () => {
        setdrawfun(2);
        setdrawhandle(drawCircleCtrl)
    };

    const handleDrawRectClick = () => {
        setdrawfun(3);
        setdrawhandle(drawRectCtrl)
    };

    const handlePencilClick = () => {
        setdrawfun(4);
        setdrawhandle(drawPencilCtrl)
    };

    const handleDrawPolyClick = () => {
        setdrawfun(5);
        setdrawhandle(drawPolylineCtrl)
    }

    return (
        <>
           
            <div className="padapp">
                <PadCanvas store={store} passes={passes} drawfun={drawfunction} handlers={handlers} />
            </div>

            <button onClick={handlePencilClick}> Pencil </button>
            <button onClick={() => setdrawfun(0)}> show Points </button>
            <button onClick={() => setdrawfun(1)}> show Lines </button>

            <button onClick={handleDrawPointsClick}> Draw Points </button>
            <button onClick={handlerDrawLineClick}> Draw Lines </button>
            <button onClick={handleDrawCircleClick}> Draw Circles </button>
            <button onClick={handleDrawRectClick}> Draw Rectangles </button>
            <button onClick={handleDrawPolyClick}> Draw Polylines </button>
        </>

    )
};

export default App;