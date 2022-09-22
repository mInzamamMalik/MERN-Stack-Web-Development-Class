import { useContext } from "react";
import { GlobalContext } from '../../context';


let Gallery = () => {

    let { state, dispatch } = useContext(GlobalContext);


    return (
        <div >
            I am Gallery component - {state.myNum}

            <button onClick={()=>{
                dispatch({
                    type: "SUB"
                })                
            }}>Minus</button>
        </div>
    );
}

export default Gallery;
