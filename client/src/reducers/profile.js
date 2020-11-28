import { PROFILE_ERROR,
        GET_PROFILE,
        CLEAR_PROFILE ,
        UPDATE_PROFILE,
        GET_PROFILES,
        GET_PROFILE_BY_ID,
        GET_REPOS} from '../actions/types'

const initalState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default (state = initalState, action)=> {
    switch(action.type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
        return {
            ...state,
            profile: action.profile,
            loading: false

        }
        case GET_PROFILES:
        return {
            ...state,
            profiles: action.profiles,
            loading: false
        }
        case GET_REPOS:
        return {
          ...state,
          repos: action.repos
        }
        case PROFILE_ERROR:
        return {
            ...state,
            loading: false,
            error: action.error
        }
        case CLEAR_PROFILE:
        return {
            ...state,
            profile: null,
            repos: [],
            loading: false
        }
        default:
        return state
    }

}