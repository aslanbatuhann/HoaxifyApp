import React from 'react';
import LanguageSelector from '../components/LanguageSelector';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/index";
import SignUp from "../pages/Auth/Signup";
import SignIn from "../pages/Auth/Signin";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage/UserPage";

const App = () => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn
    }));
  
    return (
      <div>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={HomePage} />
            {!isLoggedIn && <Route path="/login" component={SignIn} />}
            <Route path="/signup" component={SignUp} />
            <Route path="/user/:username" component={UserPage} />
            <Redirect to="/" />
          </Switch>
          <div>
            <LanguageSelector />
          </div>
        </Router>
      </div>
    );
}

export default App;