import React, {Component} from 'react';
import './App.css';
import {commentData} from './comment_data.js';

class Post extends Component {
  render() {
    return (
    <div className='post'>
      <h2 className='postAuthor'>{this.props.postAuthor}<span className='postContent'>: {this.props.postContent}</span></h2>
      {this.props.children}
    </div>
    )
  };
}

class Comment extends Component {
  render() {
    return (
      <div className='comment'>
        <h2 className='commentAuthor'>
          {this.props.user}<span className='commentContent'>: {this.props.content}</span>
        </h2>
      </div>
    )
  };
}

class CreateComment extends Component {
  constructor() {
    super();
    this.state = {
      content: '',
      user: ''
    };
  }

  handleUserChange = (event) => {
    const val = event.target.value;
    this.setState(
      () => ({
        user: val
      })
    );
  }

  handleTextChange = (event) => {
    const val = event.target.value;
    this.setState(
      () => ({
        content: val
      })
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onCommentSubmit({
      user: this.state.user.trim(),
      content: this.state.content.trim()
    });
    this.setState(
      () => ({
        user: '',
        content: ''
        })
    )
  }

  render() {
    return (
      <form className='createComment' onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Your name' value={this.state.user} onChange={this.handleUserChange}/>
        <input type='text' placeholder='Thoughts?' value={this.state.content} onChange={this.handleTextChange}/>
        <input type='submit' value='Post'/>
      </form>
    )
  }
}


class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
  }

  handleCommentSubmit = (comment) => {
    const comments = this.state.comments;
    comment.key = Date.now();
    const newComments = comments.concat([comment]);
    this.setState({
      comments: newComments
    });
  }

  render() {
    return (
      <div className='commentBox'>
        <Post postAuthor={this.props.post.user} postContent={this.props.post.content}/>
        {this.state.comments.map((comment) => {
          return <Comment 
            key={comment.key} 
            user={comment.user}
            content={comment.content}/>
        })}
        <CreateComment onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <CommentBox comments={commentData.comments} post={commentData.post}/>
    </div>
  );
}

export default App;
