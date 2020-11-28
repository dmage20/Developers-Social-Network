import React, {Fragment } from 'react'

import {connect} from 'react-redux'
import moment from 'moment'
import {deleteExperience} from '../../actions/profile'

const Experience = ({experince, deleteExperience}) => {
    const experiences = experince.map(exp => (
        <tr key={exp._id} >
            <td>{exp.company}</td>
            <td className="sm-hide">{exp.title}</td>
            <td>{moment(exp.from).format('MMMM Do, YYYY')} - {exp.to === null ? (' Now'):(' '+ moment(exp.to).format('MMMM Do, YYYY'))}</td>
            <td>
            <button className="btn btn-danger" onClick={()=>{deleteExperience(exp._id)}}>
                Delete
            </button>
            </td>
        </tr> 

    ))
    return (
        <Fragment>
        <h2 className="my-2">Experience Credentials</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th className="hide-sm">Title</th>
              <th className="hide-sm">Years</th>
            </tr>
          </thead>
          <tbody>{experiences}</tbody>
        </table>
        </Fragment>
    )
}


export default connect(null, {deleteExperience})(Experience)

