import React, {Fragment } from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {deleteEducation} from '../../actions/profile'

const Education = ({education, deleteEducation}) => {
    const educations = education.map(edu => (
        <tr key={edu._id} >
            <td>{edu.school}</td>
            <td className="sm-hide">{edu.degree}</td>
            <td>{moment(edu.from).format('MMMM Do, YYYY')} - {edu.to === null ? (' Now'):(' '+ moment(edu.to).format('MMMM Do, YYYY'))}</td>
            <td>
            <button className="btn btn-danger" onClick={()=>{deleteEducation(edu._id)}} >
                Delete
            </button>
            </td>
        </tr> 

    ))
    return (
        <Fragment>
        <h2 className="my-2">Education Credentials</h2>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th className="hide-sm">Degree</th>
              <th className="hide-sm">Years</th>
            </tr>
          </thead>
          <tbody>{educations}</tbody>
        </table>
        </Fragment>
    )
}


export default connect(null, {deleteEducation})(Education)

