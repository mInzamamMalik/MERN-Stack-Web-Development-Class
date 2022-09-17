import './App.css';
import Home from "./components/home";
import About from "./components/about";
import Gallery from "./components/gallery";
import Login from "./components/login";
import Signup from "./components/signup";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <Router> 
        <nav className='nav'>
          <ul>
            <li> <Link to="/">Home</Link>             </li>
            <li> <Link to="/about">About</Link>       </li>
            <li> <Link to="/gallery">Gallery</Link>   </li>
            
            <li> <Link to="/login">Login</Link>   </li>
            <li> <Link to="/signup">Signup</Link>   </li>
          </ul>
        </nav>

        <Routes>
      
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
          
          <Route path="/about" element={<About />} /> 
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/" element={ <Home />} />

        </Routes>
    </Router>
  );
}

export default App;
