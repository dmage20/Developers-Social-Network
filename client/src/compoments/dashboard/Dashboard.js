import React, {useEffect, Fragment} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { getCurrentProfile, deleteAccount} from '../../actions/profile'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'


const  Dashboard = ({profile:{ profile, loading}, auth: {user}, getCurrentProfile, deleteAccount}) =>{
  useEffect(()=>{
      getCurrentProfile()
  },[getCurrentProfile])
  return loading && profile === null ? <Spinner /> : <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead" >
    <i className="fas fa-user"></i> Welcome  { user && user.name }
    </p>
    {profile !== null ? (
      <Fragment>
          <DashboardActions />
          <Experience experince={profile.experience} />
          <Education education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={()=> deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete my account
            </button>
          </div>
      </Fragment>
        ) : (
          <Fragment>
              <p>You have not created a profile yet</p>
              <Link to="/create-profile" className="btn btn-primary my-1" >
                  Create profile
              </Link>
          </Fragment>
          )}
    </Fragment>
}

const mapStateToProps = (state) =>({
    profile: state.profile,
    auth: state.auth
})
export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)

