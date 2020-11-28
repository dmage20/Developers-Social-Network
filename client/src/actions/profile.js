import axios from 'axios'
import {setAlert} from './alert'
import {GET_PROFILE,
        PROFILE_ERROR,
        UPDATE_PROFILE,
        CLEAR_PROFILE,
        ACCOUNT_DELETED,
        GET_PROFILES,
        GET_REPOS} from './types'

export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            profile: res.data
        })
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config ={
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('api/profile', formData, config)
        dispatch({
            type: GET_PROFILE,
            profile: res.data
        })
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        if(!edit){
            history.push('/dashboard')
        }
    } catch (e) {
        // console.log(e.response.data)
        e.response.data.forEach(error => {

            dispatch(setAlert(error,'danger',5000))
        });
        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}
export const getProfiles = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_PROFILE })
        const res = await axios.get('api/profiles')
        dispatch({
            type: GET_PROFILES,
            profiles: res.data
        })
    } catch (e) {
      dispatch({
        type: PROFILE_ERROR,
        error: {msg: e.response.statusText, status: e.response.status}
    })
    }
}
export const getGithubRepos = (username) => async dispatch => {
  try {
      const res = await axios.get(`api/github/${username}`)
      dispatch({
          type: GET_REPOS,
          repos: res.data
      })
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      error: {msg: e.response.statusText, status: e.response.status}
  })
  }
}
export const getProfileById = (userId) => async dispatch => {
  try {
      dispatch({ type: CLEAR_PROFILE })
      const res = await axios.get(`api/profile/user/${userId}`)
      dispatch({
          type: GET_PROFILE,
          profile: res.data
      })
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      error: {msg: e.response.statusText, status: e.response.status}
  })
  }
}
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config ={
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('api/profile/experience', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            profile: res.data
        })
        dispatch(setAlert('Education Added', 'success'))


        history.push('/dashboard')

    } catch (e) {
        e.response.data.forEach(error => {

            dispatch(setAlert(error,'danger',5000))
        });
        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config ={
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('api/profile/education', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            profile: res.data
        })
        dispatch(setAlert('Experience Added', 'success'))


        history.push('/dashboard')

    } catch (e) {
        e.response.data.forEach(error => {

            dispatch(setAlert(error,'danger',5000))
        });
        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}
// Delete Account and Profile
export const deleteAccount  = () => async dispatch => {
    if(window.confirm('Are you sure? This can not be undone!')){
        try{
            const config ={
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.delete('api/profile', config)
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED})
            dispatch(setAlert('Your account has been permanetly removed'))

        } catch (e){
            dispatch({
                type: PROFILE_ERROR,
                error: {msg: e.response.statusText, status: e.response.status}
            })
        }
    }
}
// delete experience
export const deleteExperience = (id) => async dispatch => {
    try {

        const res = await axios.delete(`api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            profile: res.data
        })
        dispatch(setAlert('Experience Removed', 'success'))

    } catch (e) {

        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}
// delete education
export const deleteEducation = (id) => async dispatch => {
    try {

        const res = await axios.delete(`api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            profile: res.data
        })
        dispatch(setAlert('Education Removed', 'success'))

    } catch (e) {

        dispatch({
            type: PROFILE_ERROR,
            error: {msg: e.response.statusText, status: e.response.status}
        })
    }
}