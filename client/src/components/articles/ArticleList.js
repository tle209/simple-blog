import React, { Component } from "react";
class ArticleList extends Component {
  handleInput = (e) => {
    e.preventDefault();
    const taskName = this.refs.taskInput.value;
    this.props.addArticle(taskName);

    // reset and focus again on input form
    this.refs.taskInput.value = "";
    this.refs.taskInput.focus();
  };
  render() {
    return (
      <div className="todoListMain">
        <div className="header">
          <form onSubmit={this.handleInput}>
            <input placeholder="Task" ref="taskInput" />
            <button type="submit"> *Add Task*</button>
          </form>
        </div>
      </div>
    );
  }
}
export default ArticleList;
