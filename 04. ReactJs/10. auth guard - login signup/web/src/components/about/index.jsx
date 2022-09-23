import { useContext } from "react";
import { GlobalContext } from '../../context';


let About = () => {

    let { state, dispatch } = useContext(GlobalContext);


    return (
        <div >
            I am About component - {state.myNum}

            <button onClick={() => {
                dispatch({
                    type: "ADD",
                })
            }} >add</button>
        </div>
    );
}

export default About;
