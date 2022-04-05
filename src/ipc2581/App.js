import { useState } from 'react';
import './App.css';

import FileDropZone from './components/FileDropZone.js';
import PolyCanvas from './components/PolyCanvas.js';

import ParseStore from './data/store';
import computeBoundingBox from './utilities/computeBoundingBox.js';
import viewPointTransData, { transformpoint, transCanvasPTtoModel, calcuScaleRatio, transPolylineData } from './utilities/transformdata.js';
import drawfun from './utilities/draw.js';
import findClickEntity from './utilities/findSelectedEntity';





// helper function
function getbbox4corners(bbox) {
  const hh = bbox.height / 2;
  const hw = bbox.width / 2.;
  const ox = bbox.ox;
  const oy = bbox.oy;

  return [[ox - hw, oy - hh], [ox + hw, oy - hh], [ox + hw, oy + hh], [ox - hw, oy + hh]];
};


// event handlers
// for zoom and scale
class Handlers {
  constructor(updatestate, setdone) {
    this.updatestate = updatestate;
    this.setdone = setdone;
    this.startpt = undefined;
    this.endpt = undefined;
    this.dragStart = false;

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  };

  onDragStart(event) {
    this.dragStart = true;
    this.startpt = [event.clientX, event.clientY];
    console.log('dragstart', [event.clientX, event.clientY]);
  };
  onDragEnd(event) {
    this.dragStart = false;
    console.log('dragend', [event.clientX, event.clientY]);
  };
  onDragMove(event) {
    if (!this.dragStart) return;
    let deltaX = event.clientX - this.startpt[0];
    let deltaY = event.clientY - this.startpt[1];
    console.log(deltaX, deltaY);
    this.updatestate([deltaX, deltaY]);
  };
};


// for click and then highlight
class highlightHandler {
  constructor(setMousemovePt) {
    this.setMousemovePt = setMousemovePt;

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
  };

  onDragStart(event) {
    console.log([event.clientX, event.clientY])
    this.setMousemovePt([event.clientX, event.clientY])
  };

  onDragMove() {
    // if (!this.dragStart) return;

  };
  onDragEnd() { };
};





const handlers = new Handlers();
const highselectedHandler = new highlightHandler();



const App = () => {
  const [xmlDoc, setxmlDoc] = useState(null);

  let superstore, layersKey;
  if (xmlDoc) {
    superstore = ParseStore(xmlDoc);
    layersKey = Object.keys(superstore);
  };

  const [pointerHandle, setPointerHandle] = useState(handlers);
  const [store, setLayerStore] = useState(null);
  //const store = superstore.TOP;
  // console.log('handlers now', pointerHandle);
 // console.log('store', store);

  const layerBtnHandler = (name) => {
    setLayerStore(superstore[name]);
  };

  // to be move in main function and change according to the store data
  let polylines, coutours, pads;
  if (store) {
    polylines = store.polylines;
    coutours = store.coutours;
    pads = store.pads;
  };

  let transedStore = undefined;
  let Ratio = undefined;
  const drawfunins = new drawfun();

  const draw = (ctx, canvas, scale, updcavdeltax, updcavdeltay, commit, mousePt) => {

    const cwidth = canvas.width;
    const cheight = canvas.height;
    if (undefined === store.bbox) {
      let modelbbox = computeBoundingBox(polylines, coutours);
      const modelcenter = modelbbox.center();
      store.bbox = {
        ox: modelcenter.ox,
        oy: modelcenter.oy,
        width: modelbbox.width(),
        height: modelbbox.height()
      }
      Ratio = calcuScaleRatio(cwidth, cheight, store.bbox);

    }

    let tmpRatio = Ratio;
    if (undefined !== scale)
      tmpRatio = Ratio * scale;
    const modelcenterpt = { ox: store.bbox.ox, oy: store.bbox.oy };

    const modeldeltax = updcavdeltax / tmpRatio;
    const modeldeltay = updcavdeltay / tmpRatio;

    modelcenterpt.ox += -modeldeltax;
    modelcenterpt.oy += +modeldeltay;

    if (undefined !== commit) {
      store.bbox.ox = modelcenterpt.ox;
      store.bbox.oy = modelcenterpt.oy;
    }

    transedStore = viewPointTransData({ cwidth, cheight }, modelcenterpt, polylines, coutours, pads, tmpRatio);

    // click and show the selected area and the selected entity
    if (undefined !== mousePt) {
      //visualize click square draw a rectangel
      drawfunins.VisualizeClickAreaRect(ctx, mousePt);

      //viewWidth, viewHeight, bbox, temRatio, Cax, Cay
      const modelClickPt = transCanvasPTtoModel(cwidth, cheight, store.bbox, tmpRatio, mousePt[0], mousePt[1]);

      let selectedTarget = findClickEntity(store, modelClickPt);

      // verse-caculate modelClikePt to  CanvasXY, to verify if calculation is correct;
      let reverseToCanvas = transformpoint(cwidth, cheight, store.bbox, tmpRatio, modelClickPt[0], modelClickPt[1]);
      drawfunins.VisualClickCircle(ctx, reverseToCanvas);

      // hight the selected entity
      if (selectedTarget.getClassName() === 'Polyline') {
        let transedtarget = transPolylineData(selectedTarget, cwidth, cheight, modelcenterpt, tmpRatio);
        drawfunins.SelectedPolyline(ctx, transedtarget.linePoints, transedtarget.lineWidth, transedtarget.lineEnd)
      }
    }

    if (store.isdebgvis) {
      const corner4 = getbbox4corners(store.bbox);
      const corner4view = corner4.map((val) => {
        return transformpoint(cwidth, cheight, store.bbox, tmpRatio, val[0], val[1]);
      });

      corner4view.push(corner4view[0]);
      drawfunins.PolylineWithDesc(ctx, corner4view, 1, 'round');
    };

    for (const transline of transedStore.polylines) {
      drawfunins.PolylineWithDesc(ctx, transline.linePoints, transline.lineWidth, transline.lineEnd);
    };

    for (const transCountour of transedStore.countours) {
      drawfunins.CoutourPolygon(ctx, transCountour.linePoints);
      if (transCountour.curveCenter) {
        drawfunins.PolyStepCurve(ctx, transCountour.curveCenter, transCountour.curveRadius);
      }
    };

    for (const pad of transedStore.pads) {
      if (pad.shape === 'circle') {
        drawfunins.Circle(ctx, pad.location, pad.diameter);
      } else if (pad.shape === 'rectangle') {
        drawfunins.Rectangle(ctx, pad.location, pad.width, pad.height)
      }
    };
  }; // end draw

  console.log('xmlDoc', xmlDoc);
  window.xmlDoc = xmlDoc;

  return (
    <div className="App">

      <div className='canvas'>
       {store && <PolyCanvas draw={draw} handlers={pointerHandle} />}
      </div>

      <div className='Btn'>
        <button onClick={() => setPointerHandle(handlers)}>Move and Zoom</button>
        <button onClick={() => setPointerHandle(highselectedHandler)}>Select</button>
        {layersKey &&
          layersKey.map(name => <button key={name} onClick={() => layerBtnHandler(name)}> {name} </button>)
        }
      </div>

      < FileDropZone setxmlDoc={setxmlDoc} />

    </div>

  );
};

export default App;

// <LayerFeaturelist xmlDoc = {xmlDoc}  store = {store}/>
// findClickEntity = (store, tmpRatio, [event.clientX, event.clientY])