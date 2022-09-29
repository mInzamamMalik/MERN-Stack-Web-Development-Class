import { Link } from "react-router-dom";
import "./index.css"
import { useContext } from "react";
import { GlobalContext } from '../../context/context';
import axios from "axios"

export default function NavBar() {

    let { state, dispatch } = useContext(GlobalContext);

    const logoutHandler = async () => {
        try {
            let response = await axios.post(`${state.baseUrl}/logout`, {},
                {
                    withCredentials: true
                })
            console.log("response: ", response.data);

            dispatch({ type: "USER_LOGOUT" })

        } catch (e) {
            console.log("Error in api call: ", e);
        }
    }


    return <>
        <nav className='nav'>
            <div className="userName">{state?.user?.firstName} {state?.user?.lastName}</div>


            {(state.isLogin === true) ?
                <ul>
                    <li> <Link to="/">Products</Link>             </li>
                    <li> <Link to="/profile">Profile</Link>       </li>
                    <li> <Link to="/login" onClick={logoutHandler}>Logout</Link>  </li>

                </ul>
                :
                null
            }
            
            {(state.isLogin === false) ?
                <ul>
                    <li> <Link to="/login">Login</Link>       </li>
                    <li> <Link to="/signup">Signup</Link>     </li>
                </ul>
                :
                null
            }
        </nav>
    </> 
}