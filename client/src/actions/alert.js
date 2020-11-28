import uuid from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType, timeOut = 3000) => dispatch => {
    const id = uuid.v4()
    dispatch({
        type: SET_ALERT,
        alert: {alertType, msg, id}
    })
    setTimeout(()=> {
        dispatch({
            type: REMOVE_ALERT,
            id
        })
    }, timeOut)
}