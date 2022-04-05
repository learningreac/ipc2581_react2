import React from 'react';
import {useDropzone} from 'react-dropzone';

function Dropzone(props) {
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
};

export default Dropzone;

//<Dropzone />


const ParsesampleStore = () => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(poly1, "text/xml");
  const polylineDoc = parser.parseFromString(samplepolyline, "text/xml");
  const coutourDoc = parser.parseFromString(contour1, "text/xml");

  const store = {};
  store.polygons = [];
  store.polylines = [];
  store.coutours = [];

  let polygon = xmlDoc.getElementsByTagName('Polygon');
  let children = polygon[0].children;
  store.polygons.push(_parseSinglePolygon(children));

  let polyline = polylineDoc.getElementsByTagName('Polyline');
  store.polylines.push(_parseSinglePolyline(polyline[0].children))

  let coutours = coutourDoc.getElementsByTagName('Contour');
  let countourPolygon = _parseSinglePolygon(coutours[0].children[0].children);
  store.coutours.push(countourPolygon);
  // window.coutours= coutours;

  window.store = store;
  return store
};

/*
else 
{
    PolyBegin:[x,y],
    PolyStepSegment: [[x1,y1], [x2,y2], [x3,y3]...],
    PolyStepCurve: {
        startPoint:[x,y],
        center:[x,y],
        clockwise:'false'
    }
};

// 数据转换成什么格式   存在数组里还是存在obj
// 属性 是要自动遍历啊，还是要手动打出来x,y
*/


/*
export function ParseAttributes (attributes) {
    const attriKeyRegex = /[a-z]+/i;
    const attriValueRegex = /[a-z]+$/i;
    const attributesArr = [];
    for(let i=0; i<attributes.length; i++) {
        let str = attributes[i];  // type is obj

        console.log(str);
       // let key = attributes[i].match(attriKeyRegex);
        //let value = attributes[i].match(attriValueRegex);
        //attributesArr.push([key, value]);
    };
    return attributesArr;
}

*/

function parseSingleLayer(layerXml) {
  const layerdata = {};
  const layerSetlist = layerXml.children;

  for (let i = 0; i < layerSetlist.length; i++) {
      let setChildren = layerSetlist[i].children;
      for (let j = 0; j < setChildren.length; j++) {
          console.log('cur set children', layerSetlist[i].setChildren[j])
      }

  }

};;

// .getAttribute ('x')
/*
function parse_LayerFeature(layerfeature) {
    for (let ch=0; ch<layerfeature.childNodes.length; ch++)
    {
        let chnode = layerfeature.childNodes[ch];
        if ("Set"===chnode.nodeName)
        {
            let fnode = chnode.childNodes[0];
            if ("Features"===fnode.nodeName)
            {
                parse_Features(fnode);
            }
        }
    }
};
*/

const parse_Features  = (node) => {
  console.log('childnodes', node.childNodes);
  for(let i=0; i<node.childNodes.length;i++) {
      if(node.childNodes[i].nodeName === "Location"){    //!=="#text"
          let nName = node.childNodes[i].nodeName;
          let xValue = node.childNodes[i].getAttribute('x');
          let yValue = node.childNodes[i].getAttribute('y');
          console.log(nName,'x = ',xValue, 'y=', yValue);
      }
  }

};

const LayerFeature = (props) => {
 // console.log('layerone', props.data.childNodes)

  let childnodes = props.data.childNodes; // set or text
  for(let i=0; i<childnodes.length;i++) {
      if(childnodes[i].nodeName=== "Set") {
          if(childnodes[i].firstElementChild.nodeName === "Features"){
             // console.log('feature',childnodes[i].firstElementChild);
              parse_Features(childnodes[i].firstElementChild);
            break;
          }
      }
  }
  //console.log('children',childnodes);

  //console.log('layerone', pros)
  return (
      <div> This is LayerFeature1 </div>
  )
};

