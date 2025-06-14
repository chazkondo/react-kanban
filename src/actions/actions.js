import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';
export const REORDER_ITEM = 'REORDER_ITEM';
export const CHANGE_ITEM_TYPE = 'CHANGE_ITEM_TYPE';
export const SET_VISIBLE_TO_TRUE = 'SET_VISIBLE_TO_TRUE';
export const SET_VISIBLE_TO_FALSE = 'SET_VISIBLE_TO_FALSE';

let cache = []; // Initialize cache

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                cache = [...response.data];
                for ( let i = 0; i < cache.length; i++ ) {
                    cache[i].sortingid = i+1;
                }
                dispatch({type: GET_ALL_ITEMS, payload: cache})
            })
            .catch( err => {
                console.log('Error fetching items:', err)
            })
    }
};

// 🎭 DEMO MODE: All modifications work locally but don't persist
export const addItem = (item) => {
    // Create new item with demo styling
    const newItem = {
        ...item,
        id: Date.now(), // Simple ID for demo
        sortingid: cache.length + 1,
        task: item.task || 'New Task',
        description: item.description || 'Demo task - changes not saved',
        priority: item.priority || 'Medium',
        type: item.type || 'Todo'
    };

    cache = [...cache, newItem];
    
    // Show demo notification instead of API call
    console.log('🎭 DEMO MODE: Task added locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: ADD_ITEM, payload: cache})
    }
};

export const deleteItemByIdAction = (item, currentCache) => {
    cache = cache.filter(cacheItem => cacheItem.id !== item.id);
    
    console.log('🎭 DEMO MODE: Task deleted locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: DELETE_ITEM_BY_ID, payload: cache})
    }
};

export const editItem = (item) => {
    const index = cache.findIndex(element => element.id === item.id);
    if (index !== -1) {
        cache[index] = { ...cache[index], ...item };
    }
    
    console.log('🎭 DEMO MODE: Task edited locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: EDIT_ITEM_BY_ID, payload: cache})
    }
};

export const reorderItem = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {
    let sameArr = cache.filter(item => item.type === destination.droppableId);
    let temp = sameArr[endIndex].sortingid-1;
    let temp2 = sameArr[startIndex].sortingid-1;
    let tempId = sameArr[endIndex].sortingid;

    sameArr[startIndex].sortingid = tempId; 
    let [removed] = cache.splice(temp2, 1);
    cache.splice(temp, 0, removed);

    for (let i = 0; i < cache.length; i++) {
      cache[i].sortingid = i+1
    };

    console.log('🎭 DEMO MODE: Items reordered locally (not saved to database)');

    return dispatch => {
        dispatch({type: REORDER_ITEM, payload: cache})
    }
};
  
export const changeItemType = (result) => {
    let sourceArr = cache.filter(item => item.type === result.source.droppableId)
    let changeType = sourceArr[result.source.index]
    changeType.type = result.destination.droppableId;

    console.log('🎭 DEMO MODE: Item moved locally (not saved to database)');
  
    return dispatch => {
        dispatch({type: CHANGE_ITEM_TYPE, payload: cache})
    } 
};

export const setVisibleTrue = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_TRUE, payload: true } )
    } 
};

export const setVisibleFalse = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_FALSE, payload: false } )
    } 
};
