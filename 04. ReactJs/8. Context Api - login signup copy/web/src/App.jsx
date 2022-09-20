import './App.css';

import NavBar from "./components/navbar";
import Home from "./components/home";
import About from "./components/about";
import Gallery from "./components/gallery";
import Login from "./components/login";
import Signup from "./components/signup";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";







function App() {
  return (
    <Router>

      <NavBar />

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
