
import './App.css';
import Header from './Components/Header';
import Dashboard from './Components/Pages/Dashboard';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Signup from './Components/Pages/Signup';


function App() {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
