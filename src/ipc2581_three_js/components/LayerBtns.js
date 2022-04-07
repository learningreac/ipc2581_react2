

const LayerBtns = ({layerList, handlerClick}) => {

   // const handlerclick = () => {
        
   // }

   // add conditional rendering

    return (
        <div className="layerbtns">
            {layerList && layerList.map(
            name => <button key={name} onClick={() => handlerClick(name)}> {name.toUpperCase()} </button>)}
        </div>
    )
};

export default LayerBtns;