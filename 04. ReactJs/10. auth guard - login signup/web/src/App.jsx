import './App.css';

import NavBar from "./components/navbar";
import Home from "./components/home";
import Profile from "./components/profile";
import Gallery from "./components/gallery";
import Login from "./components/login";
import Signup from "./components/signup";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useEffect, useContext } from "react"
import { GlobalContext } from './context';
import axios from "axios"


function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {

    const getProfile = async () => {
      let baseUrl = "http://localhost:5001";
      try {
        let response = await axios({
          url: `${baseUrl}/profile`,
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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/" element={<Home />} />
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
            Loading...
          </>
          :
          null
        }





      </Routes>
    </Router>
  );
}

export default App;
