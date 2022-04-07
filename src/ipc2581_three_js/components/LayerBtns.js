

const LayerBtns = ({layerList, handlerclick}) => {
    
    layerList.map(
            name => <button key={name} onClick={() => layerBtnHandler(name)}> {name} </button>)

}