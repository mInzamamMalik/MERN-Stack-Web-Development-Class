import './App.css';

import NavBar from "./components/navbar";
import Profile from "./components/profile";
import Login from "./components/login";
import Signup from "./components/signup";
import Products from './components/products';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useEffect, useContext } from "react"
import { GlobalContext } from './context/context';
import axios from "axios"
import backgroundImage from "./assets/background.jpeg"

function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {

    const getProfile = async () => {
      try {
        let response = await axios({
          url: `${state.baseUrl}/profile`,
          method: "get",
          withCredentials: true
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data
          })
        } else {
          dispatch({ type: "USER_LOGOUT" })
        }
      } catch (e) {
        console.log("Error in api call: ", e);
        dispatch({ type: "USER_LOGOUT" })
      }
    }
    getProfile();
    
  }, [])



  return (
    <Router>

      <NavBar />

      <Routes>
        {(state.isLogin === true) ?
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Products />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
          :
          null
        }
        {(state.isLogin === false) ?
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
          :
          null
        }
        {(state.isLogin === null) ?
          <>
            <Route path="*" element={
              <div className='loading'>
                <img src={backgroundImage} alt="" />
                <div> LOADING... </div>
              </div>
            } />
          </>
          :
          null
        }





      </Routes>
    </Router>
  );
}

export default App;
