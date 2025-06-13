import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';
export const REORDER_ITEM = 'REORDER_ITEM';
export const CHANGE_ITEM_TYPE = 'CHANGE_ITEM_TYPE';
export const SET_VISIBLE_TO_TRUE = 'SET_VISIBLE_TO_TRUE';
export const SET_VISIBLE_TO_FALSE = 'SET_VISIBLE_TO_FALSE';

let cache;

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
                // console.log(err, 'err')
            })
    }
};

export const addItem = (item) => {

    cache = [...cache, item];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
    };

    axios.post('/', item)
    .then( response => {
    //   console.log('response', response.data);
    })
    .catch( err => {
    //   console.log('err in addItem action axios call', err)
    });
    return dispatch => {
        dispatch({type: ADD_ITEM, payload: cache})
    }
  };

  export const deleteItemByIdAction = (item, currentCache) => {
    
    const index = cache.findIndex(element => element.sortingid === item.sortingid);
    cache[index].type = false;
    cache = [...cache];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
    };

    axios.delete('/:id', { data: { item } })
        .then( response => {
        //   console.log('DELETE response', response.data);
        })
        .catch( err => {
        //   console.log('err in delete action axios call', err)
        })

    return dispatch => {
        dispatch({type: DELETE_ITEM_BY_ID, payload: cache})
    }
  };

  export const editItem = (item) => {

    const index = cache.findIndex(element => element.sortingid === item.sortingid);
    cache[index].task = item.task;
    cache[index].description = item.description;
    cache[index].priority = item.priority;

    axios.put('/:id', { item })
    .then( response => {
    //   console.log('Edit response', response.data)
    })
    .catch( err => {
    //   console.log('err in addItem action axios call', err)
    })

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

    axios.put('/save', { currentCache })
    .then( response => {
      console.log('Edit response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    })

    return dispatch => {
        dispatch({type: REORDER_ITEM, payload: cache})
    }
  };
  
  export const changeItemType = (result) => {

    let sourceArr = cache.filter(item => item.type === result.source.droppableId)
    let changeType = sourceArr[result.source.index]
    changeType.type = result.destination.droppableId;

    const item = changeType;

    axios.put('/:id', { item })
    .then( response => {
      console.log('Edit response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    });
  
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