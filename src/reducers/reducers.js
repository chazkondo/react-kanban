import { GET_ALL_ITEMS, ADD_ITEM, DELETE_ITEM_BY_ID, EDIT_ITEM_BY_ID, REORDER_ITEM, CHANGE_ITEM_TYPE, SET_VISIBLE_TO_FALSE, SET_VISIBLE_TO_TRUE } from '../actions/actions.js';

const itemReducer = (state = {visible: false, items: []}, action) => {
    switch (action.type) {
        case GET_ALL_ITEMS:
            return { ...state, items: action.payload }
        case ADD_ITEM:
            return { ...state, items: action.payload }
        case DELETE_ITEM_BY_ID:
            return { ...state, items: [...action.payload] }
        case EDIT_ITEM_BY_ID:
            return { ...state, items: [...action.payload] }
        case REORDER_ITEM:
            return { ...state, items: action.payload }
        case CHANGE_ITEM_TYPE:
            return { ...state, items: action.payload }
        case SET_VISIBLE_TO_TRUE:
            return { ...state, visible: action.payload }
        case SET_VISIBLE_TO_FALSE:
            return { ...state, visible: action.payload }
        default:
            return state
    }
}

export default itemReducer;