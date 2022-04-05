//helper function 
import createrandomdata from "./createrandomdata";

const Customizeddata = ({onSetdata = f => f}) => {
    let _size;
    const handleSubmit = (event) => {
        event.preventDefault();
        const newPoints = createrandomdata(_size.value);
        console.log(onSetdata);
        onSetdata(newPoints);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input ref={input => _size = input}
                type="text"
                placeholder="data size..." required />
            <button> Random </button>

        </form>
    )

};

export default Customizeddata;