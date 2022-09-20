

import { Link } from "react-router-dom";
import "./index.css"
import { useContext } from "react";
import { GlobalContext } from '../../context';


export default function NavBar() {

    let { state, dispatch } = useContext(GlobalContext);


    return (
        <nav className='nav'>
            <div className="userName">{state?.user?.firstName} {state?.user?.lastName}</div>
            <ul>
                <li> <Link to="/">Home</Link>             </li>
                <li> <Link to="/about">About</Link>       </li>
                <li> <Link to="/gallery">Gallery</Link>   </li>

                <li> <Link to="/login">Login</Link>       </li>
                <li> <Link to="/signup">Signup</Link>     </li>
            </ul>
        </nav>
    )
}