import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './compoments/auth/Login'
import Register from './compoments/auth/Register'
import Navbar from './compoments/layout/Navbar'
import Landing from './compoments/layout/Landing'
import Alert from './compoments/layout/Alert'
import Dashboard from './compoments/dashboard/Dashboard'
import CreateProfile from './compoments/profile-form/CreateProfile'
import EditProfile from './compoments/profile-form/EditProfile'
import AddExperience from './compoments/profile-form/AddExperience'
import addEducation from './compoments/profile-form/AddEducation'
import Profiles from './compoments/profiles/profiles'
import PrivateRoute from './compoments/routing/PrivateRoute'
import {loadUser} from './actions/auth'
import setAuthToken from './utils/setAuthToken'

// Redux------------------
import { Provider } from 'react-redux'
import store from './store'
// -----------------Redux
import './App.css';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const  App = () =>{
  useEffect(()=>{
    store.dispatch(loadUser())
  }, [])
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
      <Navbar />
      <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/profiles' component={Profiles}/>
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/add-education' component={addEducation} />

          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>

  )}

export default App;
