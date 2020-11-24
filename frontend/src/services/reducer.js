import {getStats, getEvaluations, getUsers} from './evaluations'

const initialState = {
    users: [],
    evaluations: [],
    currentPage: 1,
    stats: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT':
            return action.data;
        case 'CHANGE_PAGE':
            return {...state, currentPage: action.data.currentPage, evaluations: action.data.evaluations}
        default:
            return state;
    }
}

export const initReducer = () => {
    return async dispatch => {
        const stats = await getStats();
        const evaluations = await getEvaluations();
        const users = await getUsers();
        dispatch({type: 'INIT', data: {users: users, evaluations: evaluations, stats: stats, currentPage: 1}});
    }
}

export const changePageTo = (page) => {
    return async dispatch => {
        const evaluations = await getEvaluations(page);
        dispatch({type: 'CHANGE_PAGE', data: {currentPage: page, evaluations: evaluations}})
    }
}

export default reducer;