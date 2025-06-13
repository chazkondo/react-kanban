import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { getAllItems, deleteItemByIdAction, reorderItem, changeItemType, setVisibleTrue, setVisibleFalse } from './actions/actions.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Rodal from 'rodal';
import ItemForm from './ItemForm.js';
import ItemEdit from './EditItem.js';
import './App.css';
import 'rodal/lib/rodal.css';

library.add(faEdit);
library.add(faPencilAlt);

class App extends Component {
  constructor(props) {
    super(props)
  }
  
  // Show and hide update the state to show/hide the add-task modal
  show = () => {
    this.props.dispatch(setVisibleTrue());
  }

  hide = () => {
    this.props.dispatch(setVisibleFalse());
  }

  // onDragEnd is fired from react-beautiful-dnd when a drag-drop item is dragged somewhere
  onDragEnd = result => {

    const { source, destination } = result;
    const list = this.props.items.items;

    // If destination does not exist, return nothing
    if (!destination) {
      return;
    };

    // Need to clean up parameters here. While learning, I passed all parameters in to better understand react and drag and drop
    if (source.droppableId === destination.droppableId) {
      this.reorder(result, list, source.index, destination.index, destination, source, this.props.items.items);
    } else {
      this.move(result);
    };
  };

  // reorder is called by onDragEnd; This reorders if the destination drag location matches the source drag location
  reorder = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {
  this.props.dispatch(reorderItem( result, list, startIndex, endIndex, destination, source, currentCache ));
  };

  // move is called by onDragEnd; This changes the item type to match the destination location item type
  move = (result) => {
    this.props.dispatch(changeItemType(result));
  };

  componentDidMount() {
    this.updateStateFromDb();
  };

  updateStateFromDb = () => {
    this.props.dispatch(getAllItems());
  };

  deleteItemById = (item) => {
    this.props.dispatch(deleteItemByIdAction(item));
  };


  render() {
    return (
      <div className="App">

        {/* This is my header */}
        <header className="App-header">
          <h1 id="Home" onClick={console.log('uhh make this redirect to home?')} className="title-left">KANBAN</h1>
          <div>
            <p className="title-right" onClick={this.show.bind(this)}><span id="AddItem">+</span><span id="enlarge">+</span> NEW TASK</p>
            <span className="title-right-minus" onClick={ () => {for (let i = 1; i < this.props.items.items.length+1; i++) {ToggleOff(i)}} }>-</span>
            <span className="title-right-plus" onClick={ () => {for (let i = 1; i < this.props.items.items.length+1; i++) {ToggleAll(i)}} }>+</span>
            
            {/* Modal library */}
            <Rodal animation='door' duration='800' visible={this.props.items.visible} onClose={this.hide.bind(this)}>
              <div className="shortDiv" ><ItemForm triggerClose={this.hide.bind(this)} addItem={this.addItem}/></div>
            </Rodal>

          </div>
        </header>

        {/* This is my body; I want to implement routing soon */}
        <div className="App-content">

          {/* Begin drag drop context */}
          <DragDropContext onDragEnd={this.onDragEnd}>

            {/* To-do drop zone */}
            <ul>
              <h1 className="taskTitle">IN QUEUE</h1>
              <Droppable droppableId="Todo">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    <Todo props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ul>

            <hr className="border" />
            
            {/* Doing drop zone */}
            <ul>
              <h1 className="taskTitle">IN PROGRESS</h1>
              <Droppable droppableId="Doing">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    <Doing props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ul>

            <hr className="border" />

            {/* Done drop zone */}
            <ul>
              <h1 className="taskTitle">COMPLETED</h1>
              <Droppable droppableId="Done">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    <Done props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ul>

          </DragDropContext>

        </div>
      </div>
    );
  }

}

// Will export these components to their own file in future update; Will try to filter out junk into functions/classes
class Todo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Todo').map((item, index) => (
        <li className="task">
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div className="Todo card" ref={provided.innerRef} 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={TodoStyle(snapshot.isDragging, provided.draggableProps.style)}>

                <span className="expand" onClick={ () => GetDescription(item.sortingid)}>
                  [ Expand ]
                </span>

                <span className="isHighlighted">
                  {item.task}
                </span>

                <span onClick={ () => ToggleEdit(item.id) } className="edit">
                  <FontAwesomeIcon className="edit2" icon="edit" />
                </span>

                <span onClick={ () => this.props.deleteItemById(item, this.props.items.items)} className="x">x</span>

                <div id={item.sortingid} className="desc">
                  <br />
                  <span className='bold'>
                    Priority: 
                  </span>

                  {item.priority}
                  <br/>
                  {item.description}

                  <span className="showless" onClick={ () => GetDescription(item.sortingid)}>
                    [ Show Less ]
                  </span>

                </div>
                <ItemEdit currentCache={this.props.props.items.items} item={item}/>

              </div>
            )}
          </Draggable>
        </li>
      ))
    );
  }
}

// Will export these components to their own file in future update; Will try to filter out junk into functions/classes
class Doing extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Doing').map((item, index) => (
        <li className="task">
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div className="Doing card" ref={provided.innerRef} 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={DoingStyle(snapshot.isDragging, provided.draggableProps.style)}>

                <span className="expand" onClick={ () => GetDescription(item.sortingid)}>
                  [ Expand ]
                </span>

                <span className="isHighlighted">
                  {item.task}
                </span>

                <span onClick={ () => ToggleEdit(item.id) } className="edit">
                  <FontAwesomeIcon className="edit2" icon="edit" />
                </span>

                <span onClick={ () => this.props.deleteItemById(item, this.props.props.items.items)} className="x">
                  x
                </span>

                <div id={item.sortingid} className="desc">
                  <br />
                  <span className='bold'>
                    Priority: 
                  </span>

                  {item.priority}
                  <br/>
                  {item.description}

                  <span className="showless" onClick={ () => GetDescription(item.sortingid)}>
                    [ Show Less ]
                  </span>

                </div>
                <ItemEdit currentCache={this.props.props.items.items} item={item}/>

              </div>
            )}
          </Draggable>
        </li>
      ))
    );
  }
}

// Will export these components to their own file in future update; Will try to filter out junk into functions/classes
class Done extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Done').map((item, index) => (
        <li className="task">
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div className="Done card" ref={provided.innerRef} 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={DoneStyle(snapshot.isDragging, provided.draggableProps.style)}>

                <span className="expand" onClick={ () => GetDescription(item.sortingid)}>
                  [ Expand ]
                </span>

                <span className="isHighlighted">
                  {item.task}
                </span>

                <span onClick={ () => ToggleEdit(item.id) } className="edit">
                  <FontAwesomeIcon className="edit2" icon="edit" />
                </span>

                <span onClick={ () => this.props.deleteItemById(item, this.props.props.items.items)} className="x">
                  x
                </span>

                <div id={item.sortingid} className="desc">
                  <br />
                  <span className='bold'>
                    Priority: 
                  </span>

                  {item.priority}
                  <br/>
                  {item.description}

                  <span className="showless" onClick={ () => GetDescription(item.sortingid)}>
                    [ Show Less ]
                  </span>

                </div>
                <ItemEdit currentCache={this.props.props.items.items} item={item}/>

              </div>
            )}
          </Draggable>
        </li>
      ))
    );
  }
}

// Todo drag-drop styling that works with beautiful-dnd
const TodoStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,    
  background: isDragging ? 'lightblue' : 'rgb(253, 241, 222)',
  ...draggableStyle
});

// Doing drag-drop styling that works with beautiful-dnd
const DoingStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,
  background: isDragging ? 'lightblue' : 'rgb(229, 253, 204)',
  ...draggableStyle
});

// Done drag-drop styling that works with beautiful-dnd
const DoneStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,
  background: isDragging ? 'lightblue' : 'rgb(246, 247, 250)',
  ...draggableStyle
});

// General drag-drop styling that works with beautiful-dnd
const getListStyle = isDraggingOver => ({
  border: isDraggingOver ? '1px solid lightblue' : '1px solid white',
  overflow: 'auto',
  padding: 8,
  width: 300,
  height: 530
});

// Toggles description by clicking expand; Looking to condense code in future updates via helper functions/better array iteration
const GetDescription = (itemID) => {
  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
      if ( toggleThis.style.display === 'block'){
        toggleThis.style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
      } else {
        toggleThis.style.display = 'block';
        allExpandItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

// Closes edit form/ Toggles description off by clicking '-'; Looking to condense code in future updates via helper functions/better array iteration
export const closeEdit = (itemID) => {
  let allEditItems = document.getElementsByClassName('EditItem');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let toggleThis;

  for (let i = 0; i < allEditItems.length; i++) {
    if ( allEditItems[i].id == itemID ) {
      toggleThis = allEditItems[i];
      toggleThis.style.display = 'none';
      allExpandItems[i].style.display = 'block';
      allHighlightedItems[i].style.fontWeight = 'normal';
      allHighlightedItems[i].style.fontSize = '14px';
      allHighlightedItems[i].style.textTransform = 'none';
    }
  }
}

// Toggles all description by clicking '+'; Looking to condense code in future updates via helper functions/better array iteration
const ToggleAll = (itemID) => {
  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let allEditItems = document.getElementsByClassName('EditItem');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
        toggleThis.style.display = 'block';
        allEditItems[i].style.display = 'none';
        allExpandItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
    }
  }
}

// Toggles description off by clicking '-'; Looking to condense code in future updates via helper functions/better array iteration
const ToggleOff = (itemID) => {
  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let allEditItems = document.getElementsByClassName('EditItem');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
      toggleThis.style.display = 'none';
        allEditItems[i].style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
    }
  }
}

// Toggles edit form off by clicking '-'; Looking to condense code in future updates via helper functions/better array iteration
const ToggleEdit = (itemID) => {
  let allEditItems = document.getElementsByClassName('EditItem');
  let allExpandItems = document.getElementsByClassName('expand');
  let allDescItems = document.getElementsByClassName('desc');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let toggleThis;
  for (let i = 0; i < allEditItems.length; i++) {
    if ( allEditItems[i].id == itemID ) {
      toggleThis = allEditItems[i];
      if ( toggleThis.style.display === 'block') {
        toggleThis.style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
      } else {
        toggleThis.style.display = 'block'
        allExpandItems[i].style.display = 'none';
        allDescItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    items: state
  }
}

export default connect(mapStateToProps)(App);