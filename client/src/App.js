import React, { Component } from "react";
import ArticleList from "./components/articles/ArticleList";
import ArticleItems from "./components/articles/ArticleItems";
class App extends Component {
  constructor() {
    super();
    this.state = {
      articleItems: [],
    };
  }

  addArticle = (taskName) => {
    const newArticle = {
      text: taskName,
      key: Date.now(),
    };
    if (taskName !== null && taskName !== "") {
      const articleItems = [...this.state.articleItems, newArticle];
      this.setState({
        articleItems,
      });
    }
  };

  render() {
    return (
      <div>
        <ArticleList addArticle={this.addArticle} />
        <ArticleItems entries={this.state.articleItems} />
      </div>
    );
  }
}
export default App;
