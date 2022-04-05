import React, {useState} from "react";

// components
import Canvas from "./Canvas";
import Customizeddata from "./Customizedata";

// data;
import points  from "./defaultData";

const App = () => {
    const [pointslist, setPointslist] = useState(points);     

    return (
        <div className="App">
            <Customizeddata  onSetdata = {setPointslist} />
            <div className="Delauntor">
                <Canvas points = {pointslist}/>
            </div>
        </div>
    )
};

export default App;