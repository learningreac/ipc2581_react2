import { useState } from 'react';
import './App.css';

//components
import FileDropZone from './components/FileDropZone';
import ThreeJsCanvas from './components/ThreeCanvas';
import LayerBtns from './components/LayerBtns';

// utilities
import ParseStore from './dataParser/parseStore';
import transformStoreToPoints from './dataParser/tansformStoreToPoints';

let transedSuperStore= {};

const App = () => {
    const [xmlDoc, setxmlDoc] = useState(null);
    const [layer, setLayer] = useState(null);

    console.log('curlayer', layer);
    /*
    console.log('curlayer', layer);
    {layerName: 'fab', polylines: Array(1120), contours: Array(7), pads: Array(0), bbox: undefined, …}
    */

    let superstore, layersKey, curDraw;
    
    if (xmlDoc) {
      superstore = ParseStore(xmlDoc);
      layersKey = Object.keys(superstore);
    };

    const layerBtnHandler = (name) => {
        setLayer(superstore[name]);
      };
    window.superstore = superstore;


    if(layer) {
      curDraw = transformStoreToPoints(transedSuperStore,layer);
      console.log('trastore', transedSuperStore);
    }
  

    return (
        <div className='threejsapp'>
            <FileDropZone setxmlDoc={setxmlDoc} />
            <LayerBtns layerList = {layersKey}  handlerClick = {layerBtnHandler}/>
            {curDraw && <ThreeJsCanvas layer = {curDraw}/> }
        </div>

    )
};

export default App;

