import React, { Fragment, useEffect } from 'react'
// import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import { getProfiles } from '../../actions/profile'
// import profile from '../../reducers/profile'

function Profiles({ getProfiles, profile: { profiles, loading } }) {
  useEffect(() => {
    getProfiles();
  }, [getProfiles])

  return <Fragment>
  { loading ? <Spinner></Spinner> : <Fragment>
      <h1 className="large.text-primary"> Developers </h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"> Browse and connect with developers </i>
        <div className="profiles">
          { profiles.length > 0 ? (
            profiles.map( profile => (
              <ProfileItem key={profile._id} profile={profile}/>
            ))
          ) : <h4> No profiles found...</h4> }
         </div>
       </p>
    </Fragment>};
  </Fragment>
}

Profiles.propTypes = {

}
const mapStateToProps = (state)=> ({
  profile: state.profile
})
export default connect(mapStateToProps, { getProfiles })(Profiles)

