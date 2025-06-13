import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { addItem } from './actions/actions.js';

class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      task: null,
      description: null,
      type: 'Todo',
      currentNum: 1
    }
  }

  handleSubmit = (e) => {

    e.preventDefault()
    this.props.dispatch(addItem(this.state, this.props.moreProps));
    const addform = document.getElementById('addform');
    addform.reset();
    this.props.triggerClose();
  }

  handleChange = (e) => {

    const target = e.target
    const value = target.value;
    const name = target.name;
    this.setState( {
      [name] : value
    })
  }

  render() {
    return (
      <div className="Done padding" action="/" method="post">
        <form id="addform" onSubmit={this.handleSubmit}>
          <label> Task:
            <input onChange={this.handleChange} name="task" type="text" required/>
          </label> 
          <br />
          <label> Description:
            <input onChange={this.handleChange} name="description" type="text" required/>
          </label>
          <br />
          <label> Priority:
            <input onChange={this.handleChange} name="priority" type="text" required/>
          </label>
          <br />
          <label> Type:
            <select onChange={this.handleChange} name="type">
              <option name="todo" value="Todo">In Queue</option>
              <option name="doing" value="Doing">In Progress</option>
              <option name="done" value="Done">Completed</option>
            </select>
          </label>
          <br />
          <input id="addSubmit" type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default connect()(ItemForm)