import React, {Component} from 'react';
import './App.css';

function NavBar() {
  return (
    <div className='navbar'>
      <div className='title'>Jack's blog</div>
      <div className='new-post-container'>
        <button className='new-post-button'>New post</button>
      </div>
    </div>
  );
};

class Post extends Component {
  render() {
    return (
      <div className='post-container'>
        <div className='title'>{this.props.title}</div>
        <div className='content'>{this.props.content}</div>
        <div>
          <span>{this.props.dateCreated}, </span>
          <span>Posted by {this.props.author}</span>
        </div>
      </div>
    );
  };
};

class PostParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: []
    };
  };

  componentDidMount() {
    fetch('http://localhost:3000/blogPosts')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({blogPosts: data});
      })
  }

  render() {
    return (
      <div className='post-parent'>
        {this.state.blogPosts.map((post) => {
          return <Post
            key={post._id}
            author={post.author}
            dateCreated={new Date(post.dateCreated).toLocaleDateString()}
            title={post.title}
            content={post.content} 
          />
        })}
      </div>
    );
  };
};

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className='main'>
        <PostParent/>
      </div>
    </div>
  );
};

export default App;
