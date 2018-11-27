import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import _ from "lodash";

class App extends Component {
  state = {
    title: "",
    taskList: []
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  handleClick = (event, i) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/update/" + this.state.taskList[i]._id)
      .then(response => {
        let taskList = [...this.state.taskList];
        taskList[i] = response.data;
        taskList = _.orderBy(taskList, ["done", "title"], ["asc", "asc"]);
        this.setState({
          taskList
        });
      });
  };

  handleClickOnCross = (event, i) => {
    event.preventDefault();
    const deletedTaskedList = [...this.state.taskList];
    deletedTaskedList[i] = deletedTaskedList.slice(i, 1);
    this.setState({
      taskList: deletedTaskedList
    });
    axios.post("http://localhost:3001/delete/" + this.state.taskList[i]._id);
  };

  onSubmit = event => {
    axios
      .post("http://localhost:3001/create", {
        title: this.state.title
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  taskList() {
    const taskList = [];
    for (let i = 0; i < this.state.taskList.length; i++) {
      taskList.push(
        <div className="taskList" key={i}>
          <div
            onClick={event => {
              this.handleClick(event, i);
            }}
            style={{
              textDecoration: this.state.taskList[i].done
                ? "line-through"
                : "none"
            }}
          >
            {this.state.taskList[i].title}
          </div>
          <div
            onClick={event => {
              this.handleClickOnCross(event, i);
            }}
          >
            <i className="fas fa-trash-alt" />
          </div>
        </div>
      );
    }
    return taskList;
  }

  render() {
    return (
      <div className="App">
        <h1>To Do List</h1>
        <ul>{this.taskList()}</ul>
        <form onSubmit={this.onSubmit}>
          <input
            placeholder="   to do..."
            id="title"
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <button>AJOUTER</button>
        </form>
      </div>
    );
  }

  componentDidMount() {
    axios.get("http://localhost:3001/").then(response => {
      this.setState({
        taskList: response.data
      });
      console.log(response.data);
    });
  }
}

export default App;
