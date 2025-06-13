import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editItem } from './actions/actions.js';
import { closeEdit } from './App.js';

class ItemEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.item.id,
      task: props.item.task,
      description: props.item.description,
      priority: props.item.priority,
      type: props.item.type,
      sortingid: props.item.sortingid
    }
  }

  handleSubmit = (e) => {

    e.preventDefault()
    this.props.dispatch(editItem(this.state));
    const editform = document.getElementById('editform');
    editform.reset();
    closeEdit(this.state.id);
  }

  handleChange = (e) => {

    let target = e.target
    let value = target.value;
    let name = target.name;
    this.setState( {
      [name] : value
    })
  }

  render() {
    return (
      <div id={this.state.id} className="EditItem" action="/:id" method="put">
        <form id="editform" className="EditForm" onSubmit={this.handleSubmit}>
          <br />
          <label> 
            <input className="input" value={this.state.task} onChange={this.handleChange} name="task" type="text"/>
          </label> 
          <label>
            <input className="input" value={this.state.priority} onChange={this.handleChange} name="priority" type="text"/>
          </label>
          <label> 
            <input className="input" value={this.state.description} onChange={this.handleChange} name="description" type="text"/>
          </label>
          <input className="noshow" type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default connect()(ItemEdit)